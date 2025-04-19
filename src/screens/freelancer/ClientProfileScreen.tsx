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
import { useNavigation, useRoute } from "@react-navigation/native"
import type { RouteProp } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"
import type { FreelancerStackParamList } from "../../navigation/FreelancerNavigator"
import { useQuery } from "@tanstack/react-query"

type ClientProfileScreenRouteProp = RouteProp<FreelancerStackParamList, "ClientProfile">
type ClientProfileScreenNavigationProp = StackNavigationProp<FreelancerStackParamList>

// Mock data fetching function
const fetchClientProfile = async (clientId: string) => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: clientId,
    name: "John Smith",
    avatar: "https://ui-avatars.com/api/?name=John+Smith",
    company: "Tech Solutions Inc.",
    location: "New York, USA",
    memberSince: "2020-05-15",
    rating: 4.8,
    reviewsCount: 32,
    jobsPosted: 12,
    hireRate: 85,
    bio: "Tech Solutions Inc. is a software development company specializing in mobile and web applications. We work with talented freelancers to deliver high-quality solutions to our clients.",
    activeJobs: [
      {
        id: "j1",
        title: "React Native Developer Needed",
        budget: 1500,
        deadline: "2023-12-15",
        description: "Looking for an experienced React Native developer to build a mobile app.",
        skills: ["React Native", "JavaScript", "TypeScript"],
        postedAt: "2023-11-20",
      },
      {
        id: "j2",
        title: "UI/UX Designer for Mobile App",
        budget: 2000,
        deadline: "2023-12-20",
        description: "Need a talented designer to create UI/UX for a mobile application.",
        skills: ["UI/UX", "Figma", "Mobile Design"],
        postedAt: "2023-11-22",
      },
    ],
    reviews: [
      {
        id: "r1",
        freelancerName: "Alex Johnson",
        freelancerAvatar: "https://ui-avatars.com/api/?name=Alex+Johnson",
        rating: 5,
        comment: "Great client to work with! Clear requirements and prompt payment.",
        date: "2023-10-15",
      },
      {
        id: "r2",
        freelancerName: "Sarah Williams",
        freelancerAvatar: "https://ui-avatars.com/api/?name=Sarah+Williams",
        rating: 4.5,
        comment: "Good communication and reasonable expectations. Would work with again.",
        date: "2023-09-22",
      },
      {
        id: "r3",
        freelancerName: "Mike Brown",
        freelancerAvatar: "https://ui-avatars.com/api/?name=Mike+Brown",
        rating: 5,
        comment: "One of the best clients I've worked with. Clear vision and respectful of my time.",
        date: "2023-08-10",
      },
    ],
  }
}

const ClientProfileScreen = () => {
  const route = useRoute<ClientProfileScreenRouteProp>()
  const navigation = useNavigation<ClientProfileScreenNavigationProp>()
  const { theme } = useTheme()
  const { clientId } = route.params
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("jobs")

  const {
    data: client,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["clientProfile", clientId],
    queryFn: () => fetchClientProfile(clientId),
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

  if (isLoading || !client) {
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Client Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.secondary]} />}
      >
        <View style={styles.profileHeader}>
          <Image source={{ uri: client.avatar }} style={styles.avatar} />
          <Text style={[styles.name, { color: theme.text }]}>{client.name}</Text>
          <Text style={[styles.company, { color: theme.text + "80" }]}>{client.company}</Text>

          <View style={styles.ratingContainer}>
            <View style={styles.starsContainer}>{renderStars(client.rating)}</View>
            <Text style={[styles.ratingText, { color: theme.text }]}>
              {client.rating.toFixed(1)} ({client.reviewsCount} reviews)
            </Text>
          </View>

          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color={theme.text + "80"} />
            <Text style={[styles.locationText, { color: theme.text + "80" }]}>{client.location}</Text>
          </View>

          <View style={styles.statsContainer}>
            <View style={[styles.statItem, { backgroundColor: theme.card }]}>
              <Text style={[styles.statValue, { color: theme.text }]}>{client.jobsPosted}</Text>
              <Text style={[styles.statLabel, { color: theme.text + "80" }]}>Jobs Posted</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: theme.card }]}>
              <Text style={[styles.statValue, { color: theme.text }]}>{client.hireRate}%</Text>
              <Text style={[styles.statLabel, { color: theme.text + "80" }]}>Hire Rate</Text>
            </View>
            <View style={[styles.statItem, { backgroundColor: theme.card }]}>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {new Date().getFullYear() - new Date(client.memberSince).getFullYear()}
              </Text>
              <Text style={[styles.statLabel, { color: theme.text + "80" }]}>Years</Text>
            </View>
          </View>
        </View>

        <View style={[styles.bioSection, { borderBottomColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>
          <Text style={[styles.bioText, { color: theme.text + "90" }]}>{client.bio}</Text>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeTab === "jobs" && { borderBottomColor: theme.secondary, borderBottomWidth: 2 },
            ]}
            onPress={() => setActiveTab("jobs")}
          >
            <Text style={[styles.tabButtonText, { color: activeTab === "jobs" ? theme.secondary : theme.text + "80" }]}>
              Active Jobs
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

        {activeTab === "jobs" && (
          <View style={styles.jobsContainer}>
            {client.activeJobs.map((job) => (
              <TouchableOpacity
                key={job.id}
                style={[styles.jobCard, { backgroundColor: theme.card }]}
                onPress={() => navigation.navigate("JobDetails", { jobId: job.id })}
              >
                <View style={styles.jobHeader}>
                  <Text style={[styles.jobTitle, { color: theme.text }]}>{job.title}</Text>
                  <Text style={[styles.jobBudget, { color: theme.secondary }]}>${job.budget}</Text>
                </View>

                <Text style={[styles.jobDescription, { color: theme.text + "80" }]} numberOfLines={2}>
                  {job.description}
                </Text>

                <View style={styles.skillsContainer}>
                  {job.skills.map((skill, index) => (
                    <View key={index} style={[styles.skillBadge, { backgroundColor: theme.secondary + "20" }]}>
                      <Text style={[styles.skillText, { color: theme.secondary }]}>{skill}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.jobFooter}>
                  <View style={styles.jobDetail}>
                    <Ionicons name="time-outline" size={14} color={theme.text + "80"} />
                    <Text style={[styles.jobDetailText, { color: theme.text + "80" }]}>
                      Posted {new Date(job.postedAt).toLocaleDateString()}
                    </Text>
                  </View>

                  <View style={styles.jobDetail}>
                    <Ionicons name="calendar-outline" size={14} color={theme.text + "80"} />
                    <Text style={[styles.jobDetailText, { color: theme.text + "80" }]}>
                      Due {new Date(job.deadline).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === "reviews" && (
          <View style={styles.reviewsContainer}>
            {client.reviews.map((review) => (
              <View key={review.id} style={[styles.reviewItem, { backgroundColor: theme.card }]}>
                <View style={styles.reviewHeader}>
                  <Image source={{ uri: review.freelancerAvatar }} style={styles.reviewerAvatar} />
                  <View style={styles.reviewerInfo}>
                    <Text style={[styles.reviewerName, { color: theme.text }]}>{review.freelancerName}</Text>
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
  company: {
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
    marginBottom: 20,
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
  bioSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
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
  jobsContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  jobCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    flex: 1,
    marginRight: 10,
  },
  jobBudget: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  jobDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 10,
    lineHeight: 20,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  skillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  skillText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  jobFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  jobDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  jobDetailText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginLeft: 5,
  },
  reviewsContainer: {
    paddingHorizontal: 16,
    marginBottom: 20,
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

export default ClientProfileScreen
