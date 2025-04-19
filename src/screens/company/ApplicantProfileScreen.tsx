"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import type { RouteProp } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"
import type { CompanyStackParamList } from "../../navigation/CompanyNavigator"
import { useQuery } from "@tanstack/react-query"

type ApplicantProfileScreenRouteProp = RouteProp<CompanyStackParamList, "ApplicantProfile">
type ApplicantProfileScreenNavigationProp = StackNavigationProp<CompanyStackParamList>

// Mock data fetching function
const fetchApplicantProfile = async (applicantId: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: applicantId,
    name: "John Doe",
    title: "Senior Frontend Developer",
    avatar: "https://ui-avatars.com/api/?name=John+Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Experienced frontend developer with 5+ years of experience in React, Redux, and modern JavaScript. Passionate about creating responsive and user-friendly web applications.",
    skills: [
      "React",
      "Redux",
      "TypeScript",
      "JavaScript",
      "HTML/CSS",
      "Responsive Design",
      "UI/UX",
      "Git",
      "RESTful APIs",
    ],
    experience: [
      {
        id: "e1",
        position: "Senior Frontend Developer",
        company: "Tech Innovations Inc.",
        duration: "2020-Present",
        description: "Leading frontend development for multiple web applications using React and TypeScript.",
      },
      {
        id: "e2",
        position: "Frontend Developer",
        company: "Digital Solutions LLC",
        duration: "2018-2020",
        description: "Developed responsive web applications using React and Redux.",
      },
      {
        id: "e3",
        position: "Junior Web Developer",
        company: "WebTech Co.",
        duration: "2016-2018",
        description: "Worked on various web development projects using JavaScript and jQuery.",
      },
    ],
    education: [
      {
        id: "ed1",
        degree: "Master of Computer Science",
        institution: "Stanford University",
        year: "2014-2016",
      },
      {
        id: "ed2",
        degree: "Bachelor of Software Engineering",
        institution: "University of California",
        year: "2010-2014",
      },
    ],
    appliedFor: {
      id: "j1",
      title: "Senior React Developer",
      type: "Full-time",
      department: "Engineering",
    },
    appliedAt: "2023-11-16T10:30:00",
    status: "reviewed",
    resume: {
      name: "John_Doe_Resume.pdf",
      url: "https://example.com/resume.pdf",
      size: "1.2 MB",
    },
    coverLetter:
      "Dear Hiring Manager,\n\nI am writing to express my interest in the Senior React Developer position at your company. With over 5 years of experience in frontend development, I believe I would be a valuable addition to your team.\n\nThroughout my career, I have developed a strong skill set in React, Redux, and modern JavaScript. I am passionate about creating responsive and user-friendly web applications that deliver exceptional user experiences.\n\nI am excited about the opportunity to bring my technical expertise and creative problem-solving skills to your company. I look forward to discussing how my background and skills align with your needs.\n\nThank you for considering my application.\n\nSincerely,\nJohn Doe",
  }
}

