import { Alert, Pressable, StyleSheet, TextInput,  Text, View } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { login } from '@/scripts/userapi';
import { getAllUsers } from '@/scripts/userapi';
import { getFromStorage, saveToStorage } from '@/scripts/db';
import { writeUserData } from "@/scripts/fs";

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
                    userid: data.user.userId,
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
                    },
                });
                
                Alert.alert(`Welcome back ${data.user.firstName} ${data.user.lastName}!`);
                router.push('/profile');
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

    const handleForgotPassword = () => {
        Alert.alert('Forgot Password', 'Please contact support for assistance.');
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

            <Pressable style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginText}>Login</Text>
            </Pressable>

            <Pressable style={styles.registerButton} onPress={handleGoToSignup}>
                <Text style={styles.registerText}>No account? Tap here to Sign Up</Text>
            </Pressable>

            <Pressable onPress={handleForgotPassword}>
                <Text style={styles.forgotPassword}>Forgot Password</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    input: {
        height: 50,
        marginVertical: 10,
        borderWidth: 2,
        borderColor: '#9b59b6',
        borderRadius: 25,
        paddingHorizontal: 15,
        width: '80%',
        fontSize: 16,
        color: '#333',
    },
    loginButton: {
        backgroundColor: '#9b59b6',
        borderRadius: 25,
        paddingVertical: 8, 
        paddingHorizontal: 20,
        marginVertical: 10,
        width: '50%', 
        alignItems: 'center',
    },
    loginText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerButton: {
        borderRadius: 25,
        marginVertical: 10,
        width: '80%',
        alignItems: 'center',
    },
    registerText: {
       color: '#9b59b6',
       textDecorationLine: 'underline',
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'center',
    },
    forgotPassword: {
        color: '#9b59b6',
        fontSize: 14,
        marginTop: 20,
        textDecorationLine: 'underline',
    },
});