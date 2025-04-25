"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import useLogin from "@/hooks/use-login";
import useRegister from "@/hooks/use-register";
import { useNavigation } from "@react-navigation/native";
import { navigationRef } from "@/App";

// Register for web redirect
WebBrowser.maybeCompleteAuthSession();

// Define user roles
export type UserRole = "client" | "freelancer" | "company" | "admin";

// Define user interface
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

// Define auth context interface
interface AuthContextType {
  token: string | null | undefined;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (
    username: string,
    email: string,
    password: string,
    password_confirmation: string,
    role: UserRole,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  role: UserRole;
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [jwt, setJwt] = useState<string | null | undefined>(null);
  const { login, isLoading: loginLoading } = useLogin();   
  const [role, setRole] = useState<UserRole>("client");
  const navigation = useNavigation();

  const {
    register,
    isLoading: registerLoading,
  } = useRegister();

  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: "YOUR_IOS_CLIENT_ID",
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    webClientId: "YOUR_WEB_CLIENT_ID",
  });

  useEffect(() => {
    const loadJwt = async () => {
      try {
        const jwtJson = await AsyncStorage.getItem("@jwt");
        const role = await AsyncStorage.getItem('@role');
        console.log('jwtJson', jwtJson);
        console.log('role', role);

        if ((jwtJson && role) && (jwtJson !== null && role !== null)) {
          try {
            const parsedJwt = JSON.parse(jwtJson);
            setJwt(parsedJwt);
            const parsedRole = JSON.parse(role);
            setRole(parsedRole as UserRole);
          } catch (parseError) {
            console.error("Error parsing stored data:", parseError);
            await AsyncStorage.removeItem("@jwt");
            await AsyncStorage.removeItem("@role");
          }
        }
      } catch (error) {
        console.error("Failed to load Jwt from storage", error);
      } finally {
        setIsLoading(false);
      }
    };
    

    loadJwt();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response;
      handleUserAuthenticated(authentication?.accessToken, 'client');
    }
  }, [response]);

  const handleUserAuthenticated = async (token: string | undefined, role: UserRole) => {
    await AsyncStorage.setItem("@jwt", JSON.stringify(token));
    await AsyncStorage.setItem('@role', JSON.stringify(role));
    setJwt(token);
  };

  const signIn = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await login(username, password);
      if (result.access_token) {
        await AsyncStorage.setItem("@jwt", result.access_token);
        await AsyncStorage.setItem("@role", result?.user.role.role_name || 'client');
        setJwt(result.access_token);
        setRole(result?.role || 'client');
      }
    } catch (error) {
      console.log("Sign in failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (
    username: string,
    email: string,
    password: string,
    password_confirmation: string,
    role: UserRole
  ) => {
    setIsLoading(true);
    try {
      const result = await register(username, email, password, password_confirmation, role);
      if (result.access_token && !registerLoading) {
        await AsyncStorage.setItem("@jwt", result?.access_token);
        await AsyncStorage.setItem('@role', result?.user.role.role_name || 'client');
        setJwt(result.access_token);
        setRole(role || result?.user.role.role_name || 'client');
      }
    } catch (error) {
      console.log("Sign up failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem("@jwt");
      await AsyncStorage.removeItem("@role");
    } catch (error) {
      console.error("Sign out failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      await promptAsync();
    } catch (error) {
      console.error("Google sign in failed", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{ token: jwt, isLoading, signIn, signUp, signOut, signInWithGoogle, role }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
