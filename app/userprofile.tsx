import { StyleSheet, Image, ScrollView, View } from 'react-native';
import { Text } from '@/components/Themed';
import React, { useEffect, useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getImageByUserId, getUser } from '@/scripts/userapi';
import institutions from "@/data/institutions.json";
import orientations from "@/data/orientations.json";
import genders from "@/data/genders.json";
import interests from "@/data/interests.json";
import courses from "@/data/courses.json";

export default function UserProfileScreen() {
  const { userId: paramUserId } = useLocalSearchParams();
  const [userData, setUserData] = useState<any>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const router = useRouter();
  const userId = Number(paramUserId);

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      try {
        const userResponse = await getUser(userId);
        if (!userResponse) {
          router.replace('/login'); // fallback if user not found
          return;
        }
        setUserData(userResponse);

        // Fetch user image
        const imageResponse = await getImageByUserId(userId);
        if (imageResponse?.imageUrl) {
          setImageUri(imageResponse.imageUrl);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        router.replace('/login');
      }
    };

    fetchUserData();
  }, [userId]);

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  const user = userData;

  const getInitials = (firstName: string, lastName: string) => {
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    return firstInitial + lastInitial;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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

      {/* Name + Age */}
      <View style={styles.nameRow}>
        <Text style={styles.name}>{user.firstName} {user.lastName}</Text>
        <Text style={styles.age}>{user.age}</Text>
      </View>

      {/* Other Info */}
      <Text style={styles.infoLabel}>Username:</Text>
      <Text style={styles.infoText}>{user.username}</Text>

      <Text style={styles.infoLabel}>Email:</Text>
      <Text style={styles.infoText}>{user.email}</Text>

      <Text style={styles.infoLabel}>Gender:</Text>
      <Text style={styles.infoText}>{genders.find(inst => inst.key === user.gender)?.label || user.gender}</Text>

      <Text style={styles.infoLabel}>Institution:</Text>
      <Text style={styles.infoText}>
        {institutions.find(inst => inst.key === user.institution)?.label || user.institution}
      </Text>

      <Text style={styles.infoLabel}>Course:</Text>
      <Text style={styles.infoText}> {courses.find(inst => inst.key === user.course)?.label || user.course}</Text>

      <Text style={styles.infoLabel}>Bio:</Text>
      {user.bio ? <Text style={styles.bio}>"{user.bio}"</Text> : <Text style={styles.infoText}>N/A</Text>}

      <Text style={styles.infoLabel}>Height:</Text>
      <Text style={styles.infoText}>{user.height ? `${user.height} cm` : 'N/A'}</Text>

      <Text style={styles.infoLabel}>Orientation:</Text>
      <Text style={styles.infoText}>{orientations.find(inst => inst.key === user.orientation)?.label || user.orientations}</Text>

      <Text style={styles.infoLabel}>Smoker:</Text>
      <Text style={styles.infoText}>{user.smoker ? 'Yes' : 'No'}</Text>

      <Text style={styles.infoLabel}>Drinker:</Text>
      <Text style={styles.infoText}>{user.drinker ? 'Yes' : 'No'}</Text>

      {/* Interests */}
      <Text style={styles.infoLabel}>Interests:</Text>
      <Text style={styles.infoText}>
        {user.interests && user.interests.length > 0 ? user.interests.join(', ') : 'None'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
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
    marginBottom: 10,
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
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  infoText: {
    fontSize: 15,
    color: "#333",
  },
  bio: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#444",
    marginBottom: 10,
    textAlign: "center",
  },
});
