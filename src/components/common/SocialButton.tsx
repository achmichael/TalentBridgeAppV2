"use client"

import type React from "react"
import { TouchableOpacity, Text, StyleSheet, type ViewStyle, type TextStyle, View } from "react-native"
import { FontAwesome } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"

interface SocialButtonProps {
  title: string
  icon: "google" | "facebook" | "apple"
  onPress: () => void
  style?: ViewStyle
  textStyle?: TextStyle
}

const SocialButton: React.FC<SocialButtonProps> = ({ title, icon, onPress, style, textStyle }) => {
  const { theme } = useTheme()

  // Get icon color based on the icon type
  const getIconColor = () => {
    switch (icon) {
      case "google":
        return "#DB4437"
      case "facebook":
        return "#4267B2"
      case "apple":
        return "#000000"
      default:
        return "#000000"
    }
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: theme.card,
          borderColor: theme.border,
        },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <FontAwesome name={icon} size={20} color={getIconColor()} />
      </View>
      <Text style={[styles.text, { color: theme.text }, textStyle]}>{title}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 20,
  },
  iconContainer: {
    marginRight: 10,
  },
  text: {
    fontFamily: "Poppins-Medium",
    fontSize: 16,
  },
})

export default SocialButton
