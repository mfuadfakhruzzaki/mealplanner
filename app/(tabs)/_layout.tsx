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

          // Wrapping the icon in a View to center-align it better
          return (
            <View style={styles.iconContainer}>
              <Ionicons
                name={iconName}
                size={focused ? size + 6 : size + 4} // Increase size slightly when active
                color={color}
              />
            </View>
          );
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "white",
        tabBarStyle: styles.tabBarStyle,
        tabBarShowLabel: false,
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Rekomendasi" }} />
      <Tabs.Screen name="search" options={{ title: "Pencarian" }} />
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: "#4CAF50",
    borderRadius: 30, // Adjusted for a more oval shape
    marginHorizontal: 20,
    marginBottom: 20,
    height: 70, // Increased height to center icons vertically
    paddingBottom: 10, // Add padding to push icons down
    paddingTop: 8, // Add padding to improve vertical alignment
    alignItems: "center",
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 50, // Adjust width to create balanced space for icons
    height: 50, // Center icon vertically within the container
  },
});

export default TabsLayout;
