"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from "react-native"
import { useNavigation, useRoute } from "@react-navigation/native"
import type { RouteProp } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"
import type { ClientStackParamList } from "../../navigation/ClientNavigator"
import { useQuery } from "@tanstack/react-query"
import withAuth from "@/src/hoc/withAuth"

type FreelancerProfileScreenRouteProp = RouteProp<ClientStackParamList, "FreelancerProfile">
type FreelancerProfileScreenNavigationProp = StackNavigationProp<ClientStackParamList>

// Mock data fetching function
const fetchFreelancerProfile = async (freelancerId: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: freelancerId,
    name: "John Doe",
    title: "Senior Full Stack Developer",
    avatar: "https://ui-avatars.com/api/?name=John+Doe",
    rating: 4.8,
    hourlyRate: 25,
    location: "San Francisco, USA",
    memberSince: "2020-05-15",
    bio: "Experienced full stack developer with 5+ years of experience in React, Node.js, and MongoDB. I specialize in building responsive and user-friendly web applications that deliver exceptional user experiences.",
    skills: [
      "React",
      "Node.js",
      "MongoDB",
      "TypeScript",
      "JavaScript",
      "HTML/CSS",
      "Redux",
      "Express",
      "RESTful APIs",
      "Git",
    ],
    experience: [
      {
        id: "e1",
        position: "Senior Full Stack Developer",
        company: "Tech Innovations Inc.",
        duration: "2020-Present",
        description: "Leading full stack development for multiple web applications using React and Node.js.",
      },
      {
        id: "e2",
        position: "Full Stack Developer",
        company: "Digital Solutions LLC",
        duration: "2018-2020",
        description: "Developed responsive web applications using React, Node.js, and MongoDB.",
      },
      {
        id: "e3",
        position: "Frontend Developer",
        company: "WebTech Co.",
        duration: "2016-2018",
        description: "Worked on various frontend development projects using React and JavaScript.",
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
    completedProjects: 32,
    reviews: [
      {
        id: "r1",
        clientName: "Alex Johnson",
        clientAvatar: "https://ui-avatars.com/api/?name=Alex+Johnson",
        rating: 5,
        comment: "John delivered exceptional work on our e-commerce app. Highly recommended!",
        date: "2023-10-15",
      },
      {
        id: "r2",
        clientName: "Sarah Williams",
        clientAvatar: "https://ui-avatars.com/api/?name=Sarah+Williams",
        rating: 5,
        comment: "Great communication and excellent technical skills. Will hire again!",
        date: "2023-09-22",
      },
      {
        id: "r3",
        clientName: "Tech Solutions Inc.",
        clientAvatar: "https://ui-avatars.com/api/?name=Tech+Solutions",
        rating: 4.5,
        comment: "Delivered the project on time and with high quality. Very professional.",
        date: "2023-08-10",
      },
    ],
  }
}

const FreelancerProfileScreen = () => {
  const route = useRoute<FreelancerProfileScreenRouteProp>()
  const navigation = useNavigation<FreelancerProfileScreenNavigationProp>()
  const { theme } = useTheme()
  const { freelancerId } = route.params
  const [activeTab, setActiveTab] = useState("about")
  const [isFavorite, setIsFavorite] = useState(false)

  const { data: freelancer, isLoading } = useQuery({
    queryKey: ["freelancerProfile", freelancerId],
    queryFn: () => fetchFreelancerProfile(freelancerId),
  })

  const handleHire = () => {
    Alert.alert("Hire Freelancer", "Would you like to create a new project with this freelancer?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Create Project",
        onPress: () => {
          // In a real app, you would navigate to a project creation screen
          Alert.alert("Success", "Project creation screen would open here.")
        },
      },
    ])
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={`star-${i}`} name="star" size={16} color="#FFD700" />)
    }

    if (halfStar) {
      stars.push(<Ionicons key="star-half" name="star-half" size={16} color="#FFD700" />)
    }

    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`star-empty-${i}`} name="star-outline" size={16} color="#FFD700" />)
    }

    return stars
  }

  if (isLoading || !freelancer) {
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Freelancer Profile</Text>
        <TouchableOpacity style={styles.favoriteButton} onPress={() => setIsFavorite(!isFavorite)}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "#EF4444" : theme.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: freelancer.avatar }} style={styles.avatar} />
          <Text style={[styles.name, { color: theme.text }]}>{freelancer.name}</Text>
          <Text style={[styles.title, { color: theme.text + "80" }]}>{freelancer.title}</Text>

          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>{renderStars(freelancer.rating)}</View>
            <Text style={[styles.ratingText, { color: theme.text }]}>
              {freelancer.rating.toFixed(1)} ({freelancer.reviews.length} reviews)
            </Text>
          </View>

          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color={theme.text + "80"} />
            <Text style={[styles.locationText, { color: theme.text + "80" }]}>{freelancer.location}</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={[styles.statItem, { backgroundColor: theme.card }]}>
              <Text style={[styles.statValue, { color: theme.text }]}>${freelancer.hourlyRate}</Text>
              <Text style={[styles.statLabel, { color: theme.text + "80" }]}>Hourly Rate</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: theme.card }]}>
              <Text style={[styles.statValue, { color: theme.text }]}>{freelancer.completedProjects}</Text>
              <Text style={[styles.statLabel, { color: theme.text + "80" }]}>Projects</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: theme.card }]}>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {new Date().getFullYear() - new Date(freelancer.memberSince).getFullYear()}
              </Text>
              <Text style={[styles.statLabel, { color: theme.text + "80" }]}>Years</Text>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={[styles.hireButton, { backgroundColor: theme.primary }]} onPress={handleHire}>
              <Text style={styles.hireButtonText}>Hire Me</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.messageButton, { borderColor: theme.primary }]}>
              <Ionicons name="chatbubble-outline" size={20} color={theme.primary} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "about" && { borderBottomColor: theme.primary, borderBottomWidth: 2 },
            ]}
            onPress={() => setActiveTab("about")}
          >
            <Text style={[styles.tabButtonText, { color: activeTab === "about" ? theme.primary : theme.text + "80" }]}>
              About
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "experience" && { borderBottomColor: theme.primary, borderBottomWidth: 2 },
            ]}
            onPress={() => setActiveTab("experience")}
          >
            <Text
              style={[styles.tabButtonText, { color: activeTab === "experience" ? theme.primary : theme.text + "80" }]}
            >
              Experience
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "reviews" && { borderBottomColor: theme.primary, borderBottomWidth: 2 },
            ]}
            onPress={() => setActiveTab("reviews")}
          >
            <Text
              style={[styles.tabButtonText, { color: activeTab === "reviews" ? theme.primary : theme.text + "80" }]}
            >
              Reviews
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "about" && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>About Me</Text>
            <Text style={[styles.bioText, { color: theme.text + "90" }]}>{freelancer.bio}</Text>

            <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 20 }]}>Skills</Text>
            <View style={styles.skillsContainer}>
              {freelancer.skills.map((skill, index) => (
                <View key={index} style={[styles.skillBadge, { backgroundColor: theme.primary + "20" }]}>
                  <Text style={[styles.skillText, { color: theme.primary }]}>{skill}</Text>
                </View>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 20 }]}>Education</Text>
            {freelancer.education.map((edu) => (
              <View key={edu.id} style={[styles.educationItem, { borderBottomColor: theme.border }]}>
                <View style={styles.educationHeader}>
                  <Text style={[styles.educationDegree, { color: theme.text }]}>{edu.degree}</Text>
                  <Text style={[styles.educationYear, { color: theme.text + "80" }]}>{edu.year}</Text>
                </View>
                <Text style={[styles.educationInstitution, { color: theme.text + "80" }]}>{edu.institution}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === "experience" && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Work Experience</Text>
            {freelancer.experience.map((exp) => (
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
        )}

        {activeTab === "reviews" && (
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Client Reviews</Text>
            {freelancer.reviews.map((review) => (
              <View key={review.id} style={[styles.reviewItem, { backgroundColor: theme.card }]}>
                <View style={styles.reviewHeader}>
                  <Image source={{ uri: review.clientAvatar }} style={styles.reviewerAvatar} />
                  <View style={styles.reviewerInfo}>
                    <Text style={[styles.reviewerName, { color: theme.text }]}>{review.clientName}</Text>
                    <View style={styles.reviewRating}>{renderStars(review.rating)}</View>
                  </View>
                  <Text style={[styles.reviewDate, { color: theme.text + "60" }]}>
                    {new Date(review.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={[styles.reviewComment, { color: theme.text + "80" }]}>{review.comment}</Text>
              </View>
            ))}
          </View>
        )}
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
  favoriteButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
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
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
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
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  statItem: {
    width: "31%",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  actionButtons: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 20,
  },
  hireButton: {
    flex: 1,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  hireButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  messageButton: {
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
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
  sectionContainer: {
    paddingHorizontal: 16,
    marginBottom: 30,
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
  reviewItem: {
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: "row",
  },
  reviewDate: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  reviewComment: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 20,
  },
})

export default withAuth(FreelancerProfileScreen)
