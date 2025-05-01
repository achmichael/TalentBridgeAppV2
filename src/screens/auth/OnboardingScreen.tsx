"use client"

import { useRef, useState } from "react"
import { View, Text, StyleSheet, FlatList, Dimensions, TouchableOpacity, Image, Animated } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"
import Button from "../../components/common/Button"
import { navigationRef } from "@/src/components/common/navigation"


const { width, height } = Dimensions.get("window")

interface OnboardingItem {
  id: string
  title: string
  description: string
  image: any
}

const onboardingData: OnboardingItem[] = [
  {
    id: "1",
    title: "Find Your Dream Job",
    description: "Discover thousands of job opportunities with all the information you need.",
    image: require("../../../assets/images/onboarding1.jpg"),
  },
  {
    id: "2",
    title: "Hire Top Talent",
    description: "Connect with freelancers and professionals around the world.",
    image: require("../../../assets/images/onboarding2.jpg"),
  },
  {
    id: "3",
    title: "Get Started Today",
    description: "Start your journey with us today and find your perfect match.",
    image: require("../../../assets/images/onboarding3.jpg"),
  },
]

const OnboardingScreen = () => {
  const { theme } = useTheme()
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollX = useRef(new Animated.Value(0)).current
  const slidesRef = useRef<FlatList>(null)

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0].index)
  }).current

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current

  const scrollTo = () => {
    if (currentIndex < onboardingData.length - 1) {
      slidesRef.current?.scrollToIndex({ index: currentIndex + 1 })
    } else {
      navigationRef.navigate("Login" as never)
    }
  }

  const renderItem = ({ item }: { item: OnboardingItem }) => {
    return (
      <View style={[styles.slide, { backgroundColor: theme.background }]}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
          <Text style={[styles.description, { color: theme.text }]}>{item.description}</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={() => navigationRef.navigate("ClientRoot" as never)}>
          <Text style={[styles.skipText, { color: theme.primary }]}>Skip</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={onboardingData}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        keyExtractor={(item) => item.id}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />
      <View style={styles.indicatorContainer}>
        {onboardingData.map((_, index) => {
          const inputRange = [(index - 1) * width, index * width, (index + 1) * width]

          const dotWidth = scrollX.interpolate({
            inputRange,
            outputRange: [10, 20, 10],
            extrapolate: "clamp",
          })

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          })

          return (
            <Animated.View
              key={index.toString()}
              style={[
                styles.indicator,
                {
                  width: dotWidth,
                  opacity,
                  backgroundColor: theme.primary,
                },
              ]}
            />
          )
        })}
      </View>

      <View style={styles.buttonContainer}>
        <Button title={currentIndex === onboardingData.length - 1 ? "Get Started" : "Next"} onPress={scrollTo} />
        {currentIndex === onboardingData.length - 1 && (
          <TouchableOpacity
            style={[styles.loginButton, { borderColor: theme.primary }]}
            onPress={() => navigationRef.navigate("Login" as never)}
          >
            <Text style={[styles.loginButtonText, { color: theme.primary }]}>I already have an account</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  skipContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  slide: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    marginBottom: 30,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  indicator: {
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonContainer: {
    width: "80%",
    marginBottom: 30,
  },
  loginButton: {
    marginTop: 15,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
})

export default OnboardingScreen
