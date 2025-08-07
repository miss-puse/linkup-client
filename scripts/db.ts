import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToStorage = async (key: string, value: any): Promise<void> => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
        console.error('Error saving to AsyncStorage:', error);
    }
};

export const getFromStorage = async <T>(key: string): Promise<T | null> => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) as T : null;
    } catch (error) {
        console.error('Error reading from AsyncStorage:', error);
        return null;
    }
};

export const mergeToStorage = async (key: string, value: object): Promise<void> => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.mergeItem(key, jsonValue);
    } catch (error) {
        console.error('Error merging to AsyncStorage:', error);
    }
};

export const deleteFromStorage = async (key: string): Promise<void> => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error('Error deleting from AsyncStorage:', error);
    }
};

export const clearAllStorage = async (): Promise<void> => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.error('Error clearing AsyncStorage:', error);
    }
};
