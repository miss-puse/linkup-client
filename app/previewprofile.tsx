import { StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { Text, View } from '@/components/Themed';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { getFromStorage, clearAllStorage } from '@/scripts/db';
import institutions from "@/data/institutions.json";
import courses from "@/data/courses.json";
import genders from "@/data/genders.json";
import interests from "@/data/interests.json";

import { getImageByUserId } from '@/scripts/userapi';
import relationshiptypes from "@/data/relationshiptypes.json";
import {getUser } from '@/scripts/userapi';

interface Option {
  key: string;
  label: string;
}

export default function PreviewProfile() {
  const [userData, setUserData] = useState<any>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getFromStorage('user');
        if (!user) {
          router.replace('/login');
          return;
        }
        const rawData: any = user;
        const id = rawData.user.userId;

        const userResponse = await getUser(id);
                if (!userResponse) {
                  router.replace('/login'); // fallback if user not found
                  return;
                }
        setUserData(userResponse);
        
                
              if (id) {
                const imageResponse = await getImageByUserId(id);
                if (imageResponse?.imageUrl) {
                  setImageUri(imageResponse.imageUrl);
                }
                else{
                  setImageUri(null);
                }
      }} catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Loading profile...</Text>
      </View>
    );
  }

  const user = userData;

  const getInitials = (firstName: string, lastName: string) => {
    return (firstName?.charAt(0).toUpperCase() || '') + (lastName?.charAt(0).toUpperCase() || '');
  };

  const courseOptions = courses as Option[];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {imageUri ? (
        <Image
          source={{ uri: `data:image/jpeg;base64,${imageUri}` }}
          style={styles.profileImage}
        />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>{getInitials(user.firstName, user.lastName)}</Text>
        </View>
      )}

      <Text style={styles.name}>{user.firstName} {user.lastName} ({user.age})</Text>
      <Text style={styles.infoText}>Gender: {genders.find(inst => inst.key === user.gender)?.label || user.gender}</Text>
      <Text style={styles.infoText}>
        Institution: {institutions.find(inst => inst.key === user.institution)?.label || user.institution}
      </Text>
      <Text style={styles.infoText}>
        Course: {courses.find(c => c.key === user.course)?.label || user.course}
      </Text>
      {user.bio ? <Text style={styles.bio}>"{user.bio}"</Text> : null}

      {/* Preferences */}
<View style={styles.preferenceContainer}>
  <Text style={styles.preferenceTitle}>Preferences:</Text>

  {user.preferredInterests?.length > 0 && (
    <Text>
      Interests: {user.preferredInterests
        .map((i: string) => (interests as Option[]).find(x => x.key === i)?.label || i)
        .join(', ')}
    </Text>
  )}

  <Text>
    Looking for: {relationshiptypes.find(r => r.key === user.relationshipType)?.label || "N/A"}
  </Text>

  {user.minAge !== undefined && user.maxAge !== undefined && (
    <Text>Age range: {user.minAge} - {user.maxAge}</Text>
  )}

  {user.preferredGender && (
    <Text>
      Preferred Gender: {genders.find(g => g.key === user.preferredGender)?.label || user.preferredGender}
    </Text>
  )}

  {user.preferredCourses?.length > 0 && (
    <Text>
      Preferred Courses: {user.preferredCourses
        .map((c: string) => (courses as Option[]).find(x => x.key === c)?.label || c)
        .join(', ')}
    </Text>
  )}

  {user.maxDistance !== undefined && <Text>Max Distance: {user.maxDistance} km</Text>}
  <Text>Smoker? {user.smokingPreference ? 'Yes' : 'No'}</Text>
  <Text>Drinker? {user.drinkingPreference ? 'Yes' : 'No'}</Text>
</View>


    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
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
    backgroundColor: '#f3e5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  placeholderText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#9b59b6',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    fontStyle: 'italic',
    marginVertical: 10,
    textAlign: 'center',
  },
  preferenceContainer: {
    marginTop: 15,
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 10,
    backgroundColor: '#fafafa',
  },
  preferenceTitle: {
    fontWeight: '700',
    marginBottom: 8,
    fontSize: 16,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
