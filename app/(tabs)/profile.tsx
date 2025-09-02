"import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";

const institutions = [
  { label: "University of Cape Town", value: "UNIVERSITY_OF_CAPE_TOWN" },
  { label: "University of Fort Hare", value: "UNIVERSITY_OF_FORT_HARE" },
  // ... your full list
];

const genders = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
  { label: "Prefer not to say", value: "PREFER_NOT_TO_SAY" },
];

const courses = [
  { label: "BSc Computer Science", value: "BSC_CS" },
  { label: "BA Psychology", value: "BA_PSY" },
  // ... your full list
];

const interestsList = ["MUSIC", "SPORTS", "READING", "TRAVELING", "ART"];

export default function CompleteProfile() {
  const [username, setUsername] = useState("XA");
  const [firstName, setFirstName] = useState("David");
  const [lastName, setLastName] = useState("Python");
  const [email, setEmail] = useState("boe@email.com");
  const [password, setPassword] = useState("securepass123");
  const [age, setAge] = useState("22");
  const [bio, setBio] = useState("This is my bio");
  const [institution, setInstitution] = useState("UNIVERSITY_OF_FORT_HARE");
  const [gender, setGender] = useState("MALE");
  const [course, setCourse] = useState("BSC_CS");
  const [interests, setInterests] = useState(["MUSIC"]);
  const [imageUri, setImageUri] = useState(null); // Will store the local URI of selected image

  // Request permissions for image library on mount
  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const toggleInterest = (interest) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter((i) => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  // Launch image picker to select image
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Square crop for circle display
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  const handleSubmit = () => {
    const payload = {
      username,
      firstName,
      lastName,
      email,
      password,
      age: Number(age),
      bio,
      institution,
      gender,
      interests,
      course,
      imageUri,
    };
    console.log("Submitting profile:", payload);
    // submit logic here
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Profile Image + Upload button at the TOP */}
      <View style={styles.topImageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.placeholder]}>
            <Text style={{ color: "#888" }}>No Image</Text>
          </View>
        )}
        <View style={{ marginTop: 8, width: 140 }}>
          <Button title={imageUri ? "Change Image" : "Upload Image"} onPress={pickImage} />
        </View>
      </View>

      {/* Rest of the form */}
      <Text>Username</Text>
      <TextInput style={styles.input} value={username} onChangeText={setUsername} />

      <Text>First Name</Text>
      <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />

      <Text>Last Name</Text>
      <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />

      <Text>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Text>Age</Text>
      <TextInput
        style={styles.input}
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Text>Bio</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        value={bio}
        onChangeText={setBio}
        multiline
      />

      <Text>Institution</Text>
      <Picker
        selectedValue={institution}
        onValueChange={(val) => setInstitution(val)}
        style={styles.picker}
      >
        <Picker.Item label="Select institution..." value="" />
        {institutions.map((inst) => (
          <Picker.Item key={inst.value} label={inst.label} value={inst.value} />
        ))}
      </Picker>

      <Text>Gender</Text>
      <Picker
        selectedValue={gender}
        onValueChange={(val) => setGender(val)}
        style={styles.picker}
      >
        <Picker.Item label="Select gender..." value="" />
        {genders.map((g) => (
          <Picker.Item key={g.value} label={g.label} value={g.value} />
        ))}
      </Picker>

      <Text>Course</Text>
      <Picker
        selectedValue={course}
        onValueChange={(val) => setCourse(val)}
        style={styles.picker}
      >
        <Picker.Item label="Select course..." value="" />
        {courses.map((c) => (
          <Picker.Item key={c.value} label={c.label} value={c.value} />
        ))}
      </Picker>

      <Text>Interests</Text>
      <View style={styles.interestsContainer}>
        {interestsList.map((interest) => (
          <TouchableOpacity
            key={interest}
            style={[
              styles.interestButton,
              interests.includes(interest) && styles.interestSelected,
            ]}
            onPress={() => toggleInterest(interest)}
          >
            <Text
              style={
                interests.includes(interest)
                  ? styles.interestTextSelected
                  : styles.interestText
              }
            >
              {interest}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ marginTop: 20 }}>
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff" },
  topImageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60, // circular
    backgroundColor: "#eee",
  },
  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 4,
  },
  picker: {
    marginHorizontal: 16,
    marginVertical: 6,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: 16,
    marginVertical: 6,
  },
  interestButton: {
    padding: 8,
    margin: 4,
    borderWidth: 1,
    borderColor: "#888",
    borderRadius: 20,
  },
  interestSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  interestText: {
    color: "#444",
  },
  interestTextSelected: {
    color: "#fff",
  },
});
" 
