"use client"

import type React from "react"
import { TouchableOpacity, Text, StyleSheet, View, type ViewStyle, type TextStyle } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"

interface RadioButtonProps {
  label: string
  selected: boolean
  onSelect: () => void
  color?: string
  style?: ViewStyle
  labelStyle?: TextStyle
}

const RadioButton: React.FC<RadioButtonProps> = ({ label, selected, onSelect, color, style, labelStyle }) => {
  const { theme } = useTheme()

  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onSelect} activeOpacity={0.7}>
      <View style={[styles.radio, { borderColor: selected ? color || theme.primary : theme.border }]}>
        {selected && <View style={[styles.selected, { backgroundColor: color || theme.primary }]} />}
      </View>
      <Text style={[styles.label, { color: theme.text }, labelStyle]}>{label}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  selected: {
    height: 10,
    width: 10,
    borderRadius: 5,
  },
  label: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
})

export default RadioButton
