"use client"

import { useEffect, useState } from "react"
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
import { baseUrl } from "@/src/config/baseUrl"
import { fetcher } from "@/src/components/common/AutoHelper"
import { useAuth } from "@/src/contexts/AuthContext"

const fetchProjects = async (id: string | undefined, token: string | null | undefined) => {
  try {
    const { data, error } = await fetcher(
      `${baseUrl}/freelancers/active-jobs/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (error) throw new Error(error);

    return data;
  } catch (error) {
    console.error("Error fetching company profile:", error);
    throw error;
  }
}

const FreelancerProjectsScreen = () => {
  const navigation = useNavigation()
  const { theme } = useTheme()
  const [activeFilter, setActiveFilter] = useState("all")
  const [refreshing, setRefreshing] = useState(false)
  const [filteredProjects, setFilteredProjects] = useState<any[]>([]);
  const { token, user } = useAuth();
  const {
    data: projects,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["projects", activeFilter],
    queryFn: () => fetchProjects(user?.id, token),
  })

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return theme.secondary
      case "completed":
        return "#10B981"
      case "pending":
        return theme.primary
      default:
        return theme.text
    }
  }


  useEffect(() => {
    if (projects?.jobs) {
      if (activeFilter === "all") {
        setFilteredProjects(projects.jobs);
      } else {
        setFilteredProjects(
          projects.jobs.filter((job: any) => job.status === activeFilter)
        );
      }
    }
  }, [activeFilter, projects?.jobs]);

  const renderProjectItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.projectCard, { backgroundColor: theme.card }]}
      activeOpacity={0.7}
      // In a real app, you would navigate to a project details screen
      // onPress={() => navigation.navigate("ProjectDetails", { projectId: item.id })}
    >
      <View style={styles.projectHeader}>
        <View style={styles.clientInfo}>
          <Image source={{ uri: item.client.profile_picture || 'https://i.pinimg.com/736x/ed/1f/41/ed1f41959e7e9aa7fb0a18b76c6c2755.jpg' }} style={styles.clientAvatar} />
          <View>
            <Text style={[styles.projectTitle, { color: theme.text }]}>{item.contractable?.post?.title || 'N/A'}</Text>
            <Text style={[styles.clientName, { color: theme.text + "80" }]}>{item.client.username.charAt(0).toUpperCase() + item.client.username.slice(1)}</Text>
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
        {item.contractable.system.toUpperCase()}
      </Text>

      {/* {item.status !== "not started" && (
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
              {item.progress} %
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
      )} */}

      <View style={styles.projectFooter}>
        <View style={styles.projectDetail}>
          <Ionicons name="calendar-outline" size={16} color={theme.text} />
          <Text style={[styles.detailText, { color: theme.text }]}>
            Due: {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.projectDetail}>
          <Ionicons name="cash-outline" size={16} color={theme.text} />
          <Text style={[styles.detailText, { color: theme.text }]}>Rp {item.contractable?.post?.price || 0}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  const filterOptions = [
    { id: "all", label: "All Projects" },
    { id: "active", label: "Active" },
    { id: "completed", label: "Completed" },
    { id: "terminated", label: "Terminated" },
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
      ) : filteredProjects && filteredProjects?.length > 0 ? (
        <FlatList
          data={filteredProjects}
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
