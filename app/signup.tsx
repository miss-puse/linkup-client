import {Alert, Button, Pressable, StyleSheet, TextInput} from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import {Input} from "postcss";
import {useState} from "react";
import {useRouter} from "expo-router";

export default function SignupScreen() {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const router = useRouter();

    const handleSignUp = () => {
        Alert.alert("Account created successfully!");
    }
    const handleGoToLogin = () => {
        router.push("/login");
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <TextInput
                style={styles.input}
                onChangeText={text => setEmail(text)}
                value={email}
                placeholder="Enter email"
            />

            <TextInput
                style={styles.input}
                onChangeText={text => setPassword(text)}
                value={password}
                placeholder="Enter password"
            />

            <Button
                title="Sign Up"
                onPress={() => Alert.alert('Simple Button pressed')}
            />

            <Pressable
                onPress={handleGoToLogin}
            >
            <Text>Already have an account? Log in</Text>
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
