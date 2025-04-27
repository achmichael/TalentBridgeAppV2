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
import type { ClientStackParamList } from "../../navigation/ClientNavigator"
import { useQuery } from "@tanstack/react-query"
import withAuth from "@/src/hoc/withAuth"

type ClientProfileScreenNavigationProp = StackNavigationProp<ClientStackParamList>

// Mock data fetching function
const fetchProfileData = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return {
    id: "1",
    name: "Alex Johnson",
    title: "Project Manager",
    avatar: "https://ui-avatars.com/api/?name=Alex+Johnson&background=random",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    location: "New York, USA",
    memberSince: "2021-05-15",
    bio: "Experienced project manager with a passion for finding the best talent for my projects. I specialize in web and mobile application development.",
    stats: {
      projectsPosted: 15,
      activeProjects: 3,
      completedProjects: 12,
      totalSpent: 25000,
    },
    recentProjects: [
      {
        id: "p1",
        title: "E-commerce Website Redesign",
        freelancer: {
          id: "f1",
          name: "John Doe",
          avatar: "https://ui-avatars.com/api/?name=John+Doe",
        },
        status: "in progress",
        budget: 2500,
      },
      {
        id: "p2",
        title: "Mobile App Development",
        freelancer: {
          id: "f2",
          name: "Jane Smith",
          avatar: "https://ui-avatars.com/api/?name=Jane+Smith",
        },
        status: "in progress",
        budget: 5000,
      },
      {
        id: "p3",
        title: "Content Writing for Blog",
        freelancer: {
          id: "f3",
          name: "Sarah Williams",
          avatar: "https://ui-avatars.com/api/?name=Sarah+Williams",
        },
        status: "completed",
        budget: 800,
      },
    ],
    favoriteFreelancers: [
      {
        id: "f1",
        name: "John Doe",
        title: "Full Stack Developer",
        avatar: "https://ui-avatars.com/api/?name=John+Doe",
        rating: 4.8,
      },
      {
        id: "f2",
        name: "Jane Smith",
        title: "UI/UX Designer",
        avatar: "https://ui-avatars.com/api/?name=Jane+Smith",
        rating: 4.9,
      },
      {
        id: "f3",
        name: "Sarah Williams",
        title: "Content Writer",
        avatar: "https://ui-avatars.com/api/?name=Sarah+Williams",
        rating: 4.6,
      },
    ],
  }
}

