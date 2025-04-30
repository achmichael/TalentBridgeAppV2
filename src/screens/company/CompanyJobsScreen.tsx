"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"
import type { CompanyStackParamList } from "../../navigation/CompanyNavigator"
import withAuth from "@/src/hoc/withAuth"
import { useDashboard } from "@/src/contexts/Company/DashboardContext"
import LoadingScreen from "../common/LoadingScreen"

type CompanyJobsScreenNavigationProp = StackNavigationProp<CompanyStackParamList>

// Mock data fetching function
const fetchJobs = async (searchQuery = "", filter = "all") => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const allJobs = [
    {
      id: "1",
      title: "Senior React Developer",
      type: "Full-time",
      location: "Remote",
      applicants: 12,
      postedAt: "2023-11-15",
      status: "active",
      description: "We are looking for an experienced React developer to join our team.",
    },
    {
      id: "2",
      title: "Product Designer",
      type: "Full-time",
      location: "New York, USA",
      applicants: 8,
      postedAt: "2023-11-18",
      status: "active",
      description: "Seeking a talented product designer with experience in UI/UX design.",
    },
    {
      id: "3",
      title: "React Native Developer",
      type: "Contract",
      location: "Remote",
      applicants: 5,
      postedAt: "2023-11-20",
      status: "active",
      description: "Looking for a React Native developer for a mobile app project.",
    },
    {
      id: "4",
      title: "Backend Developer",
      type: "Full-time",
      location: "San Francisco, USA",
      applicants: 10,
      postedAt: "2023-11-10",
      status: "closed",
      description: "Seeking a backend developer with experience in Node.js and MongoDB.",
    },
    {
      id: "5",
      title: "DevOps Engineer",
      type: "Full-time",
      location: "Remote",
      applicants: 6,
      postedAt: "2023-11-05",
      status: "closed",
      description: "Looking for a DevOps engineer with experience in AWS and CI/CD pipelines.",
    },
    {
      id: "6",
      title: "UI/UX Designer",
      type: "Part-time",
      location: "Remote",
      applicants: 15,
      postedAt: "2023-11-22",
      status: "draft",
      description: "Seeking a UI/UX designer for a new product design.",
    },
  ]

  // Filter jobs based on search query
  let filteredJobs = allJobs
  if (searchQuery) {
    filteredJobs = allJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  // Apply status filter
  if (filter !== "all") {
    filteredJobs = filteredJobs.filter((job) => job.status === filter)
  }

  return filteredJobs
}

const CompanyJobsScreen = () => {
  const navigation = useNavigation<CompanyJobsScreenNavigationProp>()
  const { theme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [refreshing, setRefreshing] = useState(false)
  const { data, isLoading } = useDashboard();
  const { jobs } = data || {};

  const onRefresh = async () => {
    setRefreshing(true)
    setRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#10B981" // Green
      case "closed":
        return "#EF4444" // Red
      case "draft":
        return "#F59E0B" // Amber
      default:
        return theme.text
    }
  }

  const renderJobItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.jobCard, { backgroundColor: theme.card }]}
      onPress={() => navigation.navigate("JobDetails", { jobId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.jobHeader}>
        <Text style={[styles.jobTitle, { color: theme.text }]}>{item.title}</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: getStatusColor(item.status) + "20",
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: getStatusColor(item.status),
              },
            ]}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <Text style={[styles.jobDescription, { color: theme.text + "80" }]} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.jobDetails}>
        <View style={styles.jobDetail}>
          <Ionicons name="briefcase-outline" size={16} color={theme.text + "80"} />
          <Text style={[styles.jobDetailText, { color: theme.text + "80" }]}>{item.type}</Text>
        </View>

        <View style={styles.jobDetail}>
          <Ionicons name="location-outline" size={16} color={theme.text + "80"} />
          <Text style={[styles.jobDetailText, { color: theme.text + "80" }]}>{item.location}</Text>
        </View>
      </View>

      <View style={styles.jobFooter}>
        <View style={styles.jobDetail}>
          <Ionicons name="people-outline" size={16} color={theme.text + "80"} />
          <Text style={[styles.jobDetailText, { color: theme.text + "80" }]}>{item.applicants} Applicants</Text>
        </View>

        <View style={styles.jobDetail}>
          <Ionicons name="time-outline" size={16} color={theme.text + "80"} />
          <Text style={[styles.jobDetailText, { color: theme.text + "80" }]}>
            Posted {new Date(item.postedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const filterOptions = [
    { id: "all", label: "All Jobs" },
    { id: "active", label: "Active" },
    { id: "closed", label: "Closed" },
    { id: "draft", label: "Draft" },
  ]

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Manage Jobs</Text>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: theme.accent }]}
          onPress={() => navigation.navigate("CreateJob")}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Create Job</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <Ionicons name="search" size={20} color={theme.text + "80"} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search jobs..."
          placeholderTextColor={theme.text + "60"}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={theme.text + "80"} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filtersContainer}>
        <FlatList
          data={filterOptions}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.filtersList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterItem,
                {
                  backgroundColor: activeFilter === item.id ? theme.accent : theme.card,
                },
              ]}
              onPress={() => setActiveFilter(item.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: activeFilter === item.id ? "#FFFFFF" : theme.text,
                  },
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {isLoading ? (
       <LoadingScreen />
      ) : jobs && jobs.length > 0 ? (
        <FlatList
          data={jobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.jobsList}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.accent]} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="briefcase-outline" size={50} color={theme.text + "40"} />
          <Text style={[styles.emptyText, { color: theme.text }]}>No jobs found</Text>
          <Text style={[styles.emptySubtext, { color: theme.text + "80" }]}>
            {activeFilter === "all"
              ? "You haven't posted any jobs yet"
              : `You don't have any ${activeFilter} jobs`}
          </Text>
          <TouchableOpacity
            style={[styles.emptyButton, { backgroundColor: theme.accent }]}
            onPress={() => navigation.navigate("CreateJob")}
          >
            <Text style={styles.emptyButtonText}>Create a Job</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    marginLeft: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 50,
    borderRadius: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersList: {
    paddingHorizontal: 16,
  },
  filterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },
  jobsList: {
    padding: 16,
    paddingTop: 0,
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  jobDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 15,
    lineHeight: 20,
  },
  jobDetails: {
    flexDirection: "row",
    marginBottom: 10,
  },
  jobFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  jobDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  jobDetailText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginLeft: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginTop: 8,
  },
  emptyButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },
})

export default withAuth(CompanyJobsScreen)

