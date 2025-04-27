"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import type { RouteProp } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"
import type { ClientStackParamList } from "../../navigation/ClientNavigator"
import { useQuery } from "@tanstack/react-query"
import withAuth from "@/src/hoc/withAuth"

type JobDetailsScreenRouteProp = RouteProp<ClientStackParamList, "JobDetails">
type JobDetailsScreenNavigationProp = StackNavigationProp<ClientStackParamList>

// Mock data fetching function
const fetchJobDetails = async (jobId: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: jobId,
    title: "React Native Developer Needed",
    budget: 1500,
    deadline: "2023-12-15",
    status: "active",
    proposals: 12,
    description:
      "We are looking for an experienced React Native developer to build a mobile app for our e-commerce platform. The app should be compatible with both iOS and Android platforms.\n\nThe ideal candidate should have experience with:\n- React Native and Expo\n- State management (Redux or Context API)\n- API integration\n- UI/UX implementation\n- Performance optimization\n\nThe project timeline is approximately 6 weeks. Regular communication and updates will be required.",
    skills: ["React Native", "JavaScript", "TypeScript", "Redux", "API Integration"],
    postedAt: "2023-11-20",
    category: "Mobile Development",
    location: "Remote",
    type: "Fixed Price",
    applicants: [
      {
        id: "a1",
        name: "John Doe",
        title: "Senior Frontend Developer",
        avatar: "https://ui-avatars.com/api/?name=John+Doe",
        proposal: "I have 5 years of experience with React Native and have built several e-commerce apps.",
        bid: 1400,
        rating: 4.8,
      },
      {
        id: "a2",
        name: "Jane Smith",
        title: "Mobile App Developer",
        avatar: "https://ui-avatars.com/api/?name=Jane+Smith",
        proposal: "I specialize in React Native development with a focus on performance optimization.",
        bid: 1600,
        rating: 4.9,
      },
      {
        id: "a3",
        name: "Mike Johnson",
        title: "React Native Expert",
        avatar: "https://ui-avatars.com/api/?name=Mike+Johnson",
        proposal: "I have worked on multiple e-commerce apps and can deliver high-quality code.",
        bid: 1500,
        rating: 4.7,
      },
    ],
  }
}

