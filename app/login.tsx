import {Alert, Button, Pressable, StyleSheet, TextInput} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import {Input} from "postcss";
import {useState} from "react";
import {useRouter} from "expo-router";
import {login} from "@/scripts/userapi";
import {saveToStorage} from "@/scripts/db";

export default function LoginScreen() {
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const router = useRouter();

    const handleLogin = async () => {
        try{
            const data = login({
                username: userName,
                password: password
            })
            if(data){
                await saveToStorage("user", {
                    token: data.token,
                    user: {
                        userId: data.userId,
                        firstName: data.firstName,
                        lastName: data.lastName,
                        email: data.email,
                        username: data.username,
                        password: data.password,
                        age: data.age,
                        bio: data.bio,
                        institution: data.institution,
                        gender: data.gender,
                        interests: data.interests,
                        relationshipType: data.relationshipType,
                        // image: {
                        //     imageId: data.image.imageId
                        // }
                    }
                });
                Alert.alert(`Welcome back${data.firstName} ${data.lastName} !`);
                router.push("/(tabs)/profile");
            }
        }
        catch (e: any) {
            console.error(e.message);
        }
    }

    const handleGoToSignup = () => {
        router.push("/signup");
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                onChangeText={text => setUserName(text)}
                value={userName}
                placeholder="Enter email"
            />

            <TextInput
                style={styles.input}
                onChangeText={text => setPassword(text)}
                value={password}
                placeholder="Enter password"
            />

            <Button
                title="Login"
                onPress={handleLogin}
            />

            <Pressable
                onPress={handleGoToSignup}
            >
            <Text>Dont have an account? SignUp</Text>
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
    },
});
