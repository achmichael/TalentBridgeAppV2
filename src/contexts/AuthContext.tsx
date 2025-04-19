"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Google from "expo-auth-session/providers/google"
import * as WebBrowser from "expo-web-browser"

// Register for web redirect
WebBrowser.maybeCompleteAuthSession()

// Define user roles
export type UserRole = "client" | "freelancer" | "company" | "admin"

// Define user interface
export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  avatar?: string
}

// Define auth context interface
interface AuthContextType {
  user: User | null
  isLoading: boolean
  signIn: (username: string, password: string) => Promise<void>
  signUp: (username: string, email: string, password: string, role: UserRole) => Promise<void>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
}

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock API functions (replace with actual API calls)
const mockSignIn = async (username: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock user data based on username
  if (username === "client") {
    return { id: "1", username: "client", email: "client@example.com", role: "client" }
  } else if (username === "freelancer") {
    return { id: "2", username: "freelancer", email: "freelancer@example.com", role: "freelancer" }
  } else if (username === "company") {
    return { id: "3", username: "company", email: "company@example.com", role: "company" }
  } else if (username === "admin") {
    return { id: "4", username: "admin", email: "admin@example.com", role: "admin" }
  }

  throw new Error("Invalid credentials")
}

const mockSignUp = async (username: string, email: string, password: string, role: UserRole): Promise<User> => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Mock user creation
  return { id: "5", username, email, role }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Setup Google Auth
  const [request, response, promptAsync] = Google.useAuthRequest({
    // expoClientId: "YOUR_EXPO_CLIENT_ID",
    iosClientId: "YOUR_IOS_CLIENT_ID",
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    webClientId: "YOUR_WEB_CLIENT_ID",
  })

  // Check for stored user on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userJson = await AsyncStorage.getItem("@user")
        if (userJson) {
          setUser(JSON.parse(userJson))
        }
      } catch (error) {
        console.error("Failed to load user from storage", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  // Handle Google Auth response
  useEffect(() => {
    if (response?.type === "success") {
      const { authentication } = response
      // Here you would typically send the token to your backend
      // and get user info back

      // For demo purposes, we'll create a mock user
      const mockGoogleUser: User = {
        id: "6",
        username: "googleuser",
        email: "google@example.com",
        role: "client", // Default role for Google sign-in
        avatar: "https://ui-avatars.com/api/?name=Google+User",
      }

      handleUserAuthenticated(mockGoogleUser)
    }
  }, [response])

  const handleUserAuthenticated = async (authenticatedUser: User) => {
    setUser(authenticatedUser)
    await AsyncStorage.setItem("@user", JSON.stringify(authenticatedUser))
  }

  const signIn = async (username: string, password: string) => {
    setIsLoading(true)
    try {
      const authenticatedUser = await mockSignIn(username, password)
      await handleUserAuthenticated(authenticatedUser)
    } catch (error) {
      console.error("Sign in failed", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (username: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true)
    try {
      const newUser = await mockSignUp(username, email, password, role)
      await handleUserAuthenticated(newUser)
    } catch (error) {
      console.error("Sign up failed", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    setIsLoading(true)
    try {
      await AsyncStorage.removeItem("@user")
      setUser(null)
    } catch (error) {
      console.error("Sign out failed", error)
    } finally {
      setIsLoading(false)
    }
  }

  const signInWithGoogle = async () => {
    try {
      await promptAsync()
    } catch (error) {
      console.error("Google sign in failed", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
