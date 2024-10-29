// app/_layout.tsx
import React from "react";
import { Slot } from "expo-router";
import { CalorieProvider } from "../contexts/CalorieContext";

const RootLayout = () => {
  return (
    <CalorieProvider>
      <Slot />
    </CalorieProvider>
  );
};

export default RootLayout;
