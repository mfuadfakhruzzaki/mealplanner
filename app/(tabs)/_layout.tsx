// app/(tabs)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const TabsLayout = () => {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => {
          let iconName: "home" | "search" | "ellipse";

          if (route.name === "index") {
            iconName = "home";
          } else if (route.name === "search") {
            iconName = "search";
          } else {
            iconName = "ellipse";
          }

          return <Ionicons name={iconName} size={size + 4} color={color} />;
        },
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Rekomendasi" }} />
      <Tabs.Screen name="search" options={{ title: "Pencarian" }} />
    </Tabs>
  );
};

export default TabsLayout;
