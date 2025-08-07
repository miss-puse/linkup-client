import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.API_URL;

export async function login(data: { [key: string]: any }) {
    try {
        const response = await fetch(`${apiUrl}/users/login`, {
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
        throw new Error(error.message);
    }
}