const JobDetailsScreen = () => {
  const route = useRoute<JobDetailsScreenRouteProp>()
  const navigation = useNavigation<JobDetailsScreenNavigationProp>()
  const { theme } = useTheme()
  const { jobId } = route.params
  const [activeTab, setActiveTab] = useState("details")

  const { data: job, isLoading } = useQuery({
    queryKey: ["jobDetails", jobId],
    queryFn: () => fetchJobDetails(jobId),
  })

  const handleCloseJob = () => {
    Alert.alert("Close Job", "Are you sure you want to close this job posting?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Close Job",
        style: "destructive",
        onPress: () => {
          // In a real app, you would call an API to close the job
          Alert.alert("Job Closed", "This job posting has been closed successfully.")
          navigation.goBack()
        },
      },
    ])
  }

  if (isLoading || !job) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
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
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.jobHeader}>
        <Text style={[styles.jobTitle, { color: theme.text }]}>{job.title}</Text>
        <View style={styles.jobMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="cash-outline" size={16} color={theme.primary} />
            <Text style={[styles.budgetText, { color: theme.primary }]}>${job.budget}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={16} color={theme.text + "80"} />
            <Text style={[styles.metaText, { color: theme.text + "80" }]}>
              Due: {new Date(job.deadline).toLocaleDateString()}
            </Text>
          </View>
        </View>
        <View style={styles.jobMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={16} color={theme.text + "80"} />
            <Text style={[styles.metaText, { color: theme.text + "80" }]}>{job.location}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="briefcase-outline" size={16} color={theme.text + "80"} />
            <Text style={[styles.metaText, { color: theme.text + "80" }]}>{job.type}</Text>
          </View>
        </View>
        <View style={styles.jobMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color={theme.text + "80"} />
            <Text style={[styles.metaText, { color: theme.text + "80" }]}>
              Posted {new Date(job.postedAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={16} color={theme.text + "80"} />
            <Text style={[styles.metaText, { color: theme.text + "80" }]}>{job.proposals} proposals</Text>
          </View>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "details" && { borderBottomColor: theme.primary, borderBottomWidth: 2 },
          ]}
          onPress={() => setActiveTab("details")}
        >
          <Text style={[styles.tabButtonText, { color: activeTab === "details" ? theme.primary : theme.text + "80" }]}>
            Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "proposals" && { borderBottomColor: theme.primary, borderBottomWidth: 2 },
          ]}
          onPress={() => setActiveTab("proposals")}
        >
          <Text
            style={[styles.tabButtonText, { color: activeTab === "proposals" ? theme.primary : theme.text + "80" }]}
          >
            Proposals ({job.applicants.length})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "details" ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Job Description</Text>
            <Text style={[styles.description, { color: theme.text + "90" }]}>{job.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Skills Required</Text>
            <View style={styles.skillsContainer}>
              {job.skills.map((skill, index) => (
                <View key={index} style={[styles.skillBadge, { backgroundColor: theme.primary + "20" }]}>
                  <Text style={[styles.skillText, { color: theme.primary }]}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.editButton, { backgroundColor: theme.primary }]}>
              <Ionicons name="create-outline" size={20} color="#FFFFFF" />
              <Text style={styles.editButtonText}>Edit Job</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.closeButton, { borderColor: "#EF4444" }]} onPress={handleCloseJob}>
              <Text style={[styles.closeButtonText, { color: "#EF4444" }]}>Close Job</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.proposalsHeader}>
            <Text style={[styles.proposalsCount, { color: theme.text }]}>
              {job.applicants.length} Proposal{job.applicants.length !== 1 ? "s" : ""}
            </Text>
          </View>

          {job.applicants.map((applicant) => (
            <View key={applicant.id} style={[styles.proposalCard, { backgroundColor: theme.card }]}>
              <TouchableOpacity
                style={styles.applicantHeader}
                onPress={() => navigation.navigate("FreelancerProfile", { freelancerId: applicant.id })}
              >
                <Image source={{ uri: applicant.avatar }} style={styles.applicantAvatar} />
                <View style={styles.applicantInfo}>
                  <Text style={[styles.applicantName, { color: theme.text }]}>{applicant.name}</Text>
                  <Text style={[styles.applicantTitle, { color: theme.text + "80" }]}>{applicant.title}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={[styles.ratingText, { color: theme.text }]}>{applicant.rating}</Text>
                  </View>
                </View>
                <View style={styles.bidContainer}>
                  <Text style={[styles.bidAmount, { color: theme.primary }]}>${applicant.bid}</Text>
                  <Text style={[styles.bidLabel, { color: theme.text + "60" }]}>Bid</Text>
                </View>
              </TouchableOpacity>

              <Text style={[styles.proposalText, { color: theme.text + "90" }]}>{applicant.proposal}</Text>

              <View style={styles.proposalActions}>
                <TouchableOpacity style={[styles.hireButton, { backgroundColor: theme.primary }]}>
                  <Text style={styles.hireButtonText}>Hire</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.messageButton, { borderColor: theme.primary }]}>
                  <Text style={[styles.messageButtonText, { color: theme.primary }]}>Message</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
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
  moreButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  jobHeader: {
    paddingHorizontal: 16,
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
  tabsContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  tabButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 12,
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
  actionButtons: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 30,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginLeft: 8,
  },
  closeButton: {
    flex: 1,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  proposalsHeader: {
    marginBottom: 15,
  },
  proposalsCount: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  proposalCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  applicantHeader: {
    flexDirection: "row",
    marginBottom: 15,
  },
  applicantAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  applicantInfo: {
    flex: 1,
  },
  applicantName: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginBottom: 2,
  },
  applicantTitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
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
  bidContainer: {
    alignItems: "center",
  },
  bidAmount: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  bidLabel: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  proposalText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 20,
    marginBottom: 15,
  },
  proposalActions: {
    flexDirection: "row",
  },
  hireButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  hireButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  messageButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  messageButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
})

export default withAuth(JobDetailsScreen)
