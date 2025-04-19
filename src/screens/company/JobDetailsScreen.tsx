"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
} from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import type { RouteProp } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"
import type { CompanyStackParamList } from "../../navigation/CompanyNavigator"
import { useQuery } from "@tanstack/react-query"

type JobDetailsScreenRouteProp = RouteProp<CompanyStackParamList, "JobDetails">
type JobDetailsScreenNavigationProp = StackNavigationProp<CompanyStackParamList>

// Mock data fetching function
const fetchJobDetails = async (jobId: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: jobId,
    title: "Senior React Developer",
    type: "Full-time",
    location: "Remote",
    department: "Engineering",
    salary: "$100,000 - $130,000",
    description:
      "We are looking for an experienced React developer to join our team. The ideal candidate should have strong experience with React, Redux, and modern JavaScript. You will be responsible for developing and maintaining our web applications, collaborating with the design team, and ensuring high-quality code.\n\nResponsibilities:\n- Develop and maintain React applications\n- Collaborate with the design team\n- Write clean, maintainable code\n- Participate in code reviews\n- Troubleshoot and debug applications\n\nRequirements:\n- 3+ years of experience with React\n- Strong knowledge of JavaScript/TypeScript\n- Experience with state management (Redux, Context API)\n- Familiarity with RESTful APIs\n- Good understanding of responsive design",
    requirements: [
      "3+ years of experience with React",
      "Strong knowledge of JavaScript/TypeScript",
      "Experience with state management (Redux, Context API)",
      "Familiarity with RESTful APIs",
      "Good understanding of responsive design",
    ],
    benefits: [
      "Competitive salary",
      "Health insurance",
      "Flexible working hours",
      "Remote work options",
      "Professional development budget",
    ],
    postedAt: "2023-11-15",
    expiresAt: "2023-12-15",
    status: "active",
    applicants: [
      {
        id: "a1",
        name: "John Doe",
        title: "Senior Frontend Developer",
        avatar: "https://ui-avatars.com/api/?name=John+Doe",
        appliedAt: "2023-11-16T10:30:00",
        status: "reviewed",
      },
      {
        id: "a2",
        name: "Jane Smith",
        title: "React Developer",
        avatar: "https://ui-avatars.com/api/?name=Jane+Smith",
        appliedAt: "2023-11-17T14:45:00",
        status: "interviewing",
      },
      {
        id: "a3",
        name: "Mike Johnson",
        title: "Frontend Engineer",
        avatar: "https://ui-avatars.com/api/?name=Mike+Johnson",
        appliedAt: "2023-11-18T09:15:00",
        status: "new",
      },
      {
        id: "a4",
        name: "Sarah Williams",
        title: "Full Stack Developer",
        avatar: "https://ui-avatars.com/api/?name=Sarah+Williams",
        appliedAt: "2023-11-19T11:30:00",
        status: "new",
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
    queryKey: ["companyJobDetails", jobId],
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

  const getApplicantStatusColor = (status: string) => {
    switch (status) {
      case "new":
        return "#3B82F6" // Blue
      case "reviewed":
        return "#F59E0B" // Amber
      case "interviewing":
        return "#10B981" // Green
      case "rejected":
        return "#EF4444" // Red
      default:
        return theme.text
    }
  }

  if (isLoading || !job) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    )
  }

  const renderApplicantItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.applicantCard, { backgroundColor: theme.card }]}
      onPress={() => navigation.navigate("ApplicantProfile", { applicantId: item.id })}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.avatar }} style={styles.applicantAvatar} />
      <View style={styles.applicantInfo}>
        <Text style={[styles.applicantName, { color: theme.text }]}>{item.name}</Text>
        <Text style={[styles.applicantTitle, { color: theme.text + "80" }]}>{item.title}</Text>
        <Text style={[styles.appliedDate, { color: theme.text + "60" }]}>
          Applied {new Date(item.appliedAt).toLocaleDateString()}
        </Text>
      </View>
      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor: getApplicantStatusColor(item.status) + "20",
          },
        ]}
      >
        <Text
          style={[
            styles.statusText,
            {
              color: getApplicantStatusColor(item.status),
            },
          ]}
        >
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
    </TouchableOpacity>
  )

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
            <Ionicons name="briefcase-outline" size={16} color={theme.text + "80"} />
            <Text style={[styles.metaText, { color: theme.text + "80" }]}>{job.type}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="location-outline" size={16} color={theme.text + "80"} />
            <Text style={[styles.metaText, { color: theme.text + "80" }]}>{job.location}</Text>
          </View>
        </View>
        <View style={styles.jobMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={16} color={theme.text + "80"} />
            <Text style={[styles.metaText, { color: theme.text + "80" }]}>{job.department}</Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="cash-outline" size={16} color={theme.text + "80"} />
            <Text style={[styles.metaText, { color: theme.text + "80" }]}>{job.salary}</Text>
          </View>
        </View>
        <View style={styles.jobMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={16} color={theme.text + "80"} />
            <Text style={[styles.metaText, { color: theme.text + "80" }]}>
              Posted {new Date(job.postedAt).toLocaleDateString()}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={16} color={theme.text + "80"} />
            <Text style={[styles.metaText, { color: theme.text + "80" }]}>
              Expires {new Date(job.expiresAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "details" && { borderBottomColor: theme.accent, borderBottomWidth: 2 },
          ]}
          onPress={() => setActiveTab("details")}
        >
          <Text style={[styles.tabButtonText, { color: activeTab === "details" ? theme.accent : theme.text + "80" }]}>
            Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "applicants" && { borderBottomColor: theme.accent, borderBottomWidth: 2 },
          ]}
          onPress={() => setActiveTab("applicants")}
        >
          <Text
            style={[styles.tabButtonText, { color: activeTab === "applicants" ? theme.accent : theme.text + "80" }]}
          >
            Applicants ({job.applicants.length})
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
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Requirements</Text>
            {job.requirements.map((requirement, index) => (
              <View key={index} style={styles.listItem}>
                <View style={[styles.bulletPoint, { backgroundColor: theme.accent }]} />
                <Text style={[styles.listItemText, { color: theme.text + "90" }]}>{requirement}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Benefits</Text>
            {job.benefits.map((benefit, index) => (
              <View key={index} style={styles.listItem}>
                <View style={[styles.bulletPoint, { backgroundColor: theme.accent }]} />
                <Text style={[styles.listItemText, { color: theme.text + "90" }]}>{benefit}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.editButton, { backgroundColor: theme.accent }]}>
              <Ionicons name="create-outline" size={20} color="#FFFFFF" />
              <Text style={styles.editButtonText}>Edit Job</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.closeButton, { borderColor: "#EF4444" }]} onPress={handleCloseJob}>
              <Text style={[styles.closeButtonText, { color: "#EF4444" }]}>Close Job</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.applicantsContainer}>
          <View style={styles.applicantsHeader}>
            <Text style={[styles.applicantsCount, { color: theme.text }]}>
              {job.applicants.length} Applicant{job.applicants.length !== 1 ? "s" : ""}
            </Text>
            <TouchableOpacity style={[styles.filterButton, { borderColor: theme.border }]}>
              <Ionicons name="filter-outline" size={18} color={theme.text} />
              <Text style={[styles.filterButtonText, { color: theme.text }]}>Filter</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={job.applicants}
            renderItem={renderApplicantItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.applicantsList}
            showsVerticalScrollIndicator={false}
          />
        </View>
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
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginRight: 10,
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 22,
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
  applicantsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  applicantsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  applicantsCount: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginLeft: 5,
  },
  applicantsList: {
    paddingBottom: 20,
  },
  applicantCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
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
  appliedDate: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
})

export default JobDetailsScreen

