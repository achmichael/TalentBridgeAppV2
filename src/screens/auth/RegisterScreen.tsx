"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"
import { useAuth, type UserRole } from "../../contexts/AuthContext"
import type { AuthStackParamList } from "../../navigation/AuthNavigator"
import Input from "../../components/common/Input"
import Button from "../../components/common/Button"
import SocialButton from "../../components/common/SocialButton"
import RadioButton from "../../components/common/RadioButton"

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, "Register">

const RegisterScreen = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>()
  const { theme } = useTheme()
  const { signUp, signInWithGoogle } = useAuth()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<UserRole>("client")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      Alert.alert("Error", "Please enter a valid email address")
      return
    }

    setIsLoading(true)
    try {
      await signUp(username, email, password, confirmPassword, role)
    } catch (error) {
      Alert.alert("Registration Failed", "Could not create account")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleRegister = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      Alert.alert("Google Registration Failed", "Could not sign up with Google")
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.background, paddingTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 30 }]}>
        <View style={styles.header}>
          <Image source={require("../../../assets/images/logo.png")} style={styles.logo} resizeMode="contain" />
          <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>
          <Text style={[styles.subtitle, { color: theme.text }]}>Sign up to get started</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Username"
            placeholder="Choose a username"
            value={username}
            onChangeText={setUsername}
            leftIcon={<Ionicons name="person-outline" size={20} color={theme.text} />}
          />

          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            leftIcon={<Ionicons name="mail-outline" size={20} color={theme.text} />}
          />

          <Input
            label="Password"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.text} />}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={theme.text} />
              </TouchableOpacity>
            }
          />

          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
            leftIcon={<Ionicons name="lock-closed-outline" size={20} color={theme.text} />}
          />

          <Text style={[styles.roleLabel, { color: theme.text }]}>I am a:</Text>
          <View style={styles.roleContainer}>
            <RadioButton
              label="Client"
              selected={role === "client"}
              onSelect={() => setRole("client")}
              color={theme.primary}
            />
            <RadioButton
              label="Freelancer"
              selected={role === "freelancer"}
              onSelect={() => setRole("freelancer")}
              color={theme.primary}
            />
            <RadioButton
              label="Company"
              selected={role === "company"}
              onSelect={() => setRole("company")}
              color={theme.primary}
            />
          </View>

          <Button
            title={isLoading ? "Creating Account..." : "Create Account"}
            onPress={handleRegister}
            disabled={isLoading}
            loading={isLoading}
          />

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            <Text style={[styles.dividerText, { color: theme.text }]}>OR</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          </View>

          <SocialButton title="Sign Up with Google" icon="google" onPress={handleGoogleRegister} />
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.text }]}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={[styles.footerLink, { color: theme.primary }]}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
  form: {
    width: "100%",
    marginBottom: 20,
  },
  roleLabel: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginBottom: 10,
  },
  roleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginRight: 5,
  },
  footerLink: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
})

export default RegisterScreen
