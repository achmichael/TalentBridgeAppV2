"use client";

import type React from "react";
import { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import useLogin from "@/hooks/use-login";
import useRegister from "@/hooks/use-register";
import { redirectBasedOnRole, redirectToCompletedProfile } from "../components/common/navigation";
import { AuthSessionRedirectUriOptions } from "expo-auth-session";
import { baseUrl } from "../config/baseUrl";

// Pastikan browser ditutup setelah autentikasi
WebBrowser.maybeCompleteAuthSession();

const googleAuthConfig = {
  clientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  redirectUri: "https://c45b-118-99-125-4.ngrok-free.app",
  responseType: "code",
  scope: "profile email",
};

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
} as AuthSessionRedirectUriOptions;


export type UserRole = "client" | "freelancer" | "company" | "admin";


export interface User {
  id: string;
  username: string;
  email: string;
  role: {
    role_name: string;
  };
}

interface AuthContextType {
  token: string | null | undefined;
  isLoading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (
    username: string,
    email: string,
    password: string,
    password_confirmation: string,
    role: UserRole
  ) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => void;
  role: UserRole;
  user: User | null;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{
  children: React.ReactNode;
  isNavReady: boolean;
}> = ({ children, isNavReady }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [jwt, setJwt] = useState<string | null | undefined>(null);
  const { login, isLoading: loginLoading } = useLogin();
  const [role, setRole] = useState<UserRole>("client");
  const { register, isLoading: registerLoading } = useRegister();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const [request, response, promptAsync] = Google.useAuthRequest(
    {
      ...googleAuthConfig,
    },
    discovery
  );


  // Efek untuk menangani respons Google Auth
  useEffect(() => {
    if (response?.type === "success") {
      handleGoogleResponse(response);
    } else if (response?.type === "error") {
      console.error("Google auth error:", response.error);
    }
  }, [response]);

  // Fungsi untuk menangani respons Google Auth
  const handleGoogleResponse = async (response: any) => {
    try {
      if (response.type !== "success") return;

      const { authentication } = response;

      if (!authentication) {
        console.error("No authentication data received");
        return;
      }

      const accessToken = authentication.accessToken;
      console.log("Access token received:", accessToken ? "Yes" : "No");

      const userInfoResponse = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!userInfoResponse.ok) {
        console.error("User info response status:", userInfoResponse.status);
        throw new Error(
          `Failed to fetch user info: ${userInfoResponse.status}`
        );
      }

      const userData = await userInfoResponse.json();
      console.log("User data received:", userData ? "Yes" : "No");

      const user: User = {
        id: userData.id || "google-user",
        username: userData.name || "Google User",
        email: userData.email || "no-email@example.com",
        role: {
          role_name: "client",
        },
      };

      await handleUserAuthenticated(accessToken, "client", user);
    } catch (error) {
      console.error("Error handling Google response:", error);
    }
  };

  useEffect(() => {
    if (isNavReady && role && jwt) {
      const validateToken = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`${baseUrl}/verify-token`, {
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });
  
          const data = await response.json();
          if (!response.ok || !data.success) {
            signOut();
            return;
          }

          if (isNavReady){
            setIsAuthenticated(true);
            setIsLoading(false);
            setTimeout(() => {
              if (role && role !== 'freelancer' && role !== 'company') {
                redirectBasedOnRole(role);
              }else {
                redirectToCompletedProfile(role);
              }
            }, 100);
          }
        } catch (error) {
          signOut();
          setIsLoading(false);
          setIsAuthenticated(false);
        } finally {
          setIsAuthenticated(false);
          setIsLoading(false);
        }
      }
      validateToken();
    }
  }, [jwt, role, isNavReady]);

  useEffect(() => {
    const loadCredentials = async () => {
      try {
        const jwtJson = await AsyncStorage.getItem("@jwt");
        const role = await AsyncStorage.getItem("@role");
        const userJson = await AsyncStorage.getItem("@user");

        if (
          jwtJson &&
          role &&
          jwtJson !== null &&
          role !== null &&
          userJson !== null
        ) {
          try {
            const parsedJwt = JSON.parse(jwtJson);
            setJwt(parsedJwt);
            const parsedRole = JSON.parse(role);
            setRole(parsedRole as UserRole);
            const parsedUser = JSON.parse(userJson) as User;
            setUser(parsedUser);
          } catch (parseError) {
            console.error("Error parsing stored data:", parseError);
            await AsyncStorage.removeItem("@jwt");
            await AsyncStorage.removeItem("@role");
            await AsyncStorage.removeItem("@user");
          }
        }
      } catch (error) {
        console.error("Failed to load Jwt from storage", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCredentials();
  }, []);

  const handleUserAuthenticated = async (
    token: string | undefined,
    role: UserRole,
    userData: User
  ) => {
    await AsyncStorage.setItem("@jwt", JSON.stringify(token));
    await AsyncStorage.setItem("@role", JSON.stringify(role));
    await AsyncStorage.setItem("@user", JSON.stringify(userData));
    setJwt(token);
    setRole(role);
    setUser(userData);
  };

  const signIn = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await login(username, password);
      if (result.access_token && !loginLoading) {
        await AsyncStorage.setItem("@jwt", JSON.stringify(result.access_token));
        await AsyncStorage.setItem(
          "@role",
          JSON.stringify(result?.user.role.role_name || "client")
        );
        await AsyncStorage.setItem("@user", JSON.stringify(result?.user));

        setJwt(result.access_token);
        setRole(result?.user.role.role_name || "client");
        setUser(result?.user);
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
      const result = await register(
        username,
        email,
        password,
        password_confirmation,
        role
      );
      if (result.access_token && !registerLoading) {
        await AsyncStorage.setItem(
          "@jwt",
          JSON.stringify(result?.access_token)
        );
        await AsyncStorage.setItem(
          "@role",
          JSON.stringify(result?.user.role.role_name || "client")
        );
        await AsyncStorage.setItem("@user", JSON.stringify(result?.user));
        setJwt(result.access_token);
        setRole(role || result?.user.role.role_name || "client");
        setUser(result.user);
      }
    } catch (error: any) {
      console.log("Sign up failed", error.username);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      setJwt(null);
      setUser(null);
      await AsyncStorage.removeItem("@jwt");
      await AsyncStorage.removeItem("@role");
      await AsyncStorage.removeItem("@user");
    } catch (error) {
      console.error("Sign out failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = () => {
    if (!request) {
      console.error("Google Auth request not initialized");
      return;
    }
    promptAsync();
  };

  return (
    <AuthContext.Provider
      value={{
        token: jwt,
        isLoading,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        role,
        user,
        logout: signOut,
        isAuthenticated
      }}
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
