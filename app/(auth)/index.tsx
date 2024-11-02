import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  Pressable,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { AuthContext } from "../../contexts/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter your email and password.");
      return;
    }

    try {
      const response = await axios.post("https://fuadfakhruz.blog/auth/login", {
        email,
        password,
      });

      if (response.status === 200) {
        const token = response.data.data?.token;

        if (token) {
          await login(token);

          Alert.alert("Login Success", "You have successfully logged in!");
          router.replace("/(tabs)");
        } else {
          Alert.alert("Login Failed", "Token not received from server.");
        }
      } else {
        Alert.alert(
          "Login Failed",
          response.data.message || "Invalid credentials"
        );
      }
    } catch (error) {
      const errorMessage =
        (axios.isAxiosError(error) && error.response?.data?.message) ||
        "Something went wrong. Please try again.";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <Pressable style={styles.container} onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Login</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#5B5B5B"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#5B5B5B"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.generateButton} onPress={handleLogin}>
            <Text style={styles.generateButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.registerText}>
              Don't have an account? Register here
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  titleContainer: {
    backgroundColor: "#DA8359",
    paddingTop: (StatusBar.currentHeight || 0) + 40,
    paddingBottom: 35,
    marginTop: -70,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  title: {
    fontSize: 36,
    marginTop: 70,
    fontFamily: "popins-bold",
    color: "#fafcee",
  },
  inputContainer: {
    backgroundColor: "#A5B68D",
    borderRadius: 32,
    padding: 25,
    marginHorizontal: 4,
    marginTop: 5,
    gap: 10,
  },
  input: {
    backgroundColor: "#FAFCEE",
    borderRadius: 12,
    borderColor: "#DA8359",
    borderWidth: 2,
    padding: 16,
    fontSize: 14,
    fontFamily: "popins-medium",
    color: "#000",
  },
  buttonContainer: {
    backgroundColor: "#fafcee",
    borderRadius: 32,
    padding: 25,
    marginTop: 5,
    marginHorizontal: 4,
    alignItems: "center",
  },
  generateButton: {
    backgroundColor: "#DA8359",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
  },
  generateButtonText: {
    color: "#fafcee",
    fontSize: 18,
    fontFamily: "popins-bold",
  },
  registerText: {
    color: "#5b5b5b",
    fontSize: 14,
    fontFamily: "popins-medium",
    textDecorationLine: "underline",
  },
});
