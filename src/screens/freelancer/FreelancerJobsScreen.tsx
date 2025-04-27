"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"
import type { FreelancerStackParamList } from "../../navigation/FreelancerNavigator"
import { useQuery } from "@tanstack/react-query"
import withAuth from "@/src/hoc/withAuth"

type FreelancerJobsScreenNavigationProp = StackNavigationProp<FreelancerStackParamList>

// Mock data fetching function
const fetchJobs = async (searchQuery: string = "", filter: string = "all") => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const allJobs = [
    {
      id: "1",
      title: "React Native Developer Needed",
      client: {
        id: "c1",
        name: "John Smith",
        avatar: "https://ui-avatars.com/api/?name=John+Smith",
        rating: 4.8,
      },
      budget: 1500,
      deadline: "2023-12-15",
      description: "Looking for an experienced React Native developer to build a mobile app.",
      skills: ["React Native", "JavaScript", "TypeScript"],
      postedAt: "2023-11-20",
      category: "Mobile Development",
    },
    {
      id: "2",
      title: "Mobile App UI/UX Designer",
      client: {
        id: "c2",
        name: "Sarah Johnson",
        avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson",
        rating: 4.9,
      },
      budget: 2000,
      deadline: "2023-12-20",
      description: "Need a talented designer to create UI/UX for a mobile application.",
      skills: ["UI/UX", "Figma", "Mobile Design"],
      postedAt: "2023-11-22",
      category: "Design",
    },
    {
      id: "3",
      title: "Expo Developer for Quick Project",
      client: {
        id: "c3",
        name: "Mike Brown",
        avatar: "https://ui-avatars.com/api/?name=Mike+Brown",
        rating: 4.7,
      },
      budget: 800,
      deadline: "2023-12-10",
      description: "Looking for an Expo developer for a small project. Quick turnaround needed.",
      skills: ["Expo", "React Native", "JavaScript"],
      postedAt: "2023-11-23",
      category: "Mobile Development",
    },
    {
      id: "4",
      title: "Backend Developer for API Development",
      client: {
        id: "c4",
        name: "Tech Solutions Inc.",
        avatar: "https://ui-avatars.com/api/?name=Tech+Solutions",
        rating: 4.6,
      },
      budget: 3000,
      deadline: "2023-12-25",
      description: "Need a backend developer to create RESTful APIs for our mobile application.",
      skills: ["Node.js", "Express", "MongoDB", "API Development"],
      postedAt: "2023-11-24",
      category: "Backend Development",
    },
    {
      id: "5",
      title: "Full Stack Developer for E-commerce Site",
      client: {
        id: "c5",
        name: "Digital Retail Co.",
        avatar: "https://ui-avatars.com/api/?name=Digital+Retail",
        rating: 4.5,
      },
      budget: 4000,
      deadline: "2024-01-15",
      description: "Looking for a full stack developer to build an e-commerce website with payment integration.",
      skills: ["React", "Node.js", "MongoDB", "Payment Integration"],
      postedAt: "2023-11-25",
      category: "Full Stack Development",
    },
  ]

  // Filter jobs based on search query
  let filteredJobs = allJobs
  if (searchQuery) {
    filteredJobs = allJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }

  // Apply category filter
  if (filter !== "all") {
    filteredJobs = filteredJobs.filter((job) => job.category.toLowerCase() === filter.toLowerCase())
  }

  return filteredJobs
}

const FreelancerJobsScreen = () => {
  const navigation = useNavigation<FreelancerJobsScreenNavigationProp>()
  const { theme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [refreshing, setRefreshing] = useState(false)

  const {
    data: jobs,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["jobs", searchQuery, activeFilter],
    queryFn: () => fetchJobs(searchQuery, activeFilter),
  })

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  const renderJobItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.jobCard, { backgroundColor: theme.card }]}
      onPress={() => navigation.navigate("JobDetails", { jobId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.jobHeader}>
        <Text style={[styles.jobTitle, { color: theme.text }]}>{item.title}</Text>
        <Text style={[styles.jobBudget, { color: theme.secondary }]}>${item.budget}</Text>
      </View>

      <View style={styles.clientRow}>
        <TouchableOpacity
          style={styles.clientInfo}
          onPress={() => navigation.navigate("ClientProfile", { clientId: item.client.id })}
        >
          <Image source={{ uri: item.client.avatar }} style={styles.clientAvatar} />
          <Text style={[styles.clientName, { color: theme.text + "80" }]}>{item.client.name}</Text>
        </TouchableOpacity>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={[styles.ratingText, { color: theme.text }]}>{item.client.rating}</Text>
        </View>
      </View>

      <Text style={[styles.jobDescription, { color: theme.text + "80" }]} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.skillsContainer}>
        {item.skills.map((skill: string, index: number) => (
          <View key={index} style={[styles.skillBadge, { backgroundColor: theme.secondary + "20" }]}>
            <Text style={[styles.skillText, { color: theme.secondary }]}>{skill}</Text>
          </View>
        ))}
      </View>

      <View style={styles.jobFooter}>
        <View style={styles.jobDetail}>
          <Ionicons name="time-outline" size={14} color={theme.text + "80"} />
          <Text style={[styles.jobDetailText, { color: theme.text + "80" }]}>
            Posted {new Date(item.postedAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.jobDetail}>
          <Ionicons name="calendar-outline" size={14} color={theme.text + "80"} />
          <Text style={[styles.jobDetailText, { color: theme.text + "80" }]}>
            Due {new Date(item.deadline).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const filterOptions = [
    { id: "all", label: "All Jobs" },
    { id: "mobile", label: "Mobile Development" },
    { id: "design", label: "Design" },
    { id: "backend", label: "Backend" },
    { id: "full stack", label: "Full Stack" },
  ]

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Find Jobs</Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <Ionicons name="search" size={20} color={theme.text + "80"} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search for jobs..."
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
        <ScrollableFilters
          options={filterOptions}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          theme={theme}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.secondary} />
        </View>
      ) : jobs && jobs.length > 0 ? (
        <FlatList
          data={jobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.jobsList}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.secondary]} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={50} color={theme.text + "40"} />
          <Text style={[styles.emptyText, { color: theme.text }]}>No jobs found</Text>
          <Text style={[styles.emptySubtext, { color: theme.text + "80" }]}>
            Try adjusting your search or filters
          </Text>
        </View>
      )}
    </View>
  )
}

interface ScrollableFiltersProps {
  options: Array<{ id: string; label: string }>
  activeFilter: string
  onFilterChange: (filter: string) => void
  theme: any
}

const ScrollableFilters: React.FC<ScrollableFiltersProps> = ({ options, activeFilter, onFilterChange, theme }) => {
  return (
    <FlatList
      data={options}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.filtersList}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.filterItem,
            {
              backgroundColor: activeFilter === item.id ? theme.secondary : theme.card,
            },
          ]}
          onPress={() => onFilterChange(item.id)}
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
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
  jobBudget: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  clientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  clientInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  clientAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  clientName: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
    marginLeft: 3,
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
})

export default withAuth(FreelancerJobsScreen)
