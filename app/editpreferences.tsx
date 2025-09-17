import { Alert, Pressable, StyleSheet, TextInput, Switch, ScrollView } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from "@react-native-picker/picker";
import { MultiSelect } from "react-native-element-dropdown";

import interests from "@/data/interests.json";
import courses from "@/data/courses.json";
import orientations from "@/data/orientations.json";
import genders from "@/data/genders.json";
import relationshiptypes from "@/data/relationshiptypes.json";

import { createPreference, updatePreference, PreferenceDTO,getPreferenceByUserId } from '@/scripts/userapi';

export default function EditPreferenceScreen() {
  const router = useRouter();

  const [userId, setUserId] = useState<number | null>(null);

  // Preference fields
  const [preferredInterests, setPreferredInterests] = useState<string[]>([]);
  const [relationshipType, setRelationshipType] = useState<string>('');
  const [minAge, setMinAge] = useState('');
  const [maxAge, setMaxAge] = useState('');
  const [preferredGender, setPreferredGender] = useState('');
  const [preferredCourses, setPreferredCourses] = useState<string[]>([]);
  const [maxDistance, setMaxDistance] = useState('');
  const [smoker, setSmoker] = useState(false);
  const [drinker, setDrinker] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await import('@/scripts/db').then(m => m.getFromStorage('user'));
        if (!user) {
          router.replace('/login');
          return;
        }
        const rawData: any = user;
        const id = rawData.user.userId;
        console.log(await getPreferenceByUserId(id))
        setUserId(id);
      } catch (error) {
        console.error(error);
        router.replace('/login');
      }
    };
    fetchUser();
  }, []);

const handleUpdatePreference = async () => {
  if (!userId) return Alert.alert("Error", "User ID not found");

  try {
    // Fetch existing preference for the user
    const existingPref = await getPreferenceByUserId(userId);
    if (!existingPref) {
      return Alert.alert("Error", "No existing preference found for this user");
    }

    // Prepare updated preference object
    const updatedPref: PreferenceDTO = {
      ...existingPref,
      user: { userId },
      preferredInterests,
      relationshipType,
      minAge: minAge ? parseInt(minAge, 10) : 0,
      maxAge: maxAge ? parseInt(maxAge, 10) : 0,
      preferredGender,
      preferredCourses,
      maxDistance: maxDistance ? parseInt(maxDistance, 10) : 0,
      smokingPreference: smoker,
      drinkingPreference: drinker
    };

    // Send update request
    const result = await updatePreference(updatedPref);
    if (result) {
      Alert.alert("Success", "Preference updated!");
      router.back();
    } else {
      Alert.alert("Error", "Failed to update preference");
    }
  } catch (error: any) {
    console.error("Error updating preference:", error);
    Alert.alert("Error", error.message || "Unknown error");
  }
};


  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
        <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.container}>
        <Text>Preferred Interests</Text>
        <MultiSelect
          style={styles.dropdown}
          data={interests}
          labelField="label"
          valueField="key"
          placeholder="Select Interests"
          value={preferredInterests}
          onChange={setPreferredInterests}
          selectedStyle={styles.selectedItem}
        />

        <Text>Relationship Type</Text>
        <Picker selectedValue={relationshipType} onValueChange={setRelationshipType}>
          {relationshiptypes.map(o => <Picker.Item key={o.key} label={o.label} value={o.key} />)}
        </Picker>

        <Text>Preferred Gender</Text>
        <Picker selectedValue={preferredGender} onValueChange={setPreferredGender}>
          {genders.map(g => <Picker.Item key={g.key} label={g.label} value={g.key} />)}
        </Picker>

        <Text>Preferred Courses</Text>
        <MultiSelect
          style={styles.dropdown}
          data={courses}
          labelField="label"
          valueField="key"
          placeholder="Select Courses"
          value={preferredCourses}
          onChange={setPreferredCourses}
          selectedStyle={styles.selectedItem}
        />

        <Text>Min Age</Text>
        <TextInput style={styles.input} value={minAge} onChangeText={setMinAge} keyboardType="numeric" />
        <Text>Max Age</Text>
        <TextInput style={styles.input} value={maxAge} onChangeText={setMaxAge} keyboardType="numeric" />
        <Text>Max Distance (km)</Text>
        <TextInput style={styles.input} value={maxDistance} onChangeText={setMaxDistance} keyboardType="numeric" />

        <View style={styles.switchContainer}>
          <Text>Smoker</Text>
          <Switch value={smoker} onValueChange={setSmoker} />
          <Text>Drinker</Text>
          <Switch value={drinker} onValueChange={setDrinker} />
        </View>

        <Pressable style={styles.button} onPress={handleUpdatePreference}>
          <Text style={styles.buttonText}>Save Preferences</Text>
        </Pressable>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 5, backgroundColor: '#fff' },
  input: { borderWidth: 1, borderColor: '#6a0dad', borderRadius: 8, padding: 10, marginBottom: 10 },
  dropdown: { borderWidth: 1, borderRadius: 8, padding: 5, marginBottom: 10 },
  selectedItem: { backgroundColor: '#6a0dad', color: '#fff', borderRadius: 8 },
  switchContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 5 },
  button: { backgroundColor: '#6a0dad', padding: 14, borderRadius: 25, alignItems: 'center', marginVertical: 5 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
