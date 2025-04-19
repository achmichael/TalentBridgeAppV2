"use client"
import { View, StyleSheet } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"
import LottieView from "lottie-react-native"

const LoadingScreen = () => {
  const { theme } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <LottieView source={require("../../../assets/animations/loading.json")} autoPlay loop style={styles.animation} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  animation: {
    width: 200,
    height: 200,
  },
})

export default LoadingScreen
