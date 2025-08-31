import Constants from 'expo-constants';
import { Alert } from "react-native";

const apiUrl = Constants.expoConfig?.extra?.API_URL;

export async function login(data: { [key: string]: any }) {
    try {
        const response = await fetch(`${apiUrl}/user/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        const result = await response.json();
        return result;

    } catch (error: any) {
        Alert.alert(error.message);
        throw new Error(error.message);
    }
}

export async function signup(data: { [key: string]: any }) {
    try {
        const response = await fetch(`${apiUrl}/user/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Signup failed');
        }

        const result = await response.json();
        return result;

    } catch (error: any) {
        Alert.alert(error.message);
        throw new Error(error.message);
    }
}

//  New delete account function
export async function deleteAccount(userId: number) {
    try {
        const response = await fetch(`${apiUrl}/user/${userId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(errorData || 'Failed to delete account');
        }

        return await response.text();
    } catch (error: any) {
        Alert.alert(error.message);
        throw error;
    }
}
