import { StyleSheet, Dimensions, Image, TouchableOpacity,  Text, View } from 'react-native';
import { useEffect, useState, useRef } from "react";
import { getAllUsers } from '@/scripts/userapi';
import Swiper from 'react-native-deck-swiper';
import { Ionicons } from "@expo/vector-icons";
import ChevronIconUp from "@/assets/images/chevron_up.png";
import ChevronIconDown from "@/assets/images/chevron_down.png";
import { addLike, isLiked,createMatch } from '@/scripts/userapi';
import { router } from 'expo-router';
import institutions from "@/data/institutions.json";
import orientations from "@/data/orientations.json";
import genders from "@/data/genders.json";
import interests from "@/data/interests.json";
import courses from "@/data/courses.json";

type User = {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  age: number;
  bio: string;
  institution: string;
  gender: string;
  course: string;
  interests: string[];
  imageBase64: string | null;
  preferenceId: number | null;
  preferredInterests: string[] | null;
  relationshipType: string | null;
  minAge: number;
  maxAge: number;
  preferredGender: string | null;
  preferredCourses: string[] | null;
  maxDistance: number;
  smokingPreference: boolean;
  drinkingPreference: boolean;
  likedUserIds: number[];
  likedByUserIds: number[];
};

export default function TabOneScreen() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const swiperRef = useRef<Swiper<User>>(null);
  const [userData, setUserData] = useState<any>(null);
  const [userId, setUserId] = useState<number | null>(null);

useEffect(() => {
  const fetchUsers = async () => {
    try {
      const allUsers = await getAllUsers();
      if (allUsers) {

        setUsers(prevUsers => {
          if (userId !== null) {
            return allUsers.filter(u => u.userId !== userId);
          }
          return allUsers;
        });
      }
    } catch (err) {
      alert("Error fetching users");
    }
  };
  fetchUsers();
}, [userId]); 


