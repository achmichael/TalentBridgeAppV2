"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, StatusBar } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated"
import { LinearGradient } from "expo-linear-gradient"
import { useAuth } from "@/src/contexts/AuthContext"

const { width, height } = Dimensions.get("window")

const CallScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const { user: employee } = useAuth();
  const [callStatus, setCallStatus] = useState("connecting") // connecting, ongoing, ended
  const [callDuration, setCallDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(false)
  const [isVideoOn, setIsVideoOn] = useState(false)

  // Animation values
  const avatarScale = useSharedValue(1)
  const connectingOpacity = useSharedValue(1)
  const callControlsTranslateY = useSharedValue(100)
  const pulseOpacity = useSharedValue(0.7)
  const pulseScale = useSharedValue(1)

  useEffect(() => {
    // Start animations
    StatusBar.setBarStyle("light-content")

    // Pulse animation for connecting state
    pulseOpacity.value = withRepeat(
      withSequence(withTiming(0.2, { duration: 1000 }), withTiming(0.7, { duration: 1000 })),
      -1,
      true,
    )

    pulseScale.value = withRepeat(
      withSequence(withTiming(1.2, { duration: 1000 }), withTiming(1, { duration: 1000 })),
      -1,
      true,
    )

    // Avatar animation
    avatarScale.value = withSequence(withTiming(1.1, { duration: 300 }), withTiming(1, { duration: 300 }))

    // Call controls animation
    callControlsTranslateY.value = withTiming(0, {
      duration: 500,
      easing: Easing.out(Easing.quad),
    })

    // Simulate call connecting
    const connectingTimeout = setTimeout(() => {
      setCallStatus("ongoing")

      // Stop connecting animations
      pulseOpacity.value = withTiming(0, { duration: 500 })
      connectingOpacity.value = withTiming(0, { duration: 500 })

      // Start call duration timer
      startCallDurationTimer()
    }, 3000)

    return () => {
      clearTimeout(connectingTimeout)
      StatusBar.setBarStyle("default")
    }
  }, [])

  const startCallDurationTimer = () => {
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1)
    }, 1000)

    // Auto end call after random time (for demo)
    const callDuration = 30 + Math.floor(Math.random() * 60) // 30-90 seconds
    setTimeout(() => {
      clearInterval(timer)
      handleEndCall()
    }, callDuration * 1000)

    return timer
  }

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleEndCall = () => {
    setCallStatus("ended")

    // Animate out
    callControlsTranslateY.value = withTiming(100, {
      duration: 500,
      easing: Easing.in(Easing.quad),
    })

    // Navigate back after animation
    setTimeout(() => {
      navigation.goBack()
    }, 1000)
  }

  const avatarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: avatarScale.value }],
    }
  })

  const pulseStyle = useAnimatedStyle(() => {
    return {
      opacity: pulseOpacity.value,
      transform: [{ scale: pulseScale.value }],
    }
  })

  const connectingStyle = useAnimatedStyle(() => {
    return {
      opacity: connectingOpacity.value,
    }
  })

  const callControlsStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: callControlsTranslateY.value }],
    }
  })

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={["#192f6a", "#4c669f"]} style={styles.background} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.callInfoContainer}>
          <Text style={styles.callStatus}>
            {callStatus === "connecting" ? "Connecting..." : callStatus === "ongoing" ? "On Call" : "Call Ended"}
          </Text>

          {callStatus === "ongoing" && <Text style={styles.callDuration}>{formatCallDuration(callDuration)}</Text>}
        </View>

        <View style={styles.avatarContainer}>
          <Animated.View style={[styles.avatarPulse, pulseStyle]} />

          <Animated.View style={avatarStyle}>
            <Image
              source={{
                uri: `https://randomuser.me/api/portraits/${1 ? "men" : "women"}.jpg`,
              }}
              style={styles.avatar}
            />
          </Animated.View>

          <Text style={styles.callerName}>{employee?.username}</Text>
          <Text style={styles.callerPosition}>{employee?.email}</Text>

          <Animated.View style={connectingStyle}>
            <Text style={styles.connectingText}>{callStatus === "connecting" ? "Calling..." : ""}</Text>
          </Animated.View>
        </View>

        <Animated.View style={[styles.callControlsContainer, callControlsStyle]}>
          <View style={styles.callControls}>
            <TouchableOpacity
              style={[styles.controlButton, isMuted && styles.controlButtonActive]}
              onPress={() => setIsMuted(!isMuted)}
            >
              <Ionicons name={isMuted ? "mic-off" : "mic-outline"} size={24} color="#fff" />
              <Text style={styles.controlText}>Mute</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, isSpeakerOn && styles.controlButtonActive]}
              onPress={() => setIsSpeakerOn(!isSpeakerOn)}
            >
              <Ionicons name={isSpeakerOn ? "volume-high" : "volume-medium-outline"} size={24} color="#fff" />
              <Text style={styles.controlText}>Speaker</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, isVideoOn && styles.controlButtonActive]}
              onPress={() => setIsVideoOn(!isVideoOn)}
            >
              <Ionicons name={isVideoOn ? "videocam" : "videocam-outline"} size={24} color="#fff" />
              <Text style={styles.controlText}>Video</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.endCallButton} onPress={handleEndCall}>
            <Ionicons name="call" size={30} color="#fff" style={{ transform: [{ rotate: "135deg" }] }} />
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
  },
  callInfoContainer: {
    alignItems: "center",
    paddingTop: 20,
  },
  callStatus: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
    opacity: 0.9,
  },
  callDuration: {
    color: "#fff",
    fontSize: 14,
    marginTop: 5,
    opacity: 0.7,
  },
  avatarContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarPulse: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.7)",
  },
  callerName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
  },
  callerPosition: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    marginTop: 5,
  },
  connectingText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 16,
    marginTop: 20,
  },
  callControlsContainer: {
    paddingBottom: 40,
  },
  callControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 30,
    paddingHorizontal: 30,
  },
  controlButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  controlButtonActive: {
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  controlText: {
    color: "#fff",
    fontSize: 12,
    marginTop: 5,
  },
  endCallButton: {
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#F44336",
  },
})

export default CallScreen
