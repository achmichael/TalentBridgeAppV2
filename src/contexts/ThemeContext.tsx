"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useColorScheme } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

// Define theme colors
export const lightTheme = {
  primary: "#2563EB", // Blue
  secondary: "#10B981", // Green
  accent: "#8B5CF6", // Purple
  background: "#FFFFFF",
  card: "#F9FAFB",
  text: "#1F2937",
  border: "#E5E7EB",
  notification: "#EF4444",
  shadow: "rgba(0, 0, 0, 0.1)",
  textSecondary: "#9CA3AF",
  cardBackground: "#F3F4F6", // ↳ lebih terang untuk nested cards
  inputBackground: "#F3F4F6", // ↳ lebih terang untuk input
}

export const darkTheme = {
  primary: "#3B82F6",        // Lighter Blue
  secondary: "#34D399",      // Lighter Green
  accent: "#A78BFA",         // Lighter Purple
  background: "#111827",     // Almost‑black
  card: "#1F2937",           // Dark slate
  cardBackground: "#27303F", // ↳ sedikit lebih terang untuk nested cards
  text: "#F9FAFB",           // Almost‑white
  textSecondary: "#9CA3AF",  // ↳ muted cool‑gray untuk teks pendukung
  border: "#374151",         // Slate gray
  notification: "#F87171",   // Red‑toned alert
  shadow: "rgba(0, 0, 0, 0.3)",
  inputBackground: "#374151", // Slate gray
}


type Theme = typeof lightTheme

interface ThemeContextType {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const colorScheme = useColorScheme()
  const [isDark, setIsDark] = useState(colorScheme === "dark")

  useEffect(() => {
    // Load saved theme preference
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("@theme_preference")
        if (savedTheme !== null) {
          setIsDark(savedTheme === "dark")
        }
      } catch (error) {
        console.error("Failed to load theme preference", error)
      }
    }

    loadThemePreference()
  }, [])

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark
      setIsDark(newTheme)
      await AsyncStorage.setItem("@theme_preference", newTheme ? "dark" : "light")
    } catch (error) {
      console.error("Failed to save theme preference", error)
    }
  }

  const theme = isDark ? darkTheme : lightTheme

  return <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
