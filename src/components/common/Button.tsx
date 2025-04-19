"use client"

import type React from "react"
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, type ViewStyle, type TextStyle } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary" | "outline"
  size?: "small" | "medium" | "large"
  disabled?: boolean
  loading?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const { theme } = useTheme()

  // Determine background color based on variant and disabled state
  const getBackgroundColor = () => {
    if (disabled) return theme.border

    switch (variant) {
      case "primary":
        return theme.primary
      case "secondary":
        return theme.secondary
      case "outline":
        return "transparent"
      default:
        return theme.primary
    }
  }

  // Determine text color based on variant and disabled state
  const getTextColor = () => {
    if (disabled) return theme.text + "80"

    switch (variant) {
      case "primary":
      case "secondary":
        return "#FFFFFF"
      case "outline":
        return theme.primary
      default:
        return "#FFFFFF"
    }
  }

  // Determine border color for outline variant
  const getBorderColor = () => {
    if (disabled) return theme.border
    return variant === "outline" ? theme.primary : "transparent"
  }

  // Determine height based on size
  const getHeight = () => {
    switch (size) {
      case "small":
        return 40
      case "medium":
        return 50
      case "large":
        return 60
      default:
        return 50
    }
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          height: getHeight(),
          borderWidth: variant === "outline" ? 1 : 0,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === "outline" ? theme.primary : "#FFFFFF"} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            {
              color: getTextColor(),
              fontSize: size === "large" ? 18 : size === "small" ? 14 : 16,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  text: {
    fontFamily: "Poppins-Medium",
  },
})

export default Button
