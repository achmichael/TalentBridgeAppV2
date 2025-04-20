"use client"

import "react-native-gesture-handler"
import { useEffect, useState } from "react"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { StatusBar } from "expo-status-bar"
import * as SplashScreen from "expo-splash-screen"
import * as Font from "expo-font"
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons"
import { NavigationContainer } from "@react-navigation/native"
import { AuthProvider } from "./src/contexts/AuthContext"
import RootNavigator from "./src/navigation/RootNavigator"
import { ThemeProvider } from "./src/contexts/ThemeContext"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Prevent auto hiding of splash screen
SplashScreen.preventAutoHideAsync()

// Create a client for React Query
const queryClient = new QueryClient()

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false)

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          ...MaterialIcons.font,
          ...FontAwesome5.font,
          // "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
          // "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
          // "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
        })
      } catch (e) {
        console.warn(e)
      } finally {
        // Tell the application to render
        setAppIsReady(true)
      }
    }

    prepare()
  }, [])

  useEffect(() => {
    async function hideSplash() {
      if (appIsReady) {
        // Hide splash screen
        await SplashScreen.hideAsync()
      }
    }

    hideSplash()
  }, [appIsReady])

  if (!appIsReady) {
    return null
  }

  return (
      <QueryClientProvider client={queryClient}>
    <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <NavigationContainer>
              <RootNavigator />
              <StatusBar style="auto" />
            </NavigationContainer>
          </AuthProvider>
        </ThemeProvider>
    </SafeAreaProvider>
      </QueryClientProvider>
  )
}
