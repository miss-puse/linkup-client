import {
  Alert,
  Button,
  Pressable,
  StyleSheet,
  TextInput,
  Image,
} from "react-native";
import { Text, View } from "@/components/Themed";
import { useState } from "react";
import { useRouter } from "expo-router";
import { login } from "@/scripts/userapi";
import { getFromStorage, saveToStorage } from "@/scripts/db";

export default function LoginScreen() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const data = await login({
        email: email,
        password: password,
      });

      if (data && data.user) {
        await saveToStorage("user", {
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
              base64String: data.user.imageBase64,
            },
          },
        });

        Alert.alert(
          `Welcome back ${data.user.firstName} ${data.user.lastName}!`
        );
        router.push("/profile");
      } else {
        Alert.alert("Login failed", "Invalid credentials or missing user data");
      }
    } catch (e: any) {
      console.error("Login error:", e.message);
      Alert.alert(
        "Login failed",
        "Please check your credentials and try again."
      );
    }
  };

  const handleGoToSignup = () => {
    router.push("/signup");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <View style={styles.content}>
        <Image
          source={require("../assets/images/login-display.png")}
          style={styles.image}
        />

        <TextInput
          style={styles.email}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.password}
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder="Enter password"
          secureTextEntry
        />

        <Pressable 
        onPress={handleLogin}
        style={styles.button}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        <Pressable onPress={handleGoToSignup}>
          <Text style={styles.text}>Don’t have an account? Sign Up</Text>
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
    backgroundColor: "#c2a6a6ff",
  },
  title: {
    fontSize: 30,
    position: "absolute",
    fontWeight: "bold",
    color: "#ffffffff",
    top: 50,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  email: {
    height: 50,
    margin: 10,
    borderWidth: 1,
    borderColor: "transparent",
    boxShadow: "#DDDDD",
    padding: 10,
    width: "80%",
    borderRadius: 30,
    backgroundColor: "#e9e9e9cc",
    elevation: 20,
    marginTop: 95,
  },

  password: {
    height: 50,
    margin: 10,
    borderWidth: 1,
    borderColor: "transparent",
    boxShadow: "#DDDDD",
    padding: 10,
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
    width: "90%",
    height: "70%",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: "16%",
    backgroundColor: "#9d7373ff",
    borderRadius: 45,
  },

  image: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    width: 140,
    height: 125,
    top: "10%",
  },

  text: {
    color: "#ffffffff",
    fontWeight: 'medium',
    marginTop: 10
  },

  button: {
    backgroundColor: "#b908a4cf",
    marginTop: 20,
    borderRadius: 30,
    width:100,
    height: 40,
    justifyContent: 'center',
  },

  buttonText: {
    color:'#ffffffff',
    textAlign: 'center',


  }
});
