import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Meal Planner</Text>
        <Text style={styles.subtitle}>
          Welcome to Meal Planner! Plan your meals and track your calories
          easily.
        </Text>

        <Text style={styles.presentedText}>Dipersembahkan untuk</Text>
        <Image
          source={require("../../assets/images/splash-image.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.footerText}>
          Created by Muhammad Fuad Fakhruzzaki
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    paddingVertical: 150,
    marginHorizontal: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontFamily: "popins-bold",
    color: "#ff0025",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 20,
    fontFamily: "popins-bold",
    color: "#ff0025",
    textAlign: "center",
    marginBottom: 100,
  },
  presentedText: {
    fontSize: 16,
    color: "#ff0025",
    fontFamily: "popins-semibold",
    textAlign: "center",
    marginBottom: 40,
  },
  logo: {
    width: 260,
    height: 260,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 11,
    color: "#666",
    textAlign: "center",
    position: "absolute",
    bottom: 50,
    fontFamily: "popins-medium",
  },
});

export default SplashScreen;
