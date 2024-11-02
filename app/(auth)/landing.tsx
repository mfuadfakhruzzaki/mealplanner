import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";

export default function LandingPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#DA8359" barStyle="light-content" />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Meal Planner</Text>
      </View>
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}
      >
        <View style={styles.inputContainer}>
          <Image
            source={require("../../assets/images/splash-image.png")}
            style={styles.image}
          />
          <Text style={styles.description}>
            Welcome to Meal Planner! Plan your meals and track your calories
            easily. Get started by logging in or registering an account.
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={() => router.push("/(auth)")}
          >
            <Text style={styles.generateButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.generateButton}
            onPress={() => router.push("/(auth)/register")}
          >
            <Text style={styles.generateButtonText}>Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
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
    paddingBottom: 55,
    marginTop: -70,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  title: {
    fontSize: 36,
    marginTop: 150,
    fontFamily: "popins-bold",
    color: "#fafcee",
  },
  content: {
    flex: 1,
    paddingVertical: 5,
    marginHorizontal: 4,
  },
  inputContainer: {
    backgroundColor: "#fafcee",
    borderRadius: 32,
    padding: 40,
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  description: {
    fontSize: 12,
    textAlign: "center",
    color: "#5B5B5B",
    fontFamily: "popins-medium",
  },
  buttonContainer: {
    backgroundColor: "#A5B68D",
    borderRadius: 32,
    padding: 40,
    alignItems: "center",
    marginTop: 5,
    marginHorizontal: 4,
    gap: 10,
  },
  generateButton: {
    backgroundColor: "#DA8359",
    borderRadius: 16,
    padding: 15,
    alignItems: "center",
    width: 300,
  },
  generateButtonText: {
    color: "#fafcee",
    fontSize: 24,
    fontFamily: "popins-bold",
  },
});
