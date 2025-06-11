"use client"

import { useState, useRef } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ImageBackground,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeIn,
  FadeOut,
  SlideInRight,
  interpolate,
  Extrapolate,
} from "react-native-reanimated"
import { Picker } from "@react-native-picker/picker"
import DateTimePicker from "@react-native-community/datetimepicker"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import { MaterialIcons, FontAwesome5, Ionicons } from "@expo/vector-icons"

const { width, height } = Dimensions.get("window")
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient)

interface SocialLink {
  platform: string
  url: string
}

const CompanyRegistrationScreen = ({ navigation }: any) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    address: "",
    industry: "",
    website: "",
    foundedAt: new Date(),
    socialLinks: [] as SocialLink[],
  })

  const [newSocialLink, setNewSocialLink] = useState({ platform: "", url: "" })
  const [showDatePicker, setShowDatePicker] = useState(false)
  const scrollViewRef = useRef<ScrollView>(null)

  // Animation values
  const progressWidth = useSharedValue(33.33)
  const slideAnimation = useSharedValue(0)
  const backgroundColorAnimation = useSharedValue(0)
  const headerHeightAnimation = useSharedValue(height * 0.25)

  const totalSteps = 3
  const industries = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "E-commerce",
    "Manufacturing",
    "Consulting",
    "Media",
    "Real Estate",
    "Transportation",
  ]

  const socialPlatforms = [
    { name: "LinkedIn", icon: "linkedin" },
    { name: "Twitter", icon: "twitter" },
    { name: "Facebook", icon: "facebook" },
    { name: "Instagram", icon: "instagram" },
    { name: "YouTube", icon: "youtube" },
    { name: "Website", icon: "globe" },
  ]

  const bannerImages = [
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80",
    "https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
  ]

  const stepTitles = ["Company Identity", "Business Details", "Online Presence"]

  const stepDescriptions = [
    "Let's start with your company's basic information",
    "Tell us more about your business operations",
    "Connect your company's online profiles",
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleNameChange = (name: string) => {
    handleInputChange("name", name)
    if (!formData.slug) {
      handleInputChange("slug", generateSlug(name))
    }
  }

  const addSocialLink = () => {
    if (newSocialLink.platform && newSocialLink.url) {
      setFormData((prev) => ({
        ...prev,
        socialLinks: [...prev.socialLinks, newSocialLink],
      }))
      setNewSocialLink({ platform: "", url: "" })
    }
  }

  const removeSocialLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index),
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      progressWidth.value = withTiming((currentStep + 1) * 33.33)
      slideAnimation.value = withSpring(-(currentStep * width))
      backgroundColorAnimation.value = withTiming(currentStep)

      // Scroll to top when changing steps
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true })
      }
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      progressWidth.value = withTiming((currentStep - 1) * 33.33)
      slideAnimation.value = withSpring(-((currentStep - 2) * width))
      backgroundColorAnimation.value = withTiming(currentStep - 2)

      // Scroll to top when changing steps
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true })
      }
    }
  }

  const handleSubmit = () => {
    console.log("Company registration data:", formData)
    Alert.alert("Registration Complete", "Your company profile has been successfully created!", [
      {
        text: "Go to Dashboard",
        onPress: () => navigation.navigate("Dashboard"),
        style: "default",
      },
    ])
  }

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }))

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideAnimation.value }],
  }))

  const headerBackgroundStyle = useAnimatedStyle(() => {
    const backgroundColor1 = interpolate(backgroundColorAnimation.value, [0, 1, 2], [0, 120, 240], Extrapolate.CLAMP)

    const backgroundColor2 = interpolate(backgroundColorAnimation.value, [0, 1, 2], [120, 240, 360], Extrapolate.CLAMP)

    return {
      backgroundColor: `hsl(${backgroundColor1}, 70%, 65%)`,
      backgroundGradient: `linear-gradient(135deg, hsl(${backgroundColor1}, 70%, 65%), hsl(${backgroundColor2}, 70%, 65%))`,
    }
  })

  const headerHeightStyle = useAnimatedStyle(() => {
    return {
      height: headerHeightAnimation.value,
    }
  })

  const getSocialIcon = (platform: string) => {
    const socialPlatform = socialPlatforms.find((p) => p.name === platform)
    return socialPlatform ? socialPlatform.icon : "globe"
  }

  const renderStep1 = () => (
    <Animated.View style={styles.stepContainer} entering={FadeIn.duration(500)} exiting={FadeOut.duration(300)}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Company Name *</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="business" size={20} color="#6B7280" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={handleNameChange}
            placeholder="Enter your company name"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Company URL Slug *</Text>
        <View style={styles.slugContainer}>
          <Text style={styles.slugPrefix}>jobsearch.com/company/</Text>
          <TextInput
            style={[styles.input, styles.slugInput]}
            value={formData.slug}
            onChangeText={(text) => handleInputChange("slug", text)}
            placeholder="company-name"
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <Text style={styles.helperText}>This will be your company's unique URL</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Company Description</Text>
        <View style={styles.textAreaWrapper}>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => handleInputChange("description", text)}
            placeholder="Describe your company, mission, and values..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        <Text style={styles.helperText}>This will appear on your company profile</Text>
      </View>

      <View style={styles.tipContainer}>
        <View style={styles.tipIconContainer}>
          <Ionicons name="bulb-outline" size={24} color="#FFFFFF" />
        </View>
        <View style={styles.tipContent}>
          <Text style={styles.tipTitle}>Pro Tip</Text>
          <Text style={styles.tipText}>
            A clear and concise company description helps attract the right candidates.
          </Text>
        </View>
      </View>
    </Animated.View>
  )

  const renderStep2 = () => (
    <Animated.View style={styles.stepContainer} entering={SlideInRight.duration(500)} exiting={FadeOut.duration(300)}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Industry *</Text>
        <View style={styles.pickerWrapper}>
          <MaterialIcons name="category" size={20} color="#6B7280" style={styles.inputIcon} />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.industry}
              onValueChange={(value) => handleInputChange("industry", value)}
              style={styles.picker}
              dropdownIconColor="#6B7280"
            >
              <Picker.Item label="Select your industry" value="" />
              {industries.map((industry) => (
                <Picker.Item key={industry} label={industry} value={industry} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Company Address *</Text>
        <View style={styles.textAreaWrapper}>
          <MaterialIcons name="location-on" size={20} color="#6B7280" style={styles.inputIcon} />
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.address}
            onChangeText={(text) => handleInputChange("address", text)}
            placeholder="Enter your complete company address"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Website</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="language" size={20} color="#6B7280" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={formData.website}
            onChangeText={(text) => handleInputChange("website", text)}
            placeholder="https://yourcompany.com"
            placeholderTextColor="#9CA3AF"
            keyboardType="url"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Founded Date</Text>
        <TouchableOpacity style={styles.dateButtonWrapper} onPress={() => setShowDatePicker(true)}>
          <MaterialIcons name="event" size={20} color="#6B7280" style={styles.inputIcon} />
          <View style={styles.dateButton}>
            <Text style={styles.dateButtonText}>{formData.foundedAt.toLocaleDateString()}</Text>
          </View>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={formData.foundedAt}
            mode="date"
            display="default"
            onChange={(event: any, selectedDate: any) => {
              setShowDatePicker(false)
              if (selectedDate) {
                handleInputChange("foundedAt", selectedDate)
              }
            }}
          />
        )}
      </View>
    </Animated.View>
  )

  const renderStep3 = () => (
    <Animated.View style={styles.stepContainer} entering={SlideInRight.duration(500)} exiting={FadeOut.duration(300)}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Cover Image</Text>
        <TouchableOpacity style={styles.uploadButtonContainer}>
          <View style={styles.uploadButton}>
            <MaterialIcons name="cloud-upload" size={36} color="#6B7280" />
            <Text style={styles.uploadButtonText}>Upload Company Banner</Text>
            <Text style={styles.uploadSubtext}>Recommended size: 1200 x 400px</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Social Media Links</Text>
        <Text style={styles.helperText}>Connect your company's social media profiles</Text>

        <View style={styles.socialInputRow}>
          <View style={styles.socialPickerContainer}>
            <Picker
              selectedValue={newSocialLink.platform}
              onValueChange={(value) => setNewSocialLink((prev) => ({ ...prev, platform: value }))}
              style={styles.socialPicker}
              dropdownIconColor="#6B7280"
            >
              <Picker.Item label="Platform" value="" />
              {socialPlatforms.map((platform) => (
                <Picker.Item key={platform.name} label={platform.name} value={platform.name} />
              ))}
            </Picker>
          </View>

          <View style={styles.socialUrlInputContainer}>
            <TextInput
              style={[styles.input, styles.socialUrlInput]}
              value={newSocialLink.url}
              onChangeText={(text) => setNewSocialLink((prev) => ({ ...prev, url: text }))}
              placeholder="https://..."
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <TouchableOpacity style={styles.addButton} onPress={addSocialLink}>
            <MaterialIcons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {formData.socialLinks.length > 0 && (
          <View style={styles.socialLinksContainer}>
            {formData.socialLinks.map((link, index) => (
              <Animated.View
                key={index}
                style={styles.socialLinkItem}
                entering={FadeIn.duration(300).delay(index * 100)}
              >
                <View style={styles.socialLinkContent}>
                  <View style={styles.socialIconContainer}>
                    <FontAwesome5 name={getSocialIcon(link.platform)} size={16} color="#4F46E5" />
                  </View>
                  <View style={styles.socialLinkTextContainer}>
                    <Text style={styles.socialLinkPlatform}>{link.platform}</Text>
                    <Text style={styles.socialLinkUrl} numberOfLines={1}>
                      {link.url}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.removeButton} onPress={() => removeSocialLink(index)}>
                  <MaterialIcons name="close" size={20} color="#EF4444" />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.completionContainer}>
        <LinearGradient
          colors={["#4F46E5", "#7C3AED"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.completionGradient}
        >
          <View style={styles.completionContent}>
            <MaterialIcons name="check-circle" size={32} color="#FFFFFF" />
            <Text style={styles.completionTitle}>Almost Done!</Text>
            <Text style={styles.completionText}>
              Complete your profile to start connecting with top talent in your industry.
            </Text>
          </View>
        </LinearGradient>
      </View>
    </Animated.View>
  )

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Animated Header */}
        <Animated.View style={[styles.header, headerHeightStyle]}>
          <ImageBackground
            source={{ uri: bannerImages[currentStep - 1] }}
            style={styles.headerBackground}
            resizeMode="cover"
          >
            <LinearGradient colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)"]} style={styles.headerGradient}>
              <BlurView intensity={50} style={styles.headerBlur}>
                <View style={styles.headerContent}>
                  <View style={styles.stepIndicator}>
                    <View style={styles.stepNumberContainer}>
                      <Text style={styles.stepNumber}>{currentStep}</Text>
                    </View>
                    <View style={styles.stepTextContainer}>
                      <Text style={styles.stepTitle}>{stepTitles[currentStep - 1]}</Text>
                      <Text style={styles.stepDescription}>{stepDescriptions[currentStep - 1]}</Text>
                    </View>
                  </View>
                </View>
              </BlurView>
            </LinearGradient>
          </ImageBackground>
        </Animated.View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              Step {currentStep} of {totalSteps}
            </Text>
            <Text style={styles.progressPercentage}>{Math.round((currentStep / totalSteps) * 100)}% Complete</Text>
          </View>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, progressStyle]} />
          </View>
        </View>

        {/* Form Steps */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.formContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.formContentContainer}
        >
          <Animated.View style={[styles.stepsWrapper, slideStyle]}>
            <View style={[styles.step, { width }]}>{renderStep1()}</View>
            <View style={[styles.step, { width }]}>{renderStep2()}</View>
            <View style={[styles.step, { width }]}>{renderStep3()}</View>
          </Animated.View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[styles.navButton, styles.prevButton, currentStep === 1 && styles.disabledButton]}
            onPress={prevStep}
            disabled={currentStep === 1}
          >
            <MaterialIcons
              name="arrow-back"
              size={20}
              color={currentStep === 1 ? "#9CA3AF" : "#374151"}
              style={styles.buttonIcon}
            />
            <Text style={[styles.navButtonText, currentStep === 1 && styles.disabledButtonText]}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={currentStep < totalSteps ? nextStep : handleSubmit}
          >
            <Text style={styles.nextButtonText}>{currentStep < totalSteps ? "Next" : "Complete Registration"}</Text>
            {currentStep < totalSteps ? (
              <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />
            ) : (
              <MaterialIcons name="check" size={20} color="#FFFFFF" style={styles.buttonIcon} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#4F46E5",
  },
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    height: height * 0.25,
    width: "100%",
    overflow: "hidden",
  },
  headerBackground: {
    flex: 1,
    width: "100%",
  },
  headerGradient: {
    flex: 1,
    justifyContent: "flex-end",
  },
  headerBlur: {
    flex: 1,
    justifyContent: "flex-end",
  },
  headerContent: {
    padding: 20,
  },
  stepIndicator: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepNumberContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  stepNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  progressInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  progressPercentage: {
    fontSize: 14,
    color: "#6B7280",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4F46E5",
    borderRadius: 3,
  },
  formContainer: {
    flex: 1,
  },
  formContentContainer: {
    paddingBottom: 20,
  },
  stepsWrapper: {
    flexDirection: "row",
    width: width * 3,
  },
  step: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  stepContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  inputIcon: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 16,
    fontSize: 16,
    color: "#111827",
  },
  textAreaWrapper: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 0,
  },
  slugContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingLeft: 12,
  },
  slugPrefix: {
    fontSize: 14,
    color: "#6B7280",
  },
  slugInput: {
    paddingLeft: 0,
  },
  helperText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    marginLeft: 2,
  },
  pickerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  pickerContainer: {
    flex: 1,
  },
  picker: {
    height: 50,
  },
  dateButtonWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  dateButton: {
    flex: 1,
    paddingVertical: 14,
    paddingRight: 16,
  },
  dateButtonText: {
    fontSize: 16,
    color: "#111827",
  },
  uploadButtonContainer: {
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderStyle: "dashed",
    borderRadius: 12,
    overflow: "hidden",
  },
  uploadButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
    paddingVertical: 30,
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#4F46E5",
    marginTop: 8,
  },
  uploadSubtext: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
  },
  socialInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  socialPickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    marginRight: 8,
  },
  socialPicker: {
    height: 50,
  },
  socialUrlInputContainer: {
    flex: 2,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    marginRight: 8,
  },
  socialUrlInput: {
    paddingHorizontal: 16,
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  socialLinksContainer: {
    marginTop: 8,
  },
  socialLinkItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  socialLinkContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  socialIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  socialLinkTextContainer: {
    flex: 1,
  },
  socialLinkPlatform: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  socialLinkUrl: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 2,
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  tipContainer: {
    flexDirection: "row",
    backgroundColor: "#EEF2FF",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  tipIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4F46E5",
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },
  completionContainer: {
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  completionGradient: {
    borderRadius: 12,
  },
  completionContent: {
    padding: 20,
    alignItems: "center",
  },
  completionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 8,
    marginBottom: 4,
  },
  completionText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 20,
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  navButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    minWidth: 120,
  },
  buttonIcon: {
    marginHorizontal: 4,
  },
  prevButton: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  nextButton: {
    backgroundColor: "#4F46E5",
    shadowColor: "#4F46E5",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: "#F9FAFB",
    borderColor: "#F3F4F6",
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  disabledButtonText: {
    color: "#9CA3AF",
  },
})

export default CompanyRegistrationScreen