const ClientProfileScreen = () => {
  const navigation = useNavigation<ClientProfileScreenNavigationProp>()
  const { theme } = useTheme()
  const { signOut } = useAuth()
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const { data: profile, refetch } = useQuery({
    queryKey: ["clientProfile"],
    queryFn: fetchProfileData,
  })

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  if (!profile) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </View>
    )
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.settingsButton, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate("ClientSettings")}
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

        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color={theme.text + "80"} />
          <Text style={[styles.locationText, { color: theme.text + "80" }]}>{profile.location}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.statItem, { backgroundColor: theme.card }]}>
            <Text style={[styles.statValue, { color: theme.text }]}>{profile.stats.activeProjects}</Text>
            <Text style={[styles.statLabel, { color: theme.text + "80" }]}>Active</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: theme.card }]}>
            <Text style={[styles.statValue, { color: theme.text }]}>{profile.stats.completedProjects}</Text>
            <Text style={[styles.statLabel, { color: theme.text + "80" }]}>Completed</Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: theme.card }]}>
            <Text style={[styles.statValue, { color: theme.text }]}>${profile.stats.totalSpent / 1000}k</Text>
            <Text style={[styles.statLabel, { color: theme.text + "80" }]}>Spent</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.editButton, { backgroundColor: theme.primary }]}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.shareButton, { borderColor: theme.primary }]}>
            <Ionicons name="share-social-outline" size={20} color={theme.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "overview" && { borderBottomColor: theme.primary, borderBottomWidth: 2 },
          ]}
          onPress={() => setActiveTab("overview")}
        >
          <Text style={[styles.tabButtonText, { color: activeTab === "overview" ? theme.primary : theme.text + "80" }]}>
            Overview
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "projects" && { borderBottomColor: theme.primary, borderBottomWidth: 2 },
          ]}
          onPress={() => setActiveTab("projects")}
        >
          <Text style={[styles.tabButtonText, { color: activeTab === "projects" ? theme.primary : theme.text + "80" }]}>
            Projects
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "favorites" && { borderBottomColor: theme.primary, borderBottomWidth: 2 },
          ]}
          onPress={() => setActiveTab("favorites")}
        >
          <Text
            style={[styles.tabButtonText, { color: activeTab === "favorites" ? theme.primary : theme.text + "80" }]}
          >
            Favorites
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "overview" && (
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>About Me</Text>
          <Text style={[styles.bioText, { color: theme.text + "80" }]}>{profile.bio}</Text>

          <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 20 }]}>Contact Information</Text>
          <View style={styles.contactInfo}>
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={20} color={theme.primary} />
              <Text style={[styles.contactText, { color: theme.text }]}>{profile.email}</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="call-outline" size={20} color={theme.primary} />
              <Text style={[styles.contactText, { color: theme.text }]}>{profile.phone}</Text>
            </View>
            <View style={styles.contactItem}>
              <Ionicons name="location-outline" size={20} color={theme.primary} />
              <Text style={[styles.contactText, { color: theme.text }]}>{profile.location}</Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { color: theme.text, marginTop: 20 }]}>Recent Projects</Text>
          {profile.recentProjects.map((project) => (
            <View key={project.id} style={[styles.projectItem, { backgroundColor: theme.card }]}>
              <View style={styles.projectHeader}>
                <Text style={[styles.projectTitle, { color: theme.text }]}>{project.title}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: project.status === "in progress" ? theme.primary + "20" : "#10B981" + "20",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: project.status === "in progress" ? theme.primary : "#10B981",
                      },
                    ]}
                  >
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </Text>
                </View>
              </View>
              <View style={styles.projectDetails}>
                <TouchableOpacity
                  style={styles.freelancerInfo}
                  onPress={() => navigation.navigate("FreelancerProfile", { freelancerId: project.freelancer.id })}
                >
                  <Image source={{ uri: project.freelancer.avatar }} style={styles.freelancerAvatar} />
                  <Text style={[styles.freelancerName, { color: theme.text + "80" }]}>{project.freelancer.name}</Text>
                </TouchableOpacity>
                <View style={styles.projectBudget}>
                  <Ionicons name="cash-outline" size={16} color={theme.text + "80"} />
                  <Text style={[styles.budgetText, { color: theme.text + "80" }]}>${project.budget}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      )}

      {activeTab === "projects" && (
        <View style={styles.sectionContainer}>
          <View style={styles.projectsHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>My Projects</Text>
            <TouchableOpacity
              style={[styles.viewAllButton, { borderColor: theme.primary }]}
              // @ts-ignore
              onPress={() => navigation.navigate("Projects")}
            >
              <Text style={[styles.viewAllText, { color: theme.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>

          {profile.recentProjects.map((project) => (
            <View key={project.id} style={[styles.projectItem, { backgroundColor: theme.card }]}>
              <View style={styles.projectHeader}>
                <Text style={[styles.projectTitle, { color: theme.text }]}>{project.title}</Text>
                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor: project.status === "in progress" ? theme.primary + "20" : "#10B981" + "20",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: project.status === "in progress" ? theme.primary : "#10B981",
                      },
                    ]}
                  >
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </Text>
                </View>
              </View>
              <View style={styles.projectDetails}>
                <TouchableOpacity
                  style={styles.freelancerInfo}
                  onPress={() => navigation.navigate("FreelancerProfile", { freelancerId: project.freelancer.id })}
                >
                  <Image source={{ uri: project.freelancer.avatar }} style={styles.freelancerAvatar} />
                  <Text style={[styles.freelancerName, { color: theme.text + "80" }]}>{project.freelancer.name}</Text>
                </TouchableOpacity>
                <View style={styles.projectBudget}>
                  <Ionicons name="cash-outline" size={16} color={theme.text + "80"} />
                  <Text style={[styles.budgetText, { color: theme.text + "80" }]}>${project.budget}</Text>
                </View>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.createProjectButton, { backgroundColor: theme.primary }]}
            // @ts-ignore
            onPress={() => navigation.navigate("Projects")}
          >
            <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.createProjectText}>Create New Project</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === "favorites" && (
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Favorite Freelancers</Text>

          {profile.favoriteFreelancers.map((freelancer) => (
            <TouchableOpacity
              key={freelancer.id}
              style={[styles.freelancerCard, { backgroundColor: theme.card }]}
              onPress={() => navigation.navigate("FreelancerProfile", { freelancerId: freelancer.id })}
            >
              <Image source={{ uri: freelancer.avatar }} style={styles.favoriteAvatar} />
              <View style={styles.favoriteInfo}>
                <Text style={[styles.favoriteName, { color: theme.text }]}>{freelancer.name}</Text>
                <Text style={[styles.favoriteTitle, { color: theme.text + "80" }]}>{freelancer.title}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={[styles.ratingText, { color: theme.text }]}>{freelancer.rating}</Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.favoriteAction, { backgroundColor: theme.primary + "20" }]}>
                <Ionicons name="heart" size={20} color={theme.primary} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.findMoreButton, { borderColor: theme.primary }]}
            // @ts-ignore
            onPress={() => navigation.navigate("Search")}
          >
            <Text style={[styles.findMoreText, { color: theme.primary }]}>Find More Freelancers</Text>
          </TouchableOpacity>
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
  projectItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
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
  projectDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  freelancerInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  freelancerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  freelancerName: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  projectBudget: {
    flexDirection: "row",
    alignItems: "center",
  },
  budgetText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginLeft: 5,
  },
  projectsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  viewAllText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  createProjectButton: {
    flexDirection: "row",
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  createProjectText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginLeft: 8,
  },
  freelancerCard: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  favoriteAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteName: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginBottom: 2,
  },
  favoriteTitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginLeft: 4,
  },
  favoriteAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  findMoreButton: {
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    marginTop: 16,
  },
  findMoreText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
})

export default withAuth(ClientProfileScreen)