useEffect(() => {
  const fetchUserData = async () => {
    try {
      const user = await import('@/scripts/db').then(module =>
        module.getFromStorage('user')
      );

      if (!user) return;

      setUserData(user);
      const rawData: any = user;
      const id = rawData.user.userId;
      setUserId(id);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  fetchUserData();
}, []);


  const handleSwiped = (index: number) => {
    setCurrentIndex(index + 1);
    if (index + 1 >= users.length) {
      alert("You've seen everyone available!");
    }
  };

 const handleLike = async () => {
  const currentUser = users[currentIndex];
  if (!currentUser || !userId) return;

  try {
    // First, add the like
    const liked = await addLike(userId, currentUser.userId);

    if (!liked) {
      alert("Failed to like user. Try again.");
      return;
    }

    // Then check if a match is made
    const match = await createMatch(userId, currentUser.userId);

    if (match) {
      // Only show match message
      alert(`It's a match with ${currentUser.firstName}!`);
      router.push('/matches');
    } else {
      // Only show like message
      alert(`You liked ${currentUser.username}!`);
    }

    // Swipe the card
    swiperRef.current?.swipeRight();
    if (currentIndex < users.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      alert("You've seen everyone available!");
    }

  } catch (err) {
    console.error("Error liking user:", err);
    alert("An error occurred while liking user.");
  }
};

  const handleDislike = () => swiperRef.current?.swipeLeft();

  const currentUser = users[currentIndex];

  return (
    <View style={styles.container}>
      {users.length > 0 ? (
        <View style={styles.cardContainer}>
          {currentUser ? (
            <>
              {!isExpanded ? (
                // Card View
                <View style={styles.card}>
                  {currentUser.imageBase64 ? (
                    <Image
                      source={{ uri: `data:image/jpeg;base64,${currentUser.imageBase64}` }}
                      style={styles.image}
                    />
                  ) : (
                    <View style={[styles.image, styles.placeholder]}>
                      <Text>No Image</Text>
                    </View>
                  )}
                  <Text style={styles.text}>
                    {currentUser.firstName} {currentUser.lastName}         {currentUser.age}
                  </Text>
                  <View
                    style={{flexDirection: "row", alignItems: "center", marginVertical: 5}}
                  >
                    <Text style={styles.bioText}>{currentUser.bio}</Text>
                  <TouchableOpacity
                    style={styles.arrowBtn}
                    onPress={() => setIsExpanded(true)}
                  >
                    {/* <Ionicons name="chevron-up" size={30} color="#9b59b6" /> */}
                    <Image source={ChevronIconUp} style={{ width: 40, height: 40, marginLeft: 5 }} />
                  </TouchableOpacity>
                  </View>
                  <View style={styles.cardButtonContainer}>
                    <TouchableOpacity
                      style={styles.dislikeBtn}
                      onPress={() => {
                        if (currentIndex < users.length - 1) setCurrentIndex(currentIndex + 1);
                        else alert("You've seen everyone available!");
                      }}
                    >
                      <Ionicons name="close" size={30} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.likeBtn}
                      onPress={() => {
                        handleLike();
                        if (currentIndex < users.length - 1) setCurrentIndex(currentIndex + 1);
                        else alert("You've seen everyone available!");
                      }}
                    >
                      <Ionicons name="heart" size={30} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                // Expanded View
                <View style={styles.expandedCard}>
                  {currentUser.imageBase64 ? (
                    <Image
                      source={{ uri: `data:image/jpeg;base64,${currentUser.imageBase64}` }}
                      style={styles.image}
                    />
                  ) : (
                    <View style={[styles.image, styles.placeholder]}>
                      <Text>No Image</Text>
                    </View>
                  )}
                  <Text style={styles.text}>
                    {currentUser.username} ({currentUser.firstName} {currentUser.lastName}) - Age {currentUser.age}
                  </Text>
                 
                  <Text>{institutions.find(inst => inst.key === currentUser.institution)?.label || currentUser.institution}</Text>
                  <Text>{courses.find(inst => inst.key === currentUser.course)?.label || currentUser.course}</Text>
                  <Text>Interests: {currentUser.interests.join(", ")}</Text>
                  <Text>Smoker? {currentUser.smokingPreference ? "Yes" : "No"}</Text>
                  <Text>Drinker? {currentUser.drinkingPreference ? "Yes" : "No"}</Text>
                  <Text>Looking for: {currentUser.relationshipType}</Text>
                  <TouchableOpacity
                    style={styles.arrowBtn}
                    onPress={() => setIsExpanded(false)}
                  >
                    <Image source={ChevronIconUp} style={{ width: 40, height: 40 }} />
                  </TouchableOpacity>
                </View>
              )}
            </>
          ) : (
            <Text>No more users</Text>
          )}
        </View>
      ) : (
        <Text style={{ marginTop: 100 }}>Loading users...</Text>
      )}
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  cardContainer: {
    width: "90%",
    alignItems: "center",
  },
  card: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    alignItems: "center",
    paddingVertical: 15,
  },
  expandedCard: {
    width: "100%",
    borderRadius: 20,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  image: {
    width: "85%",
    height: 250,
    borderRadius: 12,
    resizeMode: "cover",
    marginBottom: 10,
  },
  placeholder: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginVertical: 5,
    textAlign: "center",
  },
  bioText: {
    fontSize: 12,
    color: "#666",
    marginVertical: 5,
    textAlign: "center",
  },
  cardButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    marginTop: 15,
    marginBottom: 5,
  },
  dislikeBtn: {
    backgroundColor: "#e74c3c",
    borderRadius: 50,
    padding: 15,
    marginHorizontal: 20,
    elevation: 4,
  },
  likeBtn: {
    backgroundColor: "#9b59b6",
    borderRadius: 50,
    padding: 15,
    marginHorizontal: 20,
    elevation: 4,
  },
  arrowBtn: {
    marginVertical: 10,
    width: 30,
    height: 30,
  },
});