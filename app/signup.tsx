import { Alert, Button, Pressable, StyleSheet, TextInput } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { signup } from '@/scripts/userapi';

export default function SignupScreen() {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');

    const router = useRouter();

    const handleSignUp = async () => {
        try {
            const data = {
                username,
                firstName,
                lastName,
                email,
                password,
                age: parseInt(age, 10)
            };

            const result = await signup(data);

            if (result) {
                Alert.alert('Account created successfully!');
                router.replace('/login');
            }
        } catch (error: any) {
            console.error('Signup error:', error.message);
            Alert.alert('Signup failed', error.message);
        }
    };

    const handleGoToLogin = () => {
        router.push('/login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>

            <TextInput
                style={styles.input}
                onChangeText={setUsername}
                value={username}
                placeholder="Username"
            />

            <TextInput
                style={styles.input}
                onChangeText={setFirstName}
                value={firstName}
                placeholder="First Name"
            />

            <TextInput
                style={styles.input}
                onChangeText={setLastName}
                value={lastName}
                placeholder="Last Name"
            />

            <TextInput
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                placeholder="Email"
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                onChangeText={setAge}
                value={age}
                placeholder="Age"
                keyboardType="numeric"
            />

            <TextInput
                style={styles.input}
                onChangeText={setPassword}
                value={password}
                placeholder="Password"
                secureTextEntry={true} // ✅ password hidden
            />

            <Button title="Sign Up" onPress={handleSignUp} />

            <Pressable onPress={handleGoToLogin} style={{ marginTop: 15 }}>
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
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        height: 40,
        marginVertical: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        width: '100%',
    },
});
