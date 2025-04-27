"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"
import withAuth from "@/src/hoc/withAuth"

const CreateJobScreen = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [department, setDepartment] = useState("")
  const [location, setLocation] = useState("")
  const [type, setType] = useState("Full-time")
  const [salary, setSalary] = useState("")
  const [description, setDescription] = useState("")
  const [requirements, setRequirements] = useState("")
  const [benefits, setBenefits] = useState("")
  const [isRemote, setIsRemote] = useState(false)
  const [isUrgent, setIsUrgent] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  const handleSubmit = () => {
    // Validate form
    if (!title || !department || !location || !description || !requirements || !benefits) {
      Alert.alert("Error", "Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      Alert.alert("Success", "Job posting created successfully", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ])
    }, 1500)
  }

  const handleSaveDraft = () => {
    if (!title) {
      Alert.alert("Error", "Please enter at least a job title")
      return
    }

    Alert.alert("Success", "Job posting saved as draft", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ])
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Create Job Posting</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Job Details</Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Job Title *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="e.g. Senior React Developer"
              placeholderTextColor={theme.text + "60"}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Department *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="e.g. Engineering"
              placeholderTextColor={theme.text + "60"}
              value={department}
              onChangeText={setDepartment}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Location *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="e.g. San Francisco, CA"
              placeholderTextColor={theme.text + "60"}
              value={location}
              onChangeText={setLocation}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Job Type *</Text>
            <View style={styles.jobTypeContainer}>
              {["Full-time", "Part-time", "Contract", "Internship"].map((jobType) => (
                <TouchableOpacity
                  key={jobType}
                  style={[
                    styles.jobTypeButton,
                    {
                      backgroundColor: type === jobType ? theme.accent : theme.card,
                      borderColor: type === jobType ? theme.accent : theme.border,
                    },
                  ]}
                  onPress={() => setType(jobType)}
                >
                  <Text
                    style={[
                      styles.jobTypeText,
                      {
                        color: type === jobType ? "#FFFFFF" : theme.text,
                      },
                    ]}
                  >
                    {jobType}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Salary Range</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="e.g. $100,000 - $130,000"
              placeholderTextColor={theme.text + "60"}
              value={salary}
              onChangeText={setSalary}
            />
          </View>

          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Ionicons name="home-outline" size={22} color={theme.accent} />
              <Text style={[styles.switchText, { color: theme.text }]}>Remote Position</Text>
            </View>
            <Switch
              value={isRemote}
              onValueChange={setIsRemote}
              trackColor={{ false: "#767577", true: theme.accent + "80" }}
              thumbColor={isRemote ? theme.accent : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Job Description</Text>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Description *</Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Describe the job role, responsibilities, and qualifications..."
              placeholderTextColor={theme.text + "60"}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Requirements *</Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="List the required skills, experience, and qualifications..."
              placeholderTextColor={theme.text + "60"}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={requirements}
              onChangeText={setRequirements}
            />
            <Text style={[styles.helperText, { color: theme.text + "60" }]}>
              Tip: Use a new line for each requirement
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Benefits *</Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="List the benefits and perks offered with this position..."
              placeholderTextColor={theme.text + "60"}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={benefits}
              onChangeText={setBenefits}
            />
            <Text style={[styles.helperText, { color: theme.text + "60" }]}>Tip: Use a new line for each benefit</Text>
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Publishing Options</Text>

          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Ionicons name="flash-outline" size={22} color={theme.accent} />
              <Text style={[styles.switchText, { color: theme.text }]}>Mark as Urgent</Text>
            </View>
            <Switch
              value={isUrgent}
              onValueChange={setIsUrgent}
              trackColor={{ false: "#767577", true: theme.accent + "80" }}
              thumbColor={isUrgent ? theme.accent : "#f4f3f4"}
            />
          </View>

          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Ionicons name="eye-outline" size={22} color={theme.accent} />
              <Text style={[styles.switchText, { color: theme.text }]}>Visible to Public</Text>
            </View>
            <Switch
              value={isVisible}
              onValueChange={setIsVisible}
              trackColor={{ false: "#767577", true: theme.accent + "80" }}
              thumbColor={isVisible ? theme.accent : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: theme.accent }, isSubmitting && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Publish Job</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.draftButton, { borderColor: theme.accent }]}
            onPress={handleSaveDraft}
            disabled={isSubmitting}
          >
            <Text style={[styles.draftButtonText, { color: theme.accent }]}>Save as Draft</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  textArea: {
    minHeight: 120,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  helperText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginTop: 4,
  },
  jobTypeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  jobTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
    marginBottom: 8,
  },
  jobTypeText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  switchInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginLeft: 12,
  },
  actionButtons: {
    marginVertical: 24,
  },
  submitButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  draftButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  draftButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
})

export default withAuth(CreateJobScreen)
