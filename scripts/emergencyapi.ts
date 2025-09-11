import Constants from 'expo-constants';
import { Alert } from 'react-native';

const apiUrl = Constants.expoConfig?.extra?.API_URL;

type GeoLocation = {
    latitude: number;
    longitude: number;
};

export async function sendEmergencyAlert(payload: {
    userId: number;
    message?: string;
    location?: GeoLocation;
}) {
    try {
        if (!apiUrl) {
            throw new Error('Missing API_URL configuration');
        }

        const response = await fetch(`${apiUrl}/emergency/alert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to send emergency alert');
        }

        return await response.json();
    } catch (error: any) {
        const message = error?.message || 'Failed to send emergency alert';
        Alert.alert(message);
        throw new Error(message);
    }
}

export async function getEmergencyHistory(userId: number) {
    try {
        if (!apiUrl) {
            throw new Error('Missing API_URL configuration');
        }

        const response = await fetch(`${apiUrl}/emergency/history?userId=${encodeURIComponent(userId)}`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || 'Failed to fetch emergency history');
        }

        return await response.json();
    } catch (error: any) {
        const message = error?.message || 'Failed to fetch emergency history';
        Alert.alert(message);
        throw new Error(message);
    }
}
