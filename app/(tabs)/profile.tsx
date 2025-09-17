import { StyleSheet, Image, ScrollView, Button, Pressable, View as RNView,TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { clearAllStorage } from '@/scripts/db';
import { getImageByUserId } from '@/scripts/userapi';
import institutions from "@/data/institutions.json";

interface UserImage {
  userId: number;
  imageId: number;
  imageUrl: string; // Base64 string
}


export default function ProfileScreen() {
  const [userData, setUserData] = useState<any>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const router = useRouter();

useEffect(() => {
  const fetchUserData = async () => {
    try {
      const user = await import('@/scripts/db').then(module =>
        module.getFromStorage('user')
      );

      if (!user) {
        alert(user)
        console.log(user)
        router.replace('/login');
        return;
      }

      setUserData(user);

      const rawData: any = user;
      const id = rawData.user.userId;

      setUserId(id);

      if (id) {
        const imageResponse = await getImageByUserId(id);
        if (imageResponse?.imageUrl) {
          setImageUri(imageResponse.imageUrl);
        }
        else{
          setImageUri(null);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
     // router.replace('/login');
    }
  };

  fetchUserData();
}, []);


  useEffect(() => {
    console.log("user id:", userId);
  },[userId]);

  if (!userData) {
    return (
        <View style={styles.container}>
          <Text>Loading profile...</Text>
        </View>
    );
  }

  const user = userData.user;

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial;
  };

  const handleLogout = async () => {
    try {
      await clearAllStorage();
      router.replace('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleCompleteProfile = () => {
    router.push('/editprofile');
  };

  const handlePreviewProfile = () => {
    router.push('/previewprofile');
  };

    const handleEditPreferences = () => {
    router.push('/editpreferences');
  };

return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable onPress={() => router.push("/editimage")}>
        {imageUri ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${imageUri}` }}
            style={styles.profileImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>
              {getInitials(user.firstName, user.lastName)}
            </Text>
          </View>
        )}
      </Pressable>

      {/* Name + Age on same row */}
      <View style={styles.nameRow}>
        <Text style={styles.name}>
          {user.firstName} {user.lastName}
        </Text>
        <Text style={styles.age}>{user.age}</Text>
      </View>

      {/* Gender */}
      <Text style={styles.infoText}>{user.gender}</Text>

      {/* Institution */}
      <Text style={styles.institution}>
  {institutions.find(inst => inst.key === user.institution)?.label || user.institution}
</Text>


      {/* Bio */}
      {user.bio ? (
        <Text style={styles.bio}>"{user.bio}"</Text>
      ) : null}

      {/* Buttons */}
      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handlePreviewProfile}>
        <Text style={styles.buttonText}>Preview Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleCompleteProfile}>
        <Text style={styles.buttonText}>Update Profile</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={() => {}}>
        <Text style={styles.buttonText}>Emergency Contacts</Text>
      </TouchableOpacity> */}

      <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleEditPreferences}>
        <Text style={styles.buttonText}>Edit Preferences</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 80,
    marginBottom: 15,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f3e5f5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  placeholderText: {
    fontSize: 28,
    fontWeight: "700",
    color: "#9b59b6",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    marginRight: 8,
  },
  age: {
    fontSize: 18,
    fontWeight: "600",
  },
  infoText: {
    fontSize: 15,
    color: "#333",
    marginBottom: 2,
  },
  institution: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#444",
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: "#c85bdf",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
    width: "70%",
  },
  secondaryButton: {
    backgroundColor: "#d891ef",
  },
  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e74c3c",
  },
  logoutText: {
    color: "#e74c3c",
    fontSize: 15,
    fontWeight: "600",
  },
});

