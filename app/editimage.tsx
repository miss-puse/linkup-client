import React, {useEffect, useState} from "react";
import { View, Button, Image, StyleSheet, Text, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import {useRouter} from "expo-router";
import Constants from 'expo-constants';
import {saveToStorage} from "@/scripts/db";

export default function EditImageScreen() {
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [userData, setUserData] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = await import('@/scripts/db').then(module =>
                    module.getFromStorage('user')
                );
                if (!user) {
                    router.replace('/login'); // redirect immediately if no user
                    return;
                }
                setUserData(user);
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.replace('/login'); // fallback
            }
        };

        fetchUserData();
    }, []);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [2, 2],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const uri = result.assets[0].uri;
            setImageUri(uri);

            // Convert to Base64
            const base64 = await convertImageToBase64(uri);
            setImageBase64(base64);
        }
    };

    const convertImageToBase64 = async (uri: string) => {
        try {
            const base64 = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });
            return base64;
        } catch (error) {
            console.error("Error converting image to Base64:", error);
            Alert.alert("Error", "Failed to convert image");
            return null;
        }
    };

    const uploadImage = async () => {
        if (!imageUri) return Alert.alert("No image", "Please select an image first");
        const user = userData.user;
        const token = userData.token;
        const apiUrl = Constants.expoConfig?.extra?.API_URL;

        try {
            const formData = new FormData();
            formData.append("userId", user.userId.toString());
            formData.append("imageFile", {
                uri: imageUri,
                name: "profile.jpg",
                type: "image/jpeg",
            } as any);

            const res = await fetch(`${apiUrl}/image/edit`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) throw new Error(`Upload failed with status ${res.status}`);

            const data = await res.json();
            Alert.alert("Success", "Image uploaded successfully!");
            router.push('/profile');
        } catch (error) {
            console.error("Upload error:", error);
            Alert.alert("Error", "Failed to upload image");
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.label}>Edit Profile Image</Text>
            <Button title="Pick an image" onPress={pickImage} />
            {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
            <View style={{ marginTop: 20 }}>
                <Button title="Upload Image" onPress={uploadImage} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
    },
    image: {
        width: 250,
        height: 250,
        borderRadius: 10,
        marginTop: 10,
    },
});
