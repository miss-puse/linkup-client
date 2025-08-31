import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MultiSelect } from "react-native-element-dropdown";

// Import enums from JSON
import institutions from "@/data/institutions.json";
import genders from "@/data/genders.json";
import interests from "@/data/interests.json";
import courses from "@/data/courses.json";

//  Import your API functions here
import { deleteAccount } from "@/services/api";

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
            Alert.alert("✅ Success", "Profile updated!");
        } catch (err: any) {
            Alert.alert("❌ Error", err.message);
        }
    };

    const handleDeleteAccount = async () => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete your account? This action cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteAccount(1); // delete user with ID 1
                            Alert.alert("✅ Account deleted successfully");
                        } catch (err: any) {
                            Alert.alert("❌ Error", err.message);
                        }
                    },
                },
            ]
        );
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

            {/* ✅ New delete button */}
            <View style={{ marginTop: 20 }}>
                <Button title="Delete Account" color="red" onPress={handleDeleteAccount} />
            </View>
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
