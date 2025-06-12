"use client";

import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from "react-native";
import { baseUrl } from "@/src/config/baseUrl";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  FadeIn,
  FadeOut,
  SlideInRight,
} from "react-native-reanimated";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { MaterialIcons, FontAwesome5, Fontisto } from "@expo/vector-icons";
import { redirectBasedOnRole } from "@/src/components/common/navigation";
import { useAuth } from "@/src/contexts/AuthContext";
import useFetch from "@/hooks/use-fetch";
import AlertModal from "@/src/components/ModalAlert";

const { width, height } = Dimensions.get("window");

interface Education {
  degree: string;
  field: string;
  institution: string;
  year: number;
}

interface Experience {
  company: string;
  position: string;
  duration: string;
  description: string;
}

const FreelancerRegistrationScreen = ({ navigation }: any) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { token } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    skills: [] as string[],
    experienceYears: 0,
    educations: [] as Education[],
    experiences: [] as Experience[],
    rating: 0,
    salary: 0,
    categoryId: 1, // Default category ID, should be replaced with actual categories
    portfolioTitle: "",
    portfolioUrl: "",
  });

  const [showErrorValidation, setShowErrorValidation] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [newEducation, setNewEducation] = useState<Education>({
    degree: "",
    field: "",
    institution: "",
    year: new Date().getFullYear(),
  });
  const [newExperience, setNewExperience] = useState<Experience>({
    company: "",
    position: "",
    duration: "",
    description: "",
  });

  const scrollViewRef = useRef<ScrollView>(null);

  // Animation values
  const progressWidth = useSharedValue(25);
  const slideAnimation = useSharedValue(0);
  const backgroundColorAnimation = useSharedValue(0);
  const headerHeightAnimation = useSharedValue(height * 0.25);

  const totalSteps = 4;
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );

  const { data, loading } = useFetch(`${baseUrl}/categories`);

  useEffect(() => {
    if (data && data.length > 0) {
      const typed = data as { id: number; category_name: string }[];
      setCategories(
        typed.map(({ id, category_name }) => ({
          id,
          name: category_name,
        }))
      );
    }
  }, [data]);

  const skillSuggestions = [
    "JavaScript",
    "React",
    "Node.js",
    "Python",
    "PHP",
    "Laravel",
    "Vue.js",
    "Angular",
    "React Native",
    "Flutter",
    "Swift",
    "Kotlin",
    "Java",
    "C#",
    "Figma",
    "Adobe XD",
    "Photoshop",
    "Illustrator",
  ];

  const bannerImages = [
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1171&q=80",
    "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1126&q=80",
  ];

  const stepTitles = [
    "Personal Profile",
    "Skills & Expertise",
    "Background & Experience",
    "Rates & Portfolio",
  ];

  const stepDescriptions = [
    "Tell us about yourself and your professional journey",
    "Showcase your skills and choose your specialty",
    "Share your education and work experience",
    "Set your rates and complete your profile",
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const addEducation = () => {
    if (newEducation.degree && newEducation.field && newEducation.institution) {
      setFormData((prev) => ({
        ...prev,
        educations: [...prev.educations, newEducation],
      }));
      setNewEducation({
        degree: "",
        field: "",
        institution: "",
        year: new Date().getFullYear(),
      });
    }
  };

  const removeEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== index),
    }));
  };

  const addExperience = () => {
    if (newExperience.company && newExperience.position) {
      setFormData((prev) => ({
        ...prev,
        experiences: [...prev.experiences, newExperience],
      }));
      setNewExperience({
        company: "",
        position: "",
        duration: "",
        description: "",
      });
    }
  };

  const removeExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      progressWidth.value = withTiming((currentStep + 1) * 25);
      slideAnimation.value = withSpring(-(currentStep * width));
      backgroundColorAnimation.value = withTiming(currentStep);

      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      progressWidth.value = withTiming((currentStep - 1) * 25);
      slideAnimation.value = withSpring(-((currentStep - 2) * width));
      backgroundColorAnimation.value = withTiming(currentStep - 2);

      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.experienceYears ||
      !formData.salary ||
      !formData.rating ||
      !formData.portfolioTitle ||
      !formData.portfolioUrl
    ) {
      <AlertModal
        type="error"
        title="Error"
        message="Please fill in all required fields."
        visible={showErrorValidation}
        onClose={() => setShowErrorValidation(false)}
      />;
      return;
    }

    const formattedFormData = {
      ...formData,
      skills: JSON.stringify(formData.skills),
      educations: JSON.stringify(formData.educations),
      experiences: JSON.stringify(formData.experiences),
      experience_years: formData.experienceYears,
      category_id: formData.categoryId,
      title: formData.portfolioTitle,
      url: formData.portfolioUrl,
      rating: formData.rating,
      salary: formData.salary,
      name: formData.name.trim(),
      description: formData.description.trim(),
    };

    try {
      const response = await fetch(`${baseUrl}/freelancers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formattedFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      if (data.success) {
        redirectBasedOnRole("freelancer");
      } else {
        console.error("Registration failed:", data.message);
      }
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  const slideStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: slideAnimation.value }],
  }));

  const renderStarRating = () => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleInputChange("rating", star)}
            style={styles.starButton}
          >
            <MaterialIcons
              name={star <= formData.rating ? "star" : "star-border"}
              size={32}
              color={star <= formData.rating ? "#FFD700" : "#E5E7EB"}
            />
          </TouchableOpacity>
        ))}
        <Text style={styles.ratingText}>({formData.rating}/5)</Text>
      </View>
    );
  };

  const renderStep1 = () => (
    <Animated.View
      style={styles.stepContainer}
      entering={FadeIn.duration(500)}
      exiting={FadeOut.duration(300)}
    >
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Full Name *</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons
            name="person"
            size={20}
            color="#6B7280"
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            value={formData.name}
            onChangeText={(text) => handleInputChange("name", text)}
            placeholder="Enter your full name"
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Professional Summary</Text>
        <View style={styles.textAreaWrapper}>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
            onChangeText={(text) => handleInputChange("description", text)}
            placeholder="Describe your expertise, experience, and what makes you unique..."
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>
        <Text style={styles.helperText}>
          This will be the first thing clients see about you
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Years of Experience *</Text>
        <View style={styles.pickerWrapper}>
          <MaterialIcons
            name="work"
            size={20}
            color="#6B7280"
            style={styles.inputIcon}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.experienceYears.toString()}
              onValueChange={(value) =>
                handleInputChange("experienceYears", Number.parseInt(value))
              }
              style={styles.picker}
              dropdownIconColor="#6B7280"
            >
              <Picker.Item label="Select your experience level" value="0" />
              <Picker.Item label="Less than 1 year" value="0" />
              <Picker.Item label="1-2 years" value="1" />
              <Picker.Item label="3-5 years" value="3" />
              <Picker.Item label="6-10 years" value="6" />
              <Picker.Item label="10+ years" value="11" />
            </Picker>
          </View>
        </View>
      </View>

      <View style={styles.tipContainer}>
        <View style={styles.tipIconContainer}>
          <FontAwesome5 name="lightbulb" size={24} color="#FFFFFF" />
        </View>
        <View style={styles.tipContent}>
          <Text style={styles.tipTitle}>Pro Tip</Text>
          <Text style={styles.tipText}>
            A compelling professional summary increases your chances of getting
            hired by 40%.
          </Text>
        </View>
      </View>
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View
      style={styles.stepContainer}
      entering={SlideInRight.duration(500)}
      exiting={FadeOut.duration(300)}
    >
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Primary Category *</Text>
        <View style={styles.pickerWrapper}>
          <MaterialIcons
            name="category"
            size={20}
            color="#6B7280"
            style={styles.inputIcon}
          />
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.categoryId}
              onValueChange={(value) => handleInputChange("categoryId", value)}
              style={styles.picker}
              dropdownIconColor="#6B7280"
            >
              <Picker.Item label="Select your primary category" value="" />
              {categories?.map((category) => (
                <Picker.Item
                  key={category.name}
                  label={category.name}
                  value={category.id}
                />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Skills *</Text>
        <Text style={styles.helperText}>
          Add skills that showcase your expertise
        </Text>

        <View style={styles.skillInputRow}>
          <View style={styles.skillInputWrapper}>
            <MaterialIcons
              name="add-circle-outline"
              size={20}
              color="#6B7280"
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, styles.skillInput]}
              value={newSkill}
              onChangeText={setNewSkill}
              placeholder="Add a skill"
              placeholderTextColor="#9CA3AF"
              onSubmitEditing={() => addSkill(newSkill)}
            />
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addSkill(newSkill)}
          >
            <MaterialIcons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.suggestionsSection}>
          <Text style={styles.suggestionsLabel}>
            Popular skills in your field:
          </Text>
          <View style={styles.suggestionsContainer}>
            {skillSuggestions.slice(0, 12).map((skill) => (
              <TouchableOpacity
                key={skill}
                style={[
                  styles.suggestionChip,
                  formData.skills.includes(skill) &&
                    styles.suggestionChipSelected,
                ]}
                onPress={() => addSkill(skill)}
              >
                <Text
                  style={[
                    styles.suggestionChipText,
                    formData.skills.includes(skill) &&
                      styles.suggestionChipTextSelected,
                  ]}
                >
                  {skill}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {formData.skills.length > 0 && (
          <View style={styles.selectedSkillsContainer}>
            <Text style={styles.selectedSkillsLabel}>
              Your skills ({formData.skills.length}):
            </Text>
            <View style={styles.skillsWrapper}>
              {formData.skills.map((skill, index) => (
                <Animated.View
                  key={skill}
                  style={styles.skillChip}
                  entering={FadeIn.duration(300).delay(index * 50)}
                >
                  <Text style={styles.skillChipText}>{skill}</Text>
                  <TouchableOpacity
                    onPress={() => removeSkill(skill)}
                    style={styles.removeSkillButton}
                  >
                    <MaterialIcons name="close" size={16} color="#EF4444" />
                  </TouchableOpacity>
                </Animated.View>
              ))}
            </View>
          </View>
        )}
      </View>
    </Animated.View>
  );

  const renderStep3 = () => (
    <ScrollView
      style={styles.stepContainer}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        entering={SlideInRight.duration(500)}
        exiting={FadeOut.duration(300)}
      >
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <MaterialIcons name="school" size={24} color="#8B5CF6" />
            </View>
            <Text style={styles.sectionTitle}>Education</Text>
          </View>

          <View style={styles.formRow}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                value={newEducation.degree}
                onChangeText={(text) =>
                  setNewEducation((prev) => ({ ...prev, degree: text }))
                }
                placeholder="Degree"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                value={newEducation.field}
                onChangeText={(text) =>
                  setNewEducation((prev) => ({ ...prev, field: text }))
                }
                placeholder="Field of Study"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.formRow}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                value={newEducation.institution}
                onChangeText={(text) =>
                  setNewEducation((prev) => ({ ...prev, institution: text }))
                }
                placeholder="Institution"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                value={newEducation.year.toString()}
                onChangeText={(text) =>
                  setNewEducation((prev) => ({
                    ...prev,
                    year: Number.parseInt(text) || new Date().getFullYear(),
                  }))
                }
                placeholder="Year"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.addSectionButton}
            onPress={addEducation}
          >
            <MaterialIcons name="add" size={20} color="#8B5CF6" />
            <Text style={styles.addSectionButtonText}>Add Education</Text>
          </TouchableOpacity>

          {formData.educations.map((edu, index) => (
            <Animated.View
              key={index}
              style={styles.itemCard}
              entering={FadeIn.duration(300).delay(index * 100)}
            >
              <View style={styles.itemIconContainer}>
                <MaterialIcons name="school" size={20} color="#8B5CF6" />
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>
                  {edu.degree} in {edu.field}
                </Text>
                <Text style={styles.itemSubtitle}>
                  {edu.institution} • {edu.year}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeEducation(index)}
              >
                <MaterialIcons name="close" size={20} color="#EF4444" />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Experience Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <MaterialIcons name="work" size={24} color="#8B5CF6" />
            </View>
            <Text style={styles.sectionTitle}>Work Experience</Text>
          </View>

          <View style={styles.formRow}>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                value={newExperience.company}
                onChangeText={(text) =>
                  setNewExperience((prev) => ({ ...prev, company: text }))
                }
                placeholder="Company"
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <View style={styles.inputWrapper}>
              <TextInput
                style={[styles.input, styles.halfInput]}
                value={newExperience.position}
                onChangeText={(text) =>
                  setNewExperience((prev) => ({ ...prev, position: text }))
                }
                placeholder="Position"
                placeholderTextColor="#9CA3AF"
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={newExperience.duration}
              onChangeText={(text) =>
                setNewExperience((prev) => ({ ...prev, duration: text }))
              }
              placeholder="Duration (e.g., 2 years, Jan 2020 - Dec 2022)"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.textAreaWrapper}>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newExperience.description}
              onChangeText={(text) =>
                setNewExperience((prev) => ({ ...prev, description: text }))
              }
              placeholder="Description of your role and achievements"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          <TouchableOpacity
            style={styles.addSectionButton}
            onPress={addExperience}
          >
            <MaterialIcons name="add" size={20} color="#8B5CF6" />
            <Text style={styles.addSectionButtonText}>Add Experience</Text>
          </TouchableOpacity>

          {formData.experiences.map((exp, index) => (
            <Animated.View
              key={index}
              style={styles.itemCard}
              entering={FadeIn.duration(300).delay(index * 100)}
            >
              <View style={styles.itemIconContainer}>
                <MaterialIcons name="work" size={20} color="#8B5CF6" />
              </View>
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{exp.position}</Text>
                <Text style={styles.itemSubtitle}>
                  {exp.company} • {exp.duration}
                </Text>
                <Text style={styles.itemDescription} numberOfLines={2}>
                  {exp.description}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeExperience(index)}
              >
                <MaterialIcons name="close" size={20} color="#EF4444" />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </Animated.View>
    </ScrollView>
  );

  const renderStep4 = () => (
    <Animated.View
      style={styles.stepContainer}
      entering={SlideInRight.duration(500)}
      exiting={FadeOut.duration(300)}
    >
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Hourly Rate (USD) *</Text>
        <View style={styles.salaryInputContainer}>
          <MaterialIcons
            name="attach-money"
            size={20}
            color="#6B7280"
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, styles.salaryInput]}
            value={formData.salary.toString()}
            onChangeText={(text) =>
              handleInputChange("salary", Number.parseFloat(text) || 0)
            }
            placeholder="25.00"
            placeholderTextColor="#9CA3AF"
            keyboardType="decimal-pad"
          />
          <Text style={styles.currencyLabel}>per hour</Text>
        </View>
        <Text style={styles.helperText}>
          Set a competitive rate based on your experience
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Portofolio title *</Text>
        <View style={styles.salaryInputContainer}>
          <MaterialIcons
            name="broadcast-on-personal"
            size={20}
            color="#6B7280"
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, styles.salaryInput]}
            value={formData.portfolioTitle}
            onChangeText={(text) => handleInputChange("portfolioTitle", text)}
            placeholder="My Awesome Portfolio"
            placeholderTextColor="#9CA3AF"
            keyboardType="default"
          />
        </View>
        <Text style={styles.helperText}>
          Fill in the title of your portfolio
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Portofolio url *</Text>
        <View style={styles.salaryInputContainer}>
          <Fontisto
            name="link"
            size={20}
            color="#6B7280"
            style={styles.inputIcon}
          />
          <TextInput
            style={[styles.input, styles.salaryInput]}
            value={formData.portfolioUrl}
            onChangeText={(text) => handleInputChange("portfolioUrl", text)}
            placeholder="https://myportfolio.com"
            placeholderTextColor="#9CA3AF"
            keyboardType="url"
          />
        </View>
        <Text style={styles.helperText}>
          Fill this url of your portofolio, this will be used to showcase your
          work
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confidence Level</Text>
        <Text style={styles.helperText}>
          Rate your overall confidence in your skills
        </Text>
        {renderStarRating()}
      </View>

      <View style={styles.portfolioContainer}>
        <LinearGradient
          colors={["#8B5CF6", "#7C3AED"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.portfolioGradient}
        >
          <View style={styles.portfolioContent}>
            <MaterialIcons name="work" size={32} color="#FFFFFF" />
            <Text style={styles.portfolioTitle}>Portfolio Setup</Text>
            <Text style={styles.portfolioDescription}>
              Your portfolio will be created automatically. You can add projects
              and showcase your work after completing registration.
            </Text>
            <View style={styles.portfolioFeatures}>
              <View style={styles.portfolioFeature}>
                <MaterialIcons name="check-circle" size={16} color="#FFFFFF" />
                <Text style={styles.portfolioFeatureText}>
                  Project showcase
                </Text>
              </View>
              <View style={styles.portfolioFeature}>
                <MaterialIcons name="check-circle" size={16} color="#FFFFFF" />
                <Text style={styles.portfolioFeatureText}>
                  Client testimonials
                </Text>
              </View>
              <View style={styles.portfolioFeature}>
                <MaterialIcons name="check-circle" size={16} color="#FFFFFF" />
                <Text style={styles.portfolioFeatureText}>Work samples</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.completionContainer}>
        <View style={styles.completionHeader}>
          <MaterialIcons name="celebration" size={32} color="#8B5CF6" />
          <Text style={styles.completionTitle}>You're Almost Ready!</Text>
        </View>
        <Text style={styles.completionText}>
          Complete your registration to start connecting with clients and
          building your freelance career.
        </Text>
      </View>
    </Animated.View>
  );

  return (
    <View style={[styles.safeArea, { backgroundColor: "transparent" }]}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Animated Header */}
        <Animated.View style={[styles.header, { height: height * 0.3 }]}>
          <ImageBackground
            source={{ uri: bannerImages[currentStep - 1] }}
            style={styles.headerBackground}
            resizeMode="cover"
          >
            <LinearGradient
              colors={["rgba(139, 92, 246, 0.3)", "rgba(124, 58, 237, 0.7)"]}
              style={styles.headerGradient}
            >
              <BlurView intensity={50} style={styles.headerBlur}>
                <View style={styles.headerContent}>
                  <View style={styles.stepIndicator}>
                    <View style={styles.stepNumberContainer}>
                      <Text style={styles.stepNumber}>{currentStep}</Text>
                    </View>
                    <View style={styles.stepTextContainer}>
                      <Text style={styles.stepTitle}>
                        {stepTitles[currentStep - 1]}
                      </Text>
                      <Text style={styles.stepDescription}>
                        {stepDescriptions[currentStep - 1]}
                      </Text>
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
            <Text style={styles.progressPercentage}>
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </Text>
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
            <View style={[styles.step, { width }]}>{renderStep4()}</View>
          </Animated.View>
        </ScrollView>

        {/* Navigation Buttons */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.prevButton,
              currentStep === 1 && styles.disabledButton,
            ]}
            onPress={prevStep}
            disabled={currentStep === 1}
          >
            <MaterialIcons
              name="arrow-back"
              size={20}
              color={currentStep === 1 ? "#9CA3AF" : "#374151"}
              style={styles.buttonIcon}
            />
            <Text
              style={[
                styles.navButtonText,
                currentStep === 1 && styles.disabledButtonText,
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={currentStep < totalSteps ? nextStep : handleSubmit}
          >
            <Text style={styles.nextButtonText}>
              {currentStep < totalSteps ? "Next" : "Complete Registration"}
            </Text>
            {currentStep < totalSteps ? (
              <MaterialIcons
                name="arrow-forward"
                size={20}
                color="#FFFFFF"
                style={styles.buttonIcon}
              />
            ) : (
              <MaterialIcons
                name="check"
                size={20}
                color="#FFFFFF"
                style={styles.buttonIcon}
              />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#8B5CF6",
  },
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
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
    backgroundColor: "#8B5CF6",
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
    width: width * 4,
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
    fontSize: 14,
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
    paddingHorizontal: 5,
  },
  inputIcon: {
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 14,
    color: "#111827",
  },
  textAreaWrapper: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 5,
    paddingTop: 12,
    marginVertical: 12,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
    paddingTop: 0,
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
  skillInputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 16,
  },
  skillInputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    marginRight: 8,
  },
  skillInput: {
    paddingHorizontal: 0,
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: "#8B5CF6",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#8B5CF6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  suggestionsSection: {
    marginTop: 8,
  },
  suggestionsLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  suggestionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  suggestionChip: {
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  suggestionChipSelected: {
    backgroundColor: "#EEF2FF",
    borderColor: "#8B5CF6",
  },
  suggestionChipText: {
    fontSize: 14,
    color: "#374151",
  },
  suggestionChipTextSelected: {
    color: "#8B5CF6",
    fontWeight: "500",
  },
  selectedSkillsContainer: {
    marginTop: 16,
  },
  selectedSkillsLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 8,
  },
  skillsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3E8FF",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
    borderWidth: 1,
    borderColor: "#C4B5FD",
  },
  skillChipText: {
    fontSize: 14,
    color: "#7C3AED",
    marginRight: 4,
  },
  removeSkillButton: {
    marginLeft: 4,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3E8FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B5CF6",
  },
  formRow: {
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  halfInput: {
    width: "48%",
  },
  addSectionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: "#F9FAFB",
  },
  addSectionButtonText: {
    fontSize: 14,
    color: "#8B5CF6",
    fontWeight: "500",
    marginLeft: 8,
  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  itemIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 14,
    color: "#374151",
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  salaryInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  salaryInput: {
    flex: 1,
    paddingHorizontal: 0,
  },
  currencyLabel: {
    fontSize: 14,
    color: "#6B7280",
    paddingHorizontal: 12,
  },
  starContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
  },
  starButton: {
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: "#6B7280",
    marginLeft: 8,
    fontWeight: "500",
  },
  portfolioContainer: {
    marginTop: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  portfolioGradient: {
    borderRadius: 12,
  },
  portfolioContent: {
    padding: 20,
    alignItems: "center",
  },
  portfolioTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 8,
    marginBottom: 8,
  },
  portfolioDescription: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 16,
  },
  portfolioFeatures: {
    alignSelf: "stretch",
  },
  portfolioFeature: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  portfolioFeatureText: {
    fontSize: 14,
    color: "#FFFFFF",
    marginLeft: 8,
  },
  completionContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  completionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  completionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#8B5CF6",
    marginLeft: 12,
  },
  completionText: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
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
    backgroundColor: "#8B5CF6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8B5CF6",
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: "#4B5563",
    lineHeight: 20,
  },

  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
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
    backgroundColor: "#8B5CF6",
    shadowColor: "#8B5CF6",
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
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
  nextButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FFFFFF",
  },
  disabledButtonText: {
    color: "#9CA3AF",
  },
});

export default FreelancerRegistrationScreen;
