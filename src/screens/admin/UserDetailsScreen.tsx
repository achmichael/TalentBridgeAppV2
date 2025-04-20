"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native"
import { useTheme } from "../../contexts/ThemeContext"
import { useQuery, useMutation } from "react-query"
import { AdminStackParamList } from "@/src/navigation/AdminNavigator"

// Mock API calls
const fetchUserDetails = async (userId: string) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock user data
  return {
    id: userId,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    role: "freelancer",
    status: "active",
    verified: true,
    createdAt: "2023-01-15",
    lastActive: "2023-06-18",
    location: "New York, NY",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    bio: "Experienced full-stack developer with 5+ years of experience in React, Node.js, and cloud technologies.",
    skills: ["React", "Node.js", "TypeScript", "AWS", "MongoDB"],
    completedJobs: 24,
    ongoingJobs: 3,
    totalEarnings: "$45,680",
    rating: 4.8,
    reviewCount: 37,
    reportCount: 0,
    loginHistory: [
      { date: "2023-06-18", ip: "192.168.1.1", device: "iPhone 12, iOS 16.2" },
      { date: "2023-06-15", ip: "192.168.1.1", device: "MacBook Pro, Chrome 114" },
      { date: "2023-06-10", ip: "192.168.0.5", device: "iPhone 12, iOS 16.2" },
    ],
    recentActivity: [
      { type: "job_application", date: "2023-06-17", details: "Applied to Senior React Native Developer position" },
      { type: "profile_update", date: "2023-06-15", details: "Updated portfolio and skills" },
      { type: "job_completed", date: "2023-06-10", details: "Completed E-commerce App project" },
      { type: "review_received", date: "2023-06-10", details: "Received 5-star review from TechCorp Inc." },
      { type: "payment_received", date: "2023-06-10", details: "Received payment of $3,500 for E-commerce App" },
    ],
  }
}

const updateUserStatus = async ({ userId, status }: { userId: string, status: string}) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { success: true }
}

