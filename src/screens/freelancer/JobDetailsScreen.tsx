"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import type { RouteProp } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"
import type { FreelancerStackParamList } from "../../navigation/FreelancerNavigator"
import { useQuery } from "@tanstack/react-query"
import withAuth from "@/src/hoc/withAuth"

type JobDetailsScreenRouteProp = RouteProp<FreelancerStackParamList, "JobDetails">
type JobDetailsScreenNavigationProp = StackNavigationProp<FreelancerStackParamList>

// Mock data fetching function
const fetchJobDetails = async (jobId: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: jobId,
    title: "React Native Developer Needed",
    client: {
      id: "c1",
      name: "John Smith",
      avatar: "https://ui-avatars.com/api/?name=John+Smith",
      rating: 4.8,
      location: "New York, USA",
      memberSince: "2020-05-15",
      jobsPosted: 12,
      hireRate: 85,
    },
    budget: 1500,
    deadline: "2023-12-15",
    description:
      "We are looking for an experienced React Native developer to build a mobile app for our e-commerce platform. The app should be compatible with both iOS and Android platforms.\n\nThe ideal candidate should have experience with:\n- React Native and Expo\n- State management (Redux or Context API)\n- API integration\n- UI/UX implementation\n- Performance optimization\n\nThe project timeline is approximately 6 weeks. Regular communication and updates will be required.",
    skills: ["React Native", "JavaScript", "TypeScript", "Redux", "API Integration"],
    postedAt: "2023-11-20",
    category: "Mobile Development",
    proposals: 8,
    attachments: [
      {
        id: "a1",
        name: "Project Requirements.pdf",
        size: "1.2 MB",
      },
      {
        id: "a2",
        name: "UI Mockups.zip",
        size: "3.5 MB",
      },
    ],
    status: "open",
  }
}

const JobDetailsScreen = () => {
  const route = useRoute<JobDetailsScreenRouteProp>()
  const navigation = useNavigation<JobDetailsScreenNavigationProp>()
  const { theme } = useTheme()
  const { jobId } = route.params

  const [bidAmount, setBidAmount] = useState("")
  const [coverLetter, setCoverLetter] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: job, isLoading } = useQuery({
    queryKey: ["jobDetails", jobId],
    queryFn: () => fetchJobDetails(jobId),
  })

  const handleSubmitProposal = () => {
    if (!bidAmount || !coverLetter) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    if (isNaN(Number(bidAmount)) || Number(bidAmount) <= 0) {
      Alert.alert("Error", "Please enter a valid bid amount")
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      Alert.alert("Success", "Your proposal has been submitted successfully")
      navigation.goBack()
    }, 1500)
  }

  if (isLoading || !job) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.secondary} />
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Job Details</Text>
        <TouchableOpacity style={styles.saveButton}>
          <Ionicons name="bookmark-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.jobHeader}>
          <Text style={[styles.jobTitle, { color: theme.text }]}>{job.title}</Text>
          <View style={styles.jobMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={16} color={theme.text + "80"} />
              <Text style={[styles.metaText, { color: theme.text + "80" }]}>
                Posted {new Date(job.postedAt).toLocaleDateString()}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="location-outline" size={16} color={theme.text + "80"} />
              <Text style={[styles.metaText, { color: theme.text + "80" }]}>{job.client.location}</Text>
            </View>
          </View>
          <View style={styles.jobMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="cash-outline" size={16} color={theme.secondary} />
              <Text style={[styles.budgetText, { color: theme.secondary }]}>${job.budget}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={16} color={theme.text + "80"} />
              <Text style={[styles.metaText, { color: theme.text + "80" }]}>{job.proposals} proposals</Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, { borderBottomColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Client Information</Text>
          <TouchableOpacity
            style={styles.clientInfo}
            onPress={() => navigation.navigate("ClientProfile", { clientId: job.client.id })}
          >
            <Image source={{ uri: job.client.avatar }} style={styles.clientAvatar} />
            <View style={styles.clientDetails}>
              <Text style={[styles.clientName, { color: theme.text }]}>{job.client.name}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={[styles.ratingText, { color: theme.text }]}>{job.client.rating}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + "60"} />
          </TouchableOpacity>
          <View style={styles.clientStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>{job.client.jobsPosted}</Text>
              <Text style={[styles.statLabel, { color: theme.text + "80" }]}>Jobs Posted</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>{job.client.hireRate}%</Text>
              <Text style={[styles.statLabel, { color: theme.text + "80" }]}>Hire Rate</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {new Date().getFullYear() - new Date(job.client.memberSince).getFullYear()}
              </Text>
              <Text style={[styles.statLabel, { color: theme.text + "80" }]}>Years</Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, { borderBottomColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Job Description</Text>
          <Text style={[styles.description, { color: theme.text + "90" }]}>{job.description}</Text>
        </View>

        <View style={[styles.section, { borderBottomColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Skills Required</Text>
          <View style={styles.skillsContainer}>
            {job.skills.map((skill, index) => (
              <View key={index} style={[styles.skillBadge, { backgroundColor: theme.secondary + "20" }]}>
                <Text style={[styles.skillText, { color: theme.secondary }]}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.section, { borderBottomColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Attachments</Text>
          {job.attachments.map((attachment) => (
            <TouchableOpacity key={attachment.id} style={[styles.attachmentItem, { backgroundColor: theme.card }]}>
              <Ionicons name="document-outline" size={24} color={theme.secondary} />
              <View style={styles.attachmentInfo}>
                <Text style={[styles.attachmentName, { color: theme.text }]}>{attachment.name}</Text>
                <Text style={[styles.attachmentSize, { color: theme.text + "60" }]}>{attachment.size}</Text>
              </View>
              <Ionicons name="download-outline" size={24} color={theme.secondary} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Submit a Proposal</Text>
          <View style={styles.proposalForm}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>Your Bid Amount ($)</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Enter your bid amount"
              placeholderTextColor={theme.text + "60"}
              keyboardType="numeric"
              value={bidAmount}
              onChangeText={setBidAmount}
            />

            <Text style={[styles.inputLabel, { color: theme.text, marginTop: 16 }]}>Cover Letter</Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Introduce yourself and explain why you're a good fit for this job..."
              placeholderTextColor={theme.text + "60"}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={coverLetter}
              onChangeText={setCoverLetter}
            />

            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: theme.secondary }, isSubmitting && { opacity: 0.7 }]}
              onPress={handleSubmitProposal}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Proposal</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  saveButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  jobHeader: {
    marginBottom: 20,
  },
  jobTitle: {
    fontSize: 22,
    fontFamily: "Poppins-Bold",
    marginBottom: 12,
  },
  jobMeta: {
    flexDirection: "row",
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginLeft: 6,
  },
  budgetText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    marginLeft: 6,
  },
  section: {
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 16,
  },
  clientInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  clientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  clientDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginLeft: 4,
  },
  clientStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  description: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 22,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  attachmentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  attachmentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  attachmentName: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginBottom: 2,
  },
  attachmentSize: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  proposalForm: {
    marginTop: 8,
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
  submitButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
})

export default withAuth(JobDetailsScreen)
