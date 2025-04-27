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
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"
import { useQuery } from "@tanstack/react-query"
import withAuth from "@/src/hoc/withAuth"

// Mock data fetching function
const fetchProjects = async (filter = "all") => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const allProjects = [
    {
      id: "1",
      title: "E-commerce Mobile App",
      client: {
        id: "c1",
        name: "Tech Solutions Inc.",
        avatar: "https://ui-avatars.com/api/?name=Tech+Solutions",
      },
      progress: 65,
      dueDate: "2023-12-30",
      payment: 3500,
      status: "in progress",
      description: "Building a full-featured e-commerce mobile app with payment integration and user authentication.",
      startDate: "2023-10-15",
    },
    {
      id: "2",
      title: "Social Media Dashboard",
      client: {
        id: "c2",
        name: "Digital Marketing Co.",
        avatar: "https://ui-avatars.com/api/?name=Digital+Marketing",
      },
      progress: 40,
      dueDate: "2024-01-15",
      payment: 2800,
      status: "in progress",
      description: "Creating a dashboard to monitor and analyze social media performance across multiple platforms.",
      startDate: "2023-11-01",
    },
    {
      id: "3",
      title: "Portfolio Website Redesign",
      client: {
        id: "c3",
        name: "Jane Smith",
        avatar: "https://ui-avatars.com/api/?name=Jane+Smith",
      },
      progress: 100,
      dueDate: "2023-11-15",
      payment: 1200,
      status: "completed",
      description: "Redesigned a personal portfolio website with modern UI/UX and responsive design.",
      startDate: "2023-10-01",
    },
    {
      id: "4",
      title: "Fitness Tracking App",
      client: {
        id: "c4",
        name: "Health & Wellness Co.",
        avatar: "https://ui-avatars.com/api/?name=Health+Wellness",
      },
      progress: 100,
      dueDate: "2023-10-30",
      payment: 4000,
      status: "completed",
      description: "Developed a fitness tracking app with workout plans, progress tracking, and social features.",
      startDate: "2023-08-15",
    },
    {
      id: "5",
      title: "Restaurant Ordering System",
      client: {
        id: "c5",
        name: "Gourmet Dining",
        avatar: "https://ui-avatars.com/api/?name=Gourmet+Dining",
      },
      progress: 0,
      dueDate: "2024-02-28",
      payment: 5000,
      status: "not started",
      description: "Creating an online ordering system for a restaurant chain with multiple locations.",
      startDate: "2023-12-01",
    },
  ]

  // Apply status filter
  if (filter !== "all") {
    return allProjects.filter((project) => project.status === filter)
  }

  return allProjects
}

const FreelancerProjectsScreen = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const [activeFilter, setActiveFilter] = useState("all")
  const [refreshing, setRefreshing] = useState(false)

  const {
    data: projects,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["projects", activeFilter],
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
        return theme.secondary
      case "completed":
        return "#10B981" // Green
      case "not started":
        return theme.primary
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
        <View style={styles.clientInfo}>
          <Image source={{ uri: item.client.avatar }} style={styles.clientAvatar} />
          <View>
            <Text style={[styles.projectTitle, { color: theme.text }]}>{item.title}</Text>
            <Text style={[styles.clientName, { color: theme.text + "80" }]}>{item.client.name}</Text>
          </View>
        </View>
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
            Due: {new Date(item.dueDate).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.projectDetail}>
          <Ionicons name="cash-outline" size={16} color={theme.text} />
          <Text style={[styles.detailText, { color: theme.text }]}>${item.payment}</Text>
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
                  backgroundColor: activeFilter === item.id ? theme.secondary : theme.card,
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
          <ActivityIndicator size="large" color={theme.secondary} />
        </View>
      ) : projects && projects.length > 0 ? (
        <FlatList
          data={projects}
          renderItem={renderProjectItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.projectsList}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.secondary]} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="briefcase-outline" size={50} color={theme.text + "40"} />
          <Text style={[styles.emptyText, { color: theme.text }]}>No projects found</Text>
          <Text style={[styles.emptySubtext, { color: theme.text + "80" }]}>
            {activeFilter === "all" ? "You don't have any projects yet" : `You don't have any ${activeFilter} projects`}
          </Text>
          <TouchableOpacity
            style={[styles.emptyButton, { backgroundColor: theme.secondary }]}
            onPress={() => navigation.navigate("Jobs" as never)}
          >
            <Text style={styles.emptyButtonText}>Find Jobs</Text>
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
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
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
    marginBottom: 10,
  },
  clientInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  clientAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  projectTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  clientName: {
    fontSize: 14,
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
  projectDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 15,
    lineHeight: 20,
  },
  progressContainer: {
    marginBottom: 15,
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

export default withAuth(FreelancerProjectsScreen)