const UserDetailsScreen = () => {
  const { theme } = useTheme()
  const navigation = useNavigation()
  const route = useRoute<RouteProp<AdminStackParamList, 'UserDetails'>>()
  const { userId } = route.params

  const [activeTab, setActiveTab] = useState("profile")
  const [showActionModal, setShowActionModal] = useState(false)

  const { data: user, isLoading, refetch } = useQuery(["userDetails", userId], () => fetchUserDetails(userId))

  const { mutate: updateStatus, isLoading: isUpdating } = useMutation(updateUserStatus, {
    onSuccess: () => {
      refetch()
      Alert.alert("Success", "User status updated successfully")
    },
    onError: () => {
      Alert.alert("Error", "Failed to update user status")
    },
  })

  const handleStatusChange = (newStatus: "active" | "suspended" | "banned") => {
    setShowActionModal(false)

    const statusMessages = {
      active: "This will allow the user to access all platform features.",
      suspended: "This will temporarily prevent the user from accessing the platform.",
      banned: "This will permanently ban the user from the platform. This action cannot be undone easily.",
    }

    Alert.alert(`Confirm ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`, statusMessages[newStatus], [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: () => {
          updateStatus({ userId, status: newStatus })
        },
      },
    ])
  }

  const getRoleColor = (role: string | undefined) => {
    switch (role) {
      case "client":
        return "#4775EA"
      case "freelancer":
        return "#2ECC71"
      case "company":
        return "#F39C12"
      default:
        return theme.textSecondary
    }
  }

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "active":
        return "#2ECC71"
      case "suspended":
        return "#F39C12"
      case "banned":
        return "#E74C3C"
      default:
        return theme.textSecondary
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "job_application":
        return <Ionicons name="briefcase-outline" size={20} color="#3498DB" />
      case "profile_update":
        return <Ionicons name="person-outline" size={20} color="#9B59B6" />
      case "job_completed":
        return <Ionicons name="checkmark-circle-outline" size={20} color="#2ECC71" />
      case "review_received":
        return <Ionicons name="star-outline" size={20} color="#F39C12" />
      case "payment_received":
        return <Ionicons name="card-outline" size={20} color="#1ABC9C" />
      default:
        return <Ionicons name="ellipsis-horizontal" size={20} color={theme.textSecondary} />
    }
  }

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>Loading user details...</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>User Details</Text>
        <TouchableOpacity onPress={() => setShowActionModal(true)}>
          <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.profileHeader, { backgroundColor: theme.cardBackground }]}>
          <Image source={{ uri: user?.avatar }} style={styles.avatar} />

          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.text }]}>{user?.name}</Text>

            <View style={styles.userMeta}>
              <View style={[styles.roleContainer, { backgroundColor: getRoleColor(user?.role) + "20" }]}>
                {user?.role && (
                    <Text style={[styles.roleText, { color: getRoleColor(user?.role) }]}>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </Text>
                )}
              </View>

              <View style={[styles.statusContainer, { backgroundColor: getStatusColor(user?.status) + "20" }]}>
                {user?.status && (
                    <Text style={[styles.statusText, { color: getStatusColor(user?.status) }]}>
                    {user?.status.charAt(0).toUpperCase() + user?.status.slice(1)}
                </Text>
                )}
              </View>

              {user?.verified && (
                <View style={[styles.verifiedContainer, { backgroundColor: "#3498DB20" }]}>
                  <Ionicons name="checkmark-circle" size={12} color="#3498DB" />
                  <Text style={[styles.verifiedText, { color: "#3498DB" }]}>Verified</Text>
                </View>
              )}
            </View>

            <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{user?.email}</Text>
            <Text style={[styles.userLocation, { color: theme.textSecondary }]}>{user?.location}</Text>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "profile" && { borderBottomColor: theme.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab("profile")}
          >
            <Text style={[styles.tabText, { color: activeTab === "profile" ? theme.primary : theme.textSecondary }]}>
              Profile
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "activity" && { borderBottomColor: theme.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab("activity")}
          >
            <Text style={[styles.tabText, { color: activeTab === "activity" ? theme.primary : theme.textSecondary }]}>
              Activity
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "security" && { borderBottomColor: theme.primary, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab("security")}
          >
            <Text style={[styles.tabText, { color: activeTab === "security" ? theme.primary : theme.textSecondary }]}>
              Security
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "profile" && (
          <View style={styles.tabContent}>
            <View style={[styles.sectionCard, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Bio</Text>
              <Text style={[styles.bioText, { color: theme.text }]}>{user?.bio}</Text>
            </View>

            <View style={[styles.sectionCard, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Skills</Text>
              <View style={styles.skillsContainer}>
                {user?.skills.map((skill, index) => (
                  <View key={index} style={[styles.skillBadge, { backgroundColor: theme.primary + "20" }]}>
                    <Text style={[styles.skillText, { color: theme.primary }]}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={[styles.sectionCard, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Stats</Text>
              <View style={styles.statsContainer}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.text }]}>{user?.completedJobs}</Text>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Completed Jobs</Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.text }]}>{user?.ongoingJobs}</Text>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Ongoing Jobs</Text>
                </View>

                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: theme.text }]}>{user?.totalEarnings}</Text>
                  <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Earnings</Text>
                </View>
              </View>
            </View>

            <View style={[styles.sectionCard, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Ratings & Reviews</Text>
              <View style={styles.ratingContainer}>
                <View style={styles.ratingStars}>
                  <Text style={[styles.ratingValue, { color: theme.text }]}>{user?.rating}</Text>
                  {user?.rating && (
                    <View style={styles.starsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons
                        key={star}
                        name={
                          star <= Math.floor(user.rating) ? "star" : star <= user.rating ? "star-half" : "star-outline"
                        }
                        size={16}
                        color="#F39C12"
                      />
                    ))}
                  </View>
                  )}
                </View>
                <Text style={[styles.reviewCount, { color: theme.textSecondary }]}>
                  Based on {user?.reviewCount} reviews
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.viewButton, { borderColor: theme.primary }]}
                onPress={() => {
                  // Navigate to reviews
                  Alert.alert("View Reviews", "Navigate to reviews screen")
                }}
              >
                <Text style={[styles.viewButtonText, { color: theme.primary }]}>View All Reviews</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.sectionCard, { backgroundColor: theme.cardBackground }]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>Account Information</Text>
                <TouchableOpacity
                  style={[styles.editButton, { backgroundColor: theme.primary }]}
                  onPress={() => {
                    // Edit user
                    Alert.alert("Edit User", "Edit user functionality would go here")
                  }}
                >
                  <Text style={styles.editButtonText}>Edit</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Member Since</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Not Available"}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Last Active</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>
                  {user?.lastActive ? new Date(user.lastActive).toLocaleDateString() : "Not Available"}
                </Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Phone</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>{user?.phone}</Text>
              </View>

              <View style={styles.infoItem}>
                <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>Reports</Text>
                <Text style={[styles.infoValue, { color: theme.text }]}>{user?.reportCount}</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === "activity" && (
          <View style={styles.tabContent}>
            <View style={[styles.sectionCard, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activity</Text>

              {user?.recentActivity.map((activity, index) => (
                <View
                  key={index}
                  style={[
                    styles.activityItem,
                    index < user.recentActivity.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: theme.border,
                    },
                  ]}
                >
                  <View style={styles.activityIcon}>{getActivityIcon(activity.type)}</View>
                  <View style={styles.activityContent}>
                    <Text style={[styles.activityDetails, { color: theme.text }]}>{activity.details}</Text>
                    <Text style={[styles.activityDate, { color: theme.textSecondary }]}>
                      {new Date(activity.date).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))}

              <TouchableOpacity
                style={[styles.viewButton, { borderColor: theme.primary }]}
                onPress={() => {
                  // View all activity
                  Alert.alert("View Activity", "View all activity functionality would go here")
                }}
              >
                <Text style={[styles.viewButtonText, { color: theme.primary }]}>View All Activity</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.sectionCard, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Jobs</Text>

              <TouchableOpacity
                style={[styles.viewButton, { borderColor: theme.primary }]}
                onPress={() => {
                  // View user jobs
                  Alert.alert("View Jobs", "View user jobs functionality would go here")
                }}
              >
                <Text style={[styles.viewButtonText, { color: theme.primary }]}>View User's Jobs</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {activeTab === "security" && (
          <View style={styles.tabContent}>
            <View style={[styles.sectionCard, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Login History</Text>

              {user?.loginHistory.map((login, index) => (
                <View
                  key={index}
                  style={[
                    styles.loginItem,
                    index < user.loginHistory.length - 1 && {
                      borderBottomWidth: 1,
                      borderBottomColor: theme.border,
                    },
                  ]}
                >
                  <View style={styles.loginInfo}>
                    <Text style={[styles.loginDevice, { color: theme.text }]}>{login.device}</Text>
                    <Text style={[styles.loginMeta, { color: theme.textSecondary }]}>
                      IP: {login.ip} • {new Date(login.date).toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={[styles.sectionCard, { backgroundColor: theme.cardBackground }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Account Actions</Text>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#3498DB20" }]}
                onPress={() => {
                  // Reset password
                  Alert.alert("Reset Password", "This will send a password reset email to the user. Continue?", [
                    { text: "Cancel", style: "cancel" },
                    { text: "Reset Password", onPress: () => Alert.alert("Success", "Password reset email sent") },
                  ])
                }}
              >
                <Ionicons name="key-outline" size={20} color="#3498DB" />
                <Text style={[styles.actionButtonText, { color: "#3498DB" }]}>Reset Password</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#F39C1220", marginTop: 10 }]}
                onPress={() => {
                  // Force logout
                  Alert.alert("Force Logout", "This will log the user out of all devices. Continue?", [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Force Logout",
                      onPress: () => Alert.alert("Success", "User has been logged out of all devices"),
                    },
                  ])
                }}
              >
                <Ionicons name="log-out-outline" size={20} color="#F39C12" />
                <Text style={[styles.actionButtonText, { color: "#F39C12" }]}>Force Logout</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#E74C3C20", marginTop: 10 }]}
                onPress={() => {
                  // Delete account
                  Alert.alert(
                    "Delete Account",
                    "This will permanently delete the user account and all associated data. This action cannot be undone.",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete Account",
                        style: "destructive",
                        onPress: () => Alert.alert("Success", "User account has been scheduled for deletion"),
                      },
                    ],
                  )
                }}
              >
                <Ionicons name="trash-outline" size={20} color="#E74C3C" />
                <Text style={[styles.actionButtonText, { color: "#E74C3C" }]}>Delete Account</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      <Modal
        visible={showActionModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowActionModal(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowActionModal(false)}>
          <View style={[styles.actionModal, { backgroundColor: theme.cardBackground }]}>
            <TouchableOpacity style={styles.actionItem} onPress={() => handleStatusChange("active")}>
              <Ionicons name="checkmark-circle-outline" size={22} color="#2ECC71" />
              <Text style={[styles.actionText, { color: theme.text }]}>Activate User</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionItem, { borderTopWidth: 1, borderTopColor: theme.border }]}
              onPress={() => handleStatusChange("suspended")}
            >
              <Ionicons name="pause-circle-outline" size={22} color="#F39C12" />
              <Text style={[styles.actionText, { color: theme.text }]}>Suspend User</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionItem, { borderTopWidth: 1, borderTopColor: theme.border }]}
              onPress={() => handleStatusChange("banned")}
            >
              <Ionicons name="ban-outline" size={22} color="#E74C3C" />
              <Text style={[styles.actionText, { color: theme.text }]}>Ban User</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionItem, { borderTopWidth: 1, borderTopColor: theme.border }]}
              onPress={() => {
                setShowActionModal(false)
                // @ts-ignore
                navigation.navigate("AdminReports", { filter: "user", userId: user.id })
              }}
            >
              <Ionicons name="flag-outline" size={22} color={theme.primary} />
              <Text style={[styles.actionText, { color: theme.text }]}>View Reports</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  profileHeader: {
    flexDirection: "row",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  userMeta: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  roleContainer: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 5,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "500",
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 5,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  verifiedContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 5,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 3,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 3,
  },
  userLocation: {
    fontSize: 14,
  },
  tabsContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
  },
  tabContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  sectionCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  bioText: {
    fontSize: 14,
    lineHeight: 20,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 14,
    fontWeight: "500",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
  },
  ratingContainer: {
    marginBottom: 15,
  },
  ratingStars: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  ratingValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginRight: 10,
  },
  starsContainer: {
    flexDirection: "row",
  },
  reviewCount: {
    fontSize: 14,
  },
  viewButton: {
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 8,
    alignItems: "center",
  },
  viewButtonText: {
    fontWeight: "500",
  },
  editButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
  infoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  activityItem: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  activityIcon: {
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityDetails: {
    fontSize: 14,
    marginBottom: 3,
  },
  activityDate: {
    fontSize: 12,
  },
  loginItem: {
    paddingVertical: 12,
  },
  loginInfo: {
    flex: 1,
  },
  loginDevice: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 3,
  },
  loginMeta: {
    fontSize: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  actionModal: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    overflow: "hidden",
  },
  actionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  actionText: {
    fontSize: 16,
    marginLeft: 15,
  },
})

export default UserDetailsScreen