const ApplicantProfileScreen = () => {
  const route = useRoute<ApplicantProfileScreenRouteProp>()
  const navigation = useNavigation<ApplicantProfileScreenNavigationProp>()
  const { theme } = useTheme()
  const { applicantId } = route.params
  const [activeTab, setActiveTab] = useState("profile")

  const { data: applicant, isLoading } = useQuery({
    queryKey: ["applicantProfile", applicantId],
    queryFn: () => fetchApplicantProfile(applicantId),
  })

  const handleScheduleInterview = () => {
    Alert.alert("Schedule Interview", "Would you like to schedule an interview with this applicant?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Schedule",
        onPress: () => {
          // In a real app, you would navigate to an interview scheduling screen
          Alert.alert("Interview Scheduled", "An interview has been scheduled with this applicant.")
        },
      },
    ])
  }

  const handleRejectApplicant = () => {
    Alert.alert("Reject Applicant", "Are you sure you want to reject this applicant?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Reject",
        style: "destructive",
        onPress: () => {
          // In a real app, you would call an API to reject the applicant
          Alert.alert("Applicant Rejected", "This applicant has been rejected.")
          navigation.goBack()
        },
      },
    ])
  }

  if (isLoading || !applicant) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    )
  }

  const getStatusColor = (status: string) => {
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

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Applicant Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: applicant.avatar }} style={styles.avatar} />
          <Text style={[styles.name, { color: theme.text }]}>{applicant.name}</Text>
          <Text style={[styles.title, { color: theme.text + "80" }]}>{applicant.title}</Text>

          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color={theme.text + "80"} />
            <Text style={[styles.locationText, { color: theme.text + "80" }]}>{applicant.location}</Text>
          </View>

          <View style={styles.applicationInfo}>
            <Text style={[styles.appliedForLabel, { color: theme.text + "80" }]}>Applied for:</Text>
            <Text style={[styles.appliedForValue, { color: theme.accent }]}>{applicant.appliedFor.title}</Text>
            <Text style={[styles.appliedAtText, { color: theme.text + "60" }]}>
              {new Date(applicant.appliedAt).toLocaleDateString()}
            </Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor: getStatusColor(applicant.status) + "20",
              },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                {
                  color: getStatusColor(applicant.status),
                },
              ]}
            >
              {applicant.status.charAt(0).toUpperCase() + applicant.status.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.contactButtons}>
          <TouchableOpacity style={[styles.contactButton, { backgroundColor: theme.accent }]}>
            <Ionicons name="mail-outline" size={20} color="#FFFFFF" />
            <Text style={styles.contactButtonText}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.contactButton, { backgroundColor: theme.accent }]}>
            <Ionicons name="call-outline" size={20} color="#FFFFFF" />
            <Text style={styles.contactButtonText}>Call</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "profile" && { borderBottomColor: theme.accent, borderBottomWidth: 2 },
            ]}
            onPress={() => setActiveTab("profile")}
          >
            <Text style={[styles.tabButtonText, { color: activeTab === "profile" ? theme.accent : theme.text + "80" }]}>
              Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "resume" && { borderBottomColor: theme.accent, borderBottomWidth: 2 },
            ]}
            onPress={() => setActiveTab("resume")}
          >
            <Text style={[styles.tabButtonText, { color: activeTab === "resume" ? theme.accent : theme.text + "80" }]}>
              Resume
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "coverLetter" && { borderBottomColor: theme.accent, borderBottomWidth: 2 },
            ]}
            onPress={() => setActiveTab("coverLetter")}
          >
            <Text
              style={[styles.tabButtonText, { color: activeTab === "coverLetter" ? theme.accent : theme.text + "80" }]}
            >
              Cover Letter
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "profile" && (
          <View style={styles.profileContent}>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>
              <Text style={[styles.bioText, { color: theme.text + "90" }]}>{applicant.bio}</Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact Information</Text>
              <View style={styles.contactInfo}>
                <View style={styles.contactItem}>
                  <Ionicons name="mail-outline" size={20} color={theme.accent} />
                  <Text style={[styles.contactText, { color: theme.text }]}>{applicant.email}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Ionicons name="call-outline" size={20} color={theme.accent} />
                  <Text style={[styles.contactText, { color: theme.text }]}>{applicant.phone}</Text>
                </View>
                <View style={styles.contactItem}>
                  <Ionicons name="location-outline" size={20} color={theme.accent} />
                  <Text style={[styles.contactText, { color: theme.text }]}>{applicant.location}</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Skills</Text>
              <View style={styles.skillsContainer}>
                {applicant.skills.map((skill, index) => (
                  <View key={index} style={[styles.skillBadge, { backgroundColor: theme.accent + "20" }]}>
                    <Text style={[styles.skillText, { color: theme.accent }]}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Experience</Text>
              {applicant.experience.map((exp) => (
                <View key={exp.id} style={[styles.experienceItem, { borderBottomColor: theme.border }]}>
                  <View style={styles.experienceHeader}>
                    <Text style={[styles.experiencePosition, { color: theme.text }]}>{exp.position}</Text>
                    <Text style={[styles.experienceDuration, { color: theme.text + "80" }]}>{exp.duration}</Text>
                  </View>
                  <Text style={[styles.experienceCompany, { color: theme.text + "80" }]}>{exp.company}</Text>
                  <Text style={[styles.experienceDescription, { color: theme.text + "80" }]}>{exp.description}</Text>
                </View>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Education</Text>
              {applicant.education.map((edu) => (
                <View key={edu.id} style={[styles.educationItem, { borderBottomColor: theme.border }]}>
                  <View style={styles.educationHeader}>
                    <Text style={[styles.educationDegree, { color: theme.text }]}>{edu.degree}</Text>
                    <Text style={[styles.educationYear, { color: theme.text + "80" }]}>{edu.year}</Text>
                  </View>
                  <Text style={[styles.educationInstitution, { color: theme.text + "80" }]}>{edu.institution}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {activeTab === "resume" && (
          <View style={styles.resumeContent}>
            <TouchableOpacity style={[styles.resumeCard, { backgroundColor: theme.card }]}>
              <View style={styles.resumeIcon}>
                <Ionicons name="document-text" size={40} color={theme.accent} />
              </View>
              <View style={styles.resumeInfo}>
                <Text style={[styles.resumeName, { color: theme.text }]}>{applicant.resume.name}</Text>
                <Text style={[styles.resumeSize, { color: theme.text + "60" }]}>{applicant.resume.size}</Text>
              </View>
              <TouchableOpacity style={[styles.downloadButton, { backgroundColor: theme.accent }]}>
                <Ionicons name="download-outline" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        )}

        {activeTab === "coverLetter" && (
          <View style={styles.coverLetterContent}>
            <View style={[styles.coverLetterCard, { backgroundColor: theme.card }]}>
              <Text style={[styles.coverLetterText, { color: theme.text }]}>{applicant.coverLetter}</Text>
            </View>
          </View>
        )}

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.interviewButton, { backgroundColor: theme.accent }]}
            onPress={handleScheduleInterview}
          >
            <Text style={styles.interviewButtonText}>Schedule Interview</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.rejectButton, { borderColor: "#EF4444" }]} onPress={handleRejectApplicant}>
            <Text style={[styles.rejectButtonText, { color: "#EF4444" }]}>Reject</Text>
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  locationText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginLeft: 6,
  },
  applicationInfo: {
    alignItems: "center",
    marginBottom: 12,
  },
  appliedForLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 4,
  },
  appliedForValue: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginBottom: 4,
  },
  appliedAtText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  contactButtons: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  contactButton: {
    flex: 1,
    flexDirection: "row",
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  contactButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginLeft: 8,
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
  profileContent: {
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
  bioText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 22,
  },
  contactInfo: {
    marginTop: 8,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginLeft: 12,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
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
  experienceItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  experienceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  experiencePosition: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  experienceDuration: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  experienceCompany: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 8,
  },
  experienceDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 20,
  },
  educationItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  educationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  educationDegree: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  educationYear: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  educationInstitution: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  resumeContent: {
    paddingHorizontal: 16,
  },
  resumeCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 10,
  },
  resumeIcon: {
    marginRight: 16,
  },
  resumeInfo: {
    flex: 1,
  },
  resumeName: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginBottom: 4,
  },
  resumeSize: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  downloadButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  coverLetterContent: {
    paddingHorizontal: 16,
  },
  coverLetterCard: {
    padding: 16,
    borderRadius: 10,
  },
  coverLetterText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 30,
  },
  interviewButton: {
    flex: 1,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  interviewButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  rejectButton: {
    flex: 1,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  rejectButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
})

export default ApplicantProfileScreen
