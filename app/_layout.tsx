import React, { useContext } from "react";
import { AuthProvider, AuthContext } from "../contexts/AuthContext";
import { Slot, useRouter, useSegments } from "expo-router";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import SplashScreen from "@/components/ui/SplashScreen";

const InitialLayout = () => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const router = useRouter();
  const segments = useSegments();

  React.useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push("/(tabs)");
      } else {
        router.push("/(auth)/landing");
      }
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return <SplashScreen />;
  }

  return <Slot />;
};

const RootLayoutNav = () => {
  const [fontsLoaded] = useFonts({
    "popins-bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "popins-regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "popins-medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "popins-semibold": require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return <SplashScreen />;
  }

  return (
    <AuthProvider>
      <InitialLayout />
      <StatusBar style="dark" />
    </AuthProvider>
  );
};

export default RootLayoutNav;
