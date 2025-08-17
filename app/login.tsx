import { Alert, Button, Pressable, StyleSheet, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { login } from '@/scripts/userapi';
import { saveToStorage } from '@/scripts/db';

export default function LoginScreen() {
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const data = await login({
                username: userName,
                password: password,
            });

            if (data && data.user) {
                await saveToStorage('user', {
                    token: data.token,
                    user: {
                        userId: data.user.userId,
                        firstName: data.user.firstName,
                        lastName: data.user.lastName,
                        email: data.user.email,
                        username: data.user.username,
                        age: data.user.age,
                        bio: data.user.bio,
                        institution: data.user.institution,
                        gender: data.user.gender,
                        interests: data.user.interests,
                        relationshipType: data.user.relationshipType,
                        image: {
                            base64String: data.user.imageBase64
                        }
                        , // ✅ save the base64 string
                    },
                });

                Alert.alert(`Welcome back ${data.user.firstName} ${data.user.lastName}!`);
                router.push('/(tabs)/profile');
            } else {
                Alert.alert('Login failed', 'Invalid credentials or missing user data');
            }
        } catch (e: any) {
            console.error('Login error:', e.message);
            Alert.alert('Login failed', 'Please check your credentials and try again.');
        }
    };

    const handleGoToSignup = () => {
        router.push('/signup');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <TextInput
                style={styles.input}
                onChangeText={text => setUserName(text)}
                value={userName}
                placeholder="Enter username"
            />

            <TextInput
                style={styles.input}
                onChangeText={text => setPassword(text)}
                value={password}
                placeholder="Enter password"
                secureTextEntry
            />

            <Button title="Login" onPress={handleLogin} />

            <Pressable onPress={handleGoToSignup}>
                <Text>Don’t have an account? Sign Up</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: '80%',
    },
});
