"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"
import { useAuth } from "../../contexts/AuthContext"
import type { FreelancerStackParamList } from "../../navigation/FreelancerNavigator"
import { useQuery } from "@tanstack/react-query"
import withAuth from "@/src/hoc/withAuth"

type FreelancerProfileScreenNavigationProp = StackNavigationProp<FreelancerStackParamList>

// Mock data fetching function
const fetchProfileData = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: "1",
    name: "Alex Johnson",
    title: "Senior Mobile Developer",
    avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=random",
    rating: 4.9,
    completedProjects: 32,
    hourlyRate: 35,
    location: "New York, USA",
    memberSince: "2021-05-15",
    bio: "Experienced mobile developer specializing in React Native and Expo. I've worked with startups and established companies to deliver high-quality mobile applications across various industries.",
    skills: [
      "React Native",
      "Expo",
      "TypeScript",
      "JavaScript",
      "Redux",
      "UI/UX Design",
      "API Integration",
      "Firebase",
      "AWS",
    ],
    education: [
      {
        id: "e1",
        degree: "Master of Computer Science",
        institution: "Stanford University",
        year: "2018-2020",
      },
      {
        id: "e2",
        degree: "Bachelor of Software Engineering",
        institution: "MIT",
        year: "2014-2018",
      },
    ],
    experience: [
      {
        id: "exp1",
        position: "Senior Mobile Developer",
        company: "Tech Innovations Inc.",
        duration: "2020-Present",
        description: "Leading mobile app development using React Native and Expo.",
      },
      {
        id: "exp2",
        position: "Mobile Developer",
        company: "Digital Solutions LLC",
        duration: "2018-2020",
        description: "Developed and maintained multiple mobile applications for clients.",
      },
    ],
    reviews: [
      {
        id: "r1",
        clientName: "John Smith",
        clientAvatar: "https://ui-avatars.com/api/?name=John+Smith",
        rating: 5,
        comment: "Alex delivered exceptional work on our e-commerce app. Highly recommended!",
        date: "2023-10-15",
      },
      {
        id: "r2",
        clientName: "Sarah Johnson",
        clientAvatar: "https://ui-avatars.com/api/?name=Sarah+Johnson",
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
  const navigation = useNavigation<FreelancerProfileScreenNavigationProp>()
  const { theme } = useTheme()
  const { signOut } = useAuth()
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("about")

  const { data: profile, refetch } = useQuery({
    queryKey: ["freelancerProfile"],
    queryFn: fetchProfileData,
  })

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
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

  if (!profile) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.secondary} />
        </View>
      </View>
    )
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.secondary]} />}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.settingsButton, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate("FreelancerSettings")}
        >
          <Ionicons name="settings-outline" size={22} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: theme.card }]} onPress={signOut}>
          <Ionicons name="log-out-outline" size={22} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileHeader}>
        <Image source={{ uri: profile.avatar }} style={styles.avatar} />
        <Text style={[styles.name, { color: theme.text }]}>{profile.name}</Text>
        <Text style={[styles.title, { color: theme.text + "80" }]}>{profile.title}</Text>

        <View style={styles.ratingContainer}>
          <View style={styles.starsContainer}>{renderStars(profile.rating)}</View>
          <Text style={[styles.ratingText, { color: theme.text }]}>
            {profile.rating.toFixed(1)} ({profile.reviews.length} reviews)
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statItem, { backgroundColor: theme.card }]}>
            <Text style={[styles.statValue, { color: theme.text }]}>{profile.completedProjects}</Text>
            <Text style={[styles.statLabel, { color: theme.text + "80" }]}>Projects</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: theme.card }]}>
            <Text style={[styles.statValue, { color: theme.text }]}>${profile.hourlyRate}</Text>
            <Text style={[styles.statLabel, { color: theme.text + "80" }]}>Hourly</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: theme.card }]}>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {new Date().getFullYear() - new Date(profile.memberSince).getFullYear()}
            </Text>
            <Text style={[styles.statLabel, { color: theme.text + "80" }]}>Years</Text>
          </View>
        </View>

        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color={theme.text + "80"} />
          <Text style={[styles.locationText, { color: theme.text + "80" }]}>{profile.location}</Text>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.editButton, { backgroundColor: theme.secondary }]}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.shareButton, { borderColor: theme.secondary }]}>
            <Ionicons name="share-social-outline" size={20} color={theme.secondary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "about" && { borderBottomColor: theme.secondary, borderBottomWidth: 2 },
          ]}
          onPress={() => setActiveTab("about")}
        >
          <Text style={[styles.tabButtonText, { color: activeTab === "about" ? theme.secondary : theme.text + "80" }]}>
            About
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "experience" && { borderBottomColor: theme.secondary, borderBottomWidth: 2 },
          ]}
          onPress={() => setActiveTab("experience")}
        >
          <Text
            style={[styles.tabButtonText, { color: activeTab === "experience" ? theme.secondary : theme.text + "80" }]}
          >
            Experience
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "reviews" && { borderBottomColor: theme.secondary, borderBottomWidth: 2 },
          ]}
          onPress={() => setActiveTab("reviews")}
        >
          <Text
            style={[styles.tabButtonText, { color: activeTab === "reviews" ? theme.secondary : theme.text + "80" }]}
          >
            Reviews
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "about" && (
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>About Me</Text>
          <Text style={[styles.bioText, { color: theme.text + "80" }]}>{profile.bio}</Text>

          <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 20 }]}>Skills</Text>
          <View style={styles.skillsContainer}>
            {profile.skills.map((skill, index) => (
              <View key={index} style={[styles.skillBadge, { backgroundColor: theme.secondary + "20" }]}>
                <Text style={[styles.skillText, { color: theme.secondary }]}>{skill}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 20 }]}>Education</Text>
          {profile.education.map((edu) => (
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
          {profile.experience.map((exp) => (
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
          {profile.reviews.map((review) => (
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 16,
  },
  starsContainer: {
    flexDirection: "row",
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
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
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  locationText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginLeft: 6,
  },
  actionButtons: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 20,
  },
  editButton: {
    flex: 1,
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
  },
  shareButton: {
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
