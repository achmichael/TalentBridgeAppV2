"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, FlatList } from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"
import { useAuth } from "../../contexts/AuthContext"
import type { ClientStackParamList } from "../../navigation/ClientNavigator"
import { useQuery } from "@tanstack/react-query"
import JobCard from "../../components/client/JobCard"
import FreelancerCard from "../../components/client/FreelancerCard"
import DashboardSkeleton from "../../components/skeletons/DashboardSkeleton"

type ClientDashboardScreenNavigationProp = StackNavigationProp<ClientStackParamList>

// Mock data fetching functions
const fetchRecommendedFreelancers = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  return [
    {
      id: "1",
      name: "John Doe",
      title: "Full Stack Developer",
      rating: 4.8,
      hourlyRate: 25,
      avatar: "https://ui-avatars.com/api/?name=John+Doe",
      skills: ["React", "Node.js", "MongoDB"],
    },
    {
      id: "2",
      name: "Jane Smith",
      title: "UI/UX Designer",
      rating: 4.9,
      hourlyRate: 30,
      avatar: "https://ui-avatars.com/api/?name=Jane+Smith",
      skills: ["Figma", "Adobe XD", "Sketch"],
    },
    {
      id: "3",
      name: "Mike Johnson",
      title: "Mobile Developer",
      rating: 4.7,
      hourlyRate: 28,
      avatar: "https://ui-avatars.com/api/?name=Mike+Johnson",
      skills: ["React Native", "Flutter", "Swift"],
    },
  ]
}

const fetchActiveJobs = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return [
    {
      id: "1",
      title: "React Native Developer Needed",
      budget: 1500,
      deadline: "2023-12-15",
      status: "active",
      proposals: 12,
      description: "Looking for an experienced React Native developer to build a mobile app.",
    },
    {
      id: "2",
      title: "UI/UX Designer for Website Redesign",
      budget: 2000,
      deadline: "2023-12-20",
      status: "active",
      proposals: 8,
      description: "Need a talented designer to redesign our company website.",
    },
  ]
}

const ClientDashboardScreen = () => {
  const navigation = useNavigation<ClientDashboardScreenNavigationProp>()
  const { theme } = useTheme()
  const { user } = useAuth()

  // Fetch recommended freelancers
  const {
    data: freelancers,
    isLoading: isLoadingFreelancers,
    refetch: refetchFreelancers,
  } = useQuery({
    queryKey: ["recommendedFreelancers"],
    queryFn: fetchRecommendedFreelancers,
  })

  // Fetch active jobs
  const {
    data: jobs,
    isLoading: isLoadingJobs,
    refetch: refetchJobs,
  } = useQuery({
    queryKey: ["activeJobs"],
    queryFn: fetchActiveJobs,
  })

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await Promise.all([refetchFreelancers(), refetchJobs()])
    setRefreshing(false)
  }

  if (isLoadingFreelancers || isLoadingJobs) {
    return <DashboardSkeleton />
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.text }]}>Hello, {user?.username}</Text>
          <Text style={[styles.subGreeting, { color: theme.text + "80" }]}>
            Find the perfect freelancer for your project
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.settingsButton, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate("ClientSettings")}
        >
          <Ionicons name="settings-outline" size={22} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TouchableOpacity
        style={[styles.searchBar, { backgroundColor: theme.card }]}
        // @ts-ignore
        onPress={() => navigation.navigate("Search")}
      >
        <Ionicons name="search" size={20} color={theme.text + "80"} />
        <Text style={[styles.searchText, { color: theme.text + "80" }]}>Search for freelancers or jobs</Text>
      </TouchableOpacity>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statsCard, { backgroundColor: theme.primary }]}>
          <Text style={styles.statsNumber}>2</Text>
          <Text style={styles.statsLabel}>Active Jobs</Text>
        </View>
        <View style={[styles.statsCard, { backgroundColor: theme.secondary }]}>
          <Text style={styles.statsNumber}>20</Text>
          <Text style={styles.statsLabel}>Proposals</Text>
        </View>
        <View style={[styles.statsCard, { backgroundColor: theme.accent }]}>
          <Text style={styles.statsNumber}>5</Text>
          <Text style={styles.statsLabel}>Completed</Text>
        </View>
      </View>

      {/* Active Jobs */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Your Active Jobs</Text>
                    {/* @ts-ignore */}

          <TouchableOpacity onPress={() => navigation.navigate("Projects")}>
            <Text style={[styles.seeAll, { color: theme.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        {jobs && jobs.length > 0 ? (
          jobs.map((job) => (
            <JobCard key={job.id} job={job} onPress={() => navigation.navigate("JobDetails", { jobId: job.id })} />
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: theme.card }]}>
            <MaterialIcons name="work-outline" size={40} color={theme.text + "60"} />
            <Text style={[styles.emptyStateText, { color: theme.text }]}>You don't have any active jobs</Text>
            <TouchableOpacity style={[styles.emptyStateButton, { backgroundColor: theme.primary }]}>
              <Text style={styles.emptyStateButtonText}>Post a Job</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Recommended Freelancers */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recommended Freelancers</Text>
          {/* @ts-ignore */}
          <TouchableOpacity onPress={() => navigation.navigate("Search")}>
            <Text style={[styles.seeAll, { color: theme.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={freelancers}
          renderItem={({ item }) => (
            <FreelancerCard
              freelancer={item}
              onPress={() => navigation.navigate("FreelancerProfile", { freelancerId: item.id })}
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.freelancersContainer}
        />
      </View>

      {/* Recent Activity */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activity</Text>
                    {/* @ts-ignore */}

          <TouchableOpacity onPress={() => navigation.navigate("Notifications")}>
            <Text style={[styles.seeAll, { color: theme.primary }]}>See All</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.activityCard, { backgroundColor: theme.card }]}>
          <View style={styles.activityHeader}>
            <View style={[styles.activityIcon, { backgroundColor: theme.primary + "20" }]}>
              <Ionicons name="person-outline" size={20} color={theme.primary} />
            </View>
            <View style={styles.activityInfo}>
              <Text style={[styles.activityTitle, { color: theme.text }]}>New Proposal Received</Text>
              <Text style={[styles.activityTime, { color: theme.text + "80" }]}>2 hours ago</Text>
            </View>
          </View>
          <Text style={[styles.activityDescription, { color: theme.text }]}>
            Jane Smith has submitted a proposal for your "React Native Developer" job.
          </Text>
        </View>

        <View style={[styles.activityCard, { backgroundColor: theme.card }]}>
          <View style={styles.activityHeader}>
            <View style={[styles.activityIcon, { backgroundColor: theme.secondary + "20" }]}>
              <Ionicons name="chatbubble-outline" size={20} color={theme.secondary} />
            </View>
            <View style={styles.activityInfo}>
              <Text style={[styles.activityTitle, { color: theme.text }]}>New Message</Text>
              <Text style={[styles.activityTime, { color: theme.text + "80" }]}>5 hours ago</Text>
            </View>
          </View>
          <Text style={[styles.activityDescription, { color: theme.text }]}>
            Mike Johnson sent you a message about the UI/UX project.
          </Text>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  greeting: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
  },
  subGreeting: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  searchText: {
    marginLeft: 10,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statsCard: {
    width: "31%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  statsNumber: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  statsLabel: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  seeAll: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  emptyState: {
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginVertical: 10,
    textAlign: "center",
  },
  emptyStateButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  emptyStateButtonText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },
  freelancersContainer: {
    paddingRight: 16,
  },
  activityCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  activityTime: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  activityDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 20,
  },
})

export default ClientDashboardScreen
