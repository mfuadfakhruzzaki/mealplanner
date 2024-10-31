import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, StyleSheet } from "react-native";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: "home" | "search" = "home";

          if (route.name === "index") {
            iconName = "home";
          } else if (route.name === "search") {
            iconName = "search";
          }

          return (
            <View style={styles.iconContainer}>
              <Ionicons name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#FFFFFF",
        tabBarStyle: styles.tabBarStyle,
        tabBarShowLabel: false,
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Generate Meal Plan" }} />
      <Tabs.Screen name="search" options={{ title: "Search Ingredient" }} />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: "#DA8359",
    borderRadius: 24,
    position: "absolute",
    bottom: 15,
    left: 10,
    right: 10,
    height: 65,
    paddingBottom: 10,
    paddingTop: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
  },
});

export default TabsLayout;
