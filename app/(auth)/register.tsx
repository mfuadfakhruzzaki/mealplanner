import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  Pressable,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../contexts/AuthContext"; // Pastikan jalur impor benar
import { useContext } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState(Array(6).fill(""));
  const [isVerificationStep, setIsVerificationStep] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleRegister = async () => {
    if (!email || !username || !password || !phoneNumber) {
      Alert.alert("Error", "Please fill all the fields.");
      return;
    }

    try {
      const registerResponse = await axios.post(
        "https://fuadfakhruz.blog/auth/register",
        {
          email,
          username,
          password,
          phone_number: phoneNumber,
        }
      );

      if (registerResponse.status === 200) {
        const token = registerResponse.data.data?.token;

        if (token) {
          await login(token);
          Alert.alert(
            "Registration Successful",
            "A verification code has been sent to your email."
          );
          setIsVerificationStep(true);
        } else {
          Alert.alert("Registration Failed", "Token not received from server.");
        }
      } else {
        Alert.alert(
          "Registration Failed",
          registerResponse.data.message || "Invalid registration details."
        );
      }
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";

      if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }
      }

      Alert.alert("Error", errorMessage);
    }
  };

  const handleVerifyEmail = async () => {
    const code = verificationCode.join("");
    if (code.length !== 6) {
      Alert.alert("Error", "Please enter the 6-character verification code.");
      return;
    }

    try {
      const verifyResponse = await axios.post(
        "https://fuadfakhruz.blog/auth/verify-email",
        {
          email,
          code,
        }
      );

      if (verifyResponse.status === 200) {
        Alert.alert("Verification Success", "Your email has been verified!");
        router.push("/(auth)");
      } else {
        Alert.alert(
          "Verification Failed",
          verifyResponse.data.message || "Invalid verification code."
        );
      }
    } catch (error) {
      const errorMessage =
        (axios.isAxiosError(error) && error.response?.data?.message) ||
        "Something went wrong during verification. Please try again.";
      Alert.alert("Error", errorMessage);
    }
  };

  const handleOTPInput = (value: string, index: number) => {
    if (/^[a-zA-Z0-9]*$/.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value.toUpperCase();
      setVerificationCode(newCode);
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
      if (!value && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <Pressable style={styles.container} onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {isVerificationStep ? "Verify Email" : "Register"}
          </Text>
        </View>

        <View style={styles.inputContainer}>
          {isVerificationStep ? (
            <>
              <Text style={styles.instructionText}>
                Please enter the 6-character verification code sent to your
                email.
              </Text>
              <View style={styles.otpContainer}>
                {verificationCode.map((value, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    style={styles.otpInput}
                    value={value}
                    onChangeText={(text) => handleOTPInput(text, index)}
                    keyboardType="default"
                    maxLength={1}
                    autoCapitalize="characters"
                  />
                ))}
              </View>
            </>
          ) : (
            <>
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
                placeholder="Username"
                placeholderTextColor="#5B5B5B"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="Password"
                  placeholderTextColor="#5B5B5B"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!passwordVisible}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={togglePasswordVisibility}
                  style={styles.eyeIcon}
                >
                  <Ionicons
                    name={passwordVisible ? "eye-off" : "eye"}
                    size={24}
                    color="#5B5B5B"
                  />
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Phone Number"
                placeholderTextColor="#5B5B5B"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
              />
            </>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={isVerificationStep ? handleVerifyEmail : handleRegister}
          >
            <Text style={styles.generateButtonText}>
              {isVerificationStep ? "Verify Email" : "Register"}
            </Text>
          </TouchableOpacity>
          {!isVerificationStep && (
            <TouchableOpacity onPress={() => router.push("/(auth)")}>
              <Text style={styles.registerText}>
                Already have an account? Login here
              </Text>
            </TouchableOpacity>
          )}
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
    alignItems: "center",
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
    width: "100%",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#FAFCEE",
    borderRadius: 12,
    borderColor: "#DA8359",
    borderWidth: 2,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 14,
    fontFamily: "popins-medium",
    color: "#000",
  },
  eyeIcon: {
    paddingHorizontal: 16,
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
  instructionText: {
    color: "#FAFCEE",
    fontSize: 14,
    fontFamily: "popins-medium",
    textAlign: "center",
    marginBottom: 10,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
  otpInput: {
    backgroundColor: "#FAFCEE",
    borderRadius: 8,
    borderColor: "#DA8359",
    borderWidth: 2,
    padding: 10,
    fontSize: 18,
    fontFamily: "popins-medium",
    color: "#000",
    textAlign: "center",
    width: 40,
  },
});
