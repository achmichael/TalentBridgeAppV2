"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"
import type { ClientStackParamList } from "../../navigation/ClientNavigator"
import { useQuery } from "@tanstack/react-query"
import withAuth from "@/src/hoc/withAuth"

type ClientProjectsScreenNavigationProp = StackNavigationProp<ClientStackParamList>

// Mock data fetching function
const fetchProjects = async (filter = "all") => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const allProjects = [
    {
      id: "1",
      title: "E-commerce Website Redesign",
      freelancer: {
        id: "f1",
        name: "John Doe",
        avatar: "https://ui-avatars.com/api/?name=John+Doe",
        rating: 4.8,
      },
      budget: 2500,
      deadline: "2023-12-30",
      progress: 65,
      status: "in progress",
      description: "Redesigning the UI/UX of an e-commerce website to improve user experience and conversion rates.",
      startDate: "2023-10-15",
    },
    {
      id: "2",
      title: "Mobile App Development",
      freelancer: {
        id: "f2",
        name: "Jane Smith",
        avatar: "https://ui-avatars.com/api/?name=Jane+Smith",
        rating: 4.9,
      },
      budget: 5000,
      deadline: "2024-01-15",
      progress: 40,
      status: "in progress",
      description: "Developing a cross-platform mobile app for both iOS and Android using React Native.",
      startDate: "2023-11-01",
    },
    {
      id: "3",
      title: "Content Writing for Blog",
      freelancer: {
        id: "f3",
        name: "Sarah Williams",
        avatar: "https://ui-avatars.com/api/?name=Sarah+Williams",
        rating: 4.6,
      },
      budget: 800,
      deadline: "2023-11-30",
      progress: 100,
      status: "completed",
      description: "Writing 10 SEO-optimized blog posts for a company website.",
      startDate: "2023-10-01",
      completedDate: "2023-11-15",
    },
    {
      id: "4",
      title: "Logo Design",
      freelancer: {
        id: "f4",
        name: "Emily Davis",
        avatar: "https://ui-avatars.com/api/?name=Emily+Davis",
        rating: 4.8,
      },
      budget: 500,
      deadline: "2023-11-15",
      progress: 100,
      status: "completed",
      description: "Designing a modern logo for a new startup company.",
      startDate: "2023-10-20",
      completedDate: "2023-11-10",
    },
    {
      id: "5",
      title: "SEO Optimization",
      freelancer: {
        id: "f5",
        name: "David Brown",
        avatar: "https://ui-avatars.com/api/?name=David+Brown",
        rating: 4.5,
      },
      budget: 1200,
      deadline: "2023-12-15",
      progress: 0,
      status: "not started",
      description: "Optimizing website content and structure for better search engine rankings.",
      startDate: "2023-12-01",
    },
  ]

  // Apply status filter
  if (filter !== "all") {
    return allProjects.filter((project) => project.status === filter)
  }

  return allProjects
}

const ClientProjectsScreen = () => {
  const navigation = useNavigation<ClientProjectsScreenNavigationProp>()
  const { theme } = useTheme()
  const [activeFilter, setActiveFilter] = useState("all")
  const [refreshing, setRefreshing] = useState(false)

  const {
    data: projects,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["clientProjects", activeFilter],
    queryFn: () => fetchProjects(activeFilter),
  })

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in progress":
        return theme.primary
      case "completed":
        return "#10B981" // Green
      case "not started":
        return "#F59E0B" // Amber
      default:
        return theme.text
    }
  }

  const renderProjectItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.projectCard, { backgroundColor: theme.card }]}
      activeOpacity={0.7}
      // In a real app, you would navigate to a project details screen
      // onPress={() => navigation.navigate("ProjectDetails", { projectId: item.id })}
    >
      <View style={styles.projectHeader}>
        <Text style={[styles.projectTitle, { color: theme.text }]}>{item.title}</Text>
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

      <TouchableOpacity
        style={styles.freelancerInfo}
        onPress={() => navigation.navigate("FreelancerProfile", { freelancerId: item.freelancer.id })}
      >
        <Image source={{ uri: item.freelancer.avatar }} style={styles.freelancerAvatar} />
        <View>
          <Text style={[styles.freelancerName, { color: theme.text }]}>{item.freelancer.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={[styles.ratingText, { color: theme.text }]}>{item.freelancer.rating}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <Text style={[styles.projectDescription, { color: theme.text + "80" }]} numberOfLines={2}>
        {item.description}
      </Text>

      {item.status !== "not started" && (
        <View style={styles.progressContainer}>
          <View style={styles.progressLabels}>
            <Text style={[styles.progressLabel, { color: theme.text }]}>Progress</Text>
            <Text
              style={[
                styles.progressPercentage,
                {
                  color: getStatusColor(item.status),
                },
              ]}
            >
              {item.progress}%
            </Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: getStatusColor(item.status),
                  width: `${item.progress}%`,
                },
              ]}
            />
          </View>
        </View>
      )}

      <View style={styles.projectFooter}>
        <View style={styles.projectDetail}>
          <Ionicons name="calendar-outline" size={16} color={theme.text} />
          <Text style={[styles.detailText, { color: theme.text }]}>
            Due: {new Date(item.deadline).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.projectDetail}>
          <Ionicons name="cash-outline" size={16} color={theme.text} />
          <Text style={[styles.detailText, { color: theme.text }]}>${item.budget}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const filterOptions = [
    { id: "all", label: "All Projects" },
    { id: "in progress", label: "In Progress" },
    { id: "completed", label: "Completed" },
    { id: "not started", label: "Not Started" },
  ]

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>My Projects</Text>
        <TouchableOpacity style={[styles.createButton, { backgroundColor: theme.primary }]}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.createButtonText}>New Project</Text>
        </TouchableOpacity>
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
                  backgroundColor: activeFilter === item.id ? theme.primary : theme.card,
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : projects && projects.length > 0 ? (
        <FlatList
          data={projects}
          renderItem={renderProjectItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.projectsList}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="briefcase-outline" size={50} color={theme.text + "40"} />
          <Text style={[styles.emptyText, { color: theme.text }]}>No projects found</Text>
          <Text style={[styles.emptySubtext, { color: theme.text + "80" }]}>
            {activeFilter === "all" ? "You don't have any projects yet" : `You don't have any ${activeFilter} projects`}
          </Text>
          <TouchableOpacity style={[styles.emptyButton, { backgroundColor: theme.primary }]}>
            <Text style={styles.emptyButtonText}>Create a Project</Text>
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
  projectsList: {
    padding: 16,
    paddingTop: 0,
  },
  projectCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  projectTitle: {
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
  freelancerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  freelancerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  freelancerName: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginLeft: 4,
  },
  projectDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 12,
    lineHeight: 20,
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  progressPercentage: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  projectFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  projectDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 14,
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

export default withAuth(ClientProjectsScreen)
