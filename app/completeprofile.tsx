import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet,Image } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MultiSelect } from "react-native-element-dropdown";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

// Import enums from JSON
import institutions from "@/data/institutions.json";
import genders from "@/data/genders.json";
import interests from "@/data/interests.json";
import courses from "@/data/courses.json";

export default function CompleteProfile() {
    const [bio, setBio] = useState("");
    const [institution, setInstitution] = useState("");
    const [gender, setGender] = useState("");
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [course, setCourse] = useState("");

    const handleSubmit = async () => {

        const payload = {
            userId: 1, // must always be included
            username: "XA",
            firstName: "David",
            lastName: "Python",
            email: "boogie@gmail.com",
            age: 22,
            password: "12345",
            bio,
            institution,
            gender,
            interests: selectedInterests,
            course,
        };

        try {
            const res = await fetch("http://localhost:8080/api/users/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Failed to update profile");
            console.log("Profile updated!");
        } catch (err) {
            console.error(err);
        }
    };


    return (
        <View style={styles.container}>
            <Text>Bio</Text>
            <TextInput
                style={styles.input}
                value={bio}
                onChangeText={setBio}
                placeholder="Tell us about yourself"
            />

            <Text>Institution</Text>
            <Picker selectedValue={institution} onValueChange={setInstitution}>
                {institutions.map((item) => (
                    <Picker.Item key={item.key} label={item.label} value={item.key} />
                ))}
            </Picker>

            <Text>Gender</Text>
            <Picker selectedValue={gender} onValueChange={setGender}>
                {genders.map((item) => (
                    <Picker.Item key={item.key} label={item.label} value={item.key} />
                ))}
            </Picker>

            <Text>Interests</Text>
            <MultiSelect
                style={styles.dropdown}
                data={interests}
                labelField="label"
                valueField="key"
                placeholder="Select Interests"
                value={selectedInterests}
                onChange={setSelectedInterests}
                selectedStyle={styles.selectedItem}
            />

            <Text>Course</Text>
            <Picker selectedValue={course} onValueChange={setCourse}>
                {courses.map((item) => (
                    <Picker.Item key={item.key} label={item.label} value={item.key} />
                ))}
            </Picker>

            <Button title="Submit" onPress={handleSubmit} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    dropdown: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    selectedItem: {
        backgroundColor: "green",
        borderRadius: 8,
    },
});