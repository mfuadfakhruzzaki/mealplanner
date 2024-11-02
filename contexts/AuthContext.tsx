import React, { createContext, useState, useEffect, ReactNode } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface AuthContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  loading: true,
  login: async () => {},
  logout: async () => {},
});

interface Props {
  children: ReactNode;
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("jwtToken");
        if (token) {
          const response = await fetch(
            "https://fuadfakhruz.blog/api/users/profile",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            await AsyncStorage.removeItem("jwtToken");
          }
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (token: string): Promise<void> => {
    try {
      await AsyncStorage.setItem("jwtToken", token);
      setIsAuthenticated(true);
      console.log("AuthContext - User logged in with token:", token);
    } catch (error) {
      console.error("Failed to login", error);
      Alert.alert("Login Error", "Failed to save authentication token.");
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem("jwtToken");
      setIsAuthenticated(false);
      console.log("AuthContext - User logged out");
      router.replace("/(auth)/landing");
    } catch (error) {
      console.error("Failed to logout", error);
      Alert.alert("Logout Error", "Failed to remove authentication token.");
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
