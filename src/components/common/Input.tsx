"use client"

import type React from "react"
import { View, TextInput, Text, StyleSheet, type TextInputProps, type ViewStyle, type TextStyle } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"

interface InputProps extends TextInputProps {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  containerStyle?: ViewStyle
  labelStyle?: TextStyle
  inputStyle?: TextStyle
  errorStyle?: TextStyle
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  ...props
}) => {
  const { theme } = useTheme()

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={[styles.label, { color: theme.text }, labelStyle]}>{label}</Text>}

      <View
        style={[
          styles.inputContainer,
          {
            backgroundColor: theme.card,
            borderColor: error ? theme.notification : theme.border,
          },
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}

        <TextInput
          style={[
            styles.input,
            { color: theme.text },
            leftIcon && { paddingLeft: 10 },
            rightIcon && { paddingRight: 10 },
            inputStyle,
          ]}
          placeholderTextColor={theme.text + "80"}
          {...props}
        />

        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
      </View>

      {error && <Text style={[styles.error, { color: theme.notification }, errorStyle]}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    height: 50,
  },
  leftIcon: {
    paddingLeft: 15,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 15,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
  rightIcon: {
    paddingRight: 15,
  },
  error: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginTop: 4,
  },
})

export default Input
