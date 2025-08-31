import { Alert, Button, Pressable, StyleSheet, TextInput } from "react-native";
import { Text, View } from "@/components/Themed";
import { useState } from "react";
import { useRouter } from "expo-router";
import { signup } from "@/scripts/userapi";

export default function SignupScreen() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");

  const router = useRouter();

  const handleSignUp = async () => {
    try {
      const data = {
        username,
        firstName,
        lastName,
        email,
        password,
        age: parseInt(age, 10),
      };

      const result = await signup(data);

      if (result) {
        Alert.alert("Account created successfully!");
        router.replace("/login");
      }
    } catch (error: any) {
      console.error("Signup error:", error.message);
      Alert.alert("Signup failed", error.message);
    }
  };

  const handleGoToLogin = () => {
    router.push("/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <View style={styles.content}>
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

        <Pressable onPress={handleSignUp} style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        <Pressable onPress={handleGoToLogin}>
          <Text style={styles.text}>Already have an account? Sign In</Text>
        </Pressable>
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
    backgroundColor: "#c2a6a6ff",
    marginTop: 0,
  },

  title: {
    position: "absolute",
    top: 20,
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#ffff",
  },
  input: {
    height: 50,
    margin: 10,
    borderWidth: 1,
    borderColor: "transparent",
    boxShadow: "#DDDDD",
    padding: 15,
    width: "80%",
    borderRadius: 30,
    backgroundColor: "#e9e9e9cc",
    elevation: 20,
    marginTop: 10,
  },

  content: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    width: "95%",
    height: "90%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "10%",
    backgroundColor: "#9d7373ff",
    borderRadius: 45,
  },

  button: {
    backgroundColor: "#b908a4cf",
    marginTop: 20,
    borderRadius: 30,
    width: 100,
    height: 40,
    justifyContent: "center",
  },

  buttonText: {
    color: "#ffffffff",
    textAlign: "center",
  },

  text: {
    color: "#ffffffff",
    fontWeight: "medium",
    marginTop: 10,
  },
});
