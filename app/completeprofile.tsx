import React, {useEffect, useState} from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { MultiSelect } from "react-native-element-dropdown";
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import institutions from "@/data/institutions.json";
import genders from "@/data/genders.json";
import interests from "@/data/interests.json";
import courses from "@/data/courses.json";
import {useRouter} from "expo-router";
import Constants from "expo-constants";

export default function CompleteProfile() {
    const [bio, setBio] = useState("");
    const [institution, setInstitution] = useState("");
    const [gender, setGender] = useState("");
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [course, setCourse] = useState("");
    const [password, setPassword] = useState(""); // <-- added password state

    const [userData, setUserData] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await import('@/scripts/db').then(module =>
                    module.getFromStorage('user')
                );
                if (!user) {
                    router.replace('/login');
                    return;
                }
                setUserData(user);
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.replace('/login');
            }
        };
        fetchUserData();
    }, []);

    const handleSubmit = async () => {
        const user = userData.user;
        const apiUrl = Constants.expoConfig?.extra?.API_URL;

        const payload = {
            userId: user.userId,
            username: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            age: user.age,
            password: password,
            bio: bio,
            institution: institution,
            gender: gender,
            interests: selectedInterests,
            course: course,
        };

        try {
            const res = await fetch(`${apiUrl}/user/${user.userId}`, {
                method: "PATCH",
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

            <Text>Password</Text>
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Enter new password"
                secureTextEntry={true} // <-- masks the input
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