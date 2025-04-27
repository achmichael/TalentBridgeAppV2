"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"
import { useQuery } from "@tanstack/react-query"
import withAuth from "@/src/hoc/withAuth"

// Mock data fetching function
const fetchNotifications = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return [
    {
      id: "1",
      title: "New Job Proposal",
      message: "Your proposal for 'React Native Developer' has been accepted. Click to view details.",
      time: "2023-11-28T10:30:00",
      read: false,
      type: "proposal",
    },
    {
      id: "2",
      title: "Payment Received",
      message: "You have received a payment of $1,200 for the 'Portfolio Website Redesign' project.",
      time: "2023-11-27T15:45:00",
      read: true,
      type: "payment",
    },
    {
      id: "3",
      title: "New Message",
      message: "John Smith sent you a message regarding the E-commerce Mobile App project.",
      time: "2023-11-27T09:15:00",
      read: false,
      type: "message",
    },
    {
      id: "4",
      title: "Project Milestone Completed",
      message: "You have completed a milestone for 'Social Media Dashboard'. The client has been notified.",
      time: "2023-11-26T14:20:00",
      read: true,
      type: "milestone",
    },
    {
      id: "5",
      title: "New Job Recommendation",
      message: "Based on your profile, we found a new job that might interest you: 'Mobile App Developer'.",
      time: "2023-11-25T11:10:00",
      read: true,
      type: "recommendation",
    },
    {
      id: "6",
      title: "Review Received",
      message: "You received a 5-star review from Tech Solutions Inc. for the 'E-commerce Mobile App' project.",
      time: "2023-11-24T16:30:00",
      read: true,
      type: "review",
    },
  ]
}

const FreelancerNotificationsScreen = () => {
  const { theme } = useTheme()
  const [refreshing, setRefreshing] = useState(false)

  const {
    data: notifications,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
  })

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  const formatTime = (timeString: string) => {
    const now = new Date()
    const notificationTime = new Date(timeString)
    const diffInHours = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 24) {
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now.getTime() - notificationTime.getTime()) / (1000 * 60))
        return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`
      }
      return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`
    } else if (diffInHours < 48) {
      return "Yesterday"
    } else {
      return notificationTime.toLocaleDateString()
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "proposal":
        return <Ionicons name="document-text" size={24} color="#3B82F6" />
      case "payment":
        return <Ionicons name="cash" size={24} color="#10B981" />
      case "message":
        return <Ionicons name="chatbubble" size={24} color="#8B5CF6" />
      case "milestone":
        return <Ionicons name="checkmark-circle" size={24} color="#10B981" />
      case "recommendation":
        return <Ionicons name="briefcase" size={24} color="#F59E0B" />
      case "review":
        return <Ionicons name="star" size={24} color="#F59E0B" />
      default:
        return <Ionicons name="notifications" size={24} color="#6B7280" />
    }
  }

  const renderNotificationItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        { backgroundColor: item.read ? theme.background : theme.card },
        !item.read && { borderLeftColor: theme.secondary, borderLeftWidth: 4 },
      ]}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>{getNotificationIcon(item.type)}</View>
      <View style={styles.contentContainer}>
        <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
        <Text style={[styles.message, { color: theme.text + "80" }]}>{item.message}</Text>
        <Text style={[styles.time, { color: theme.text + "60" }]}>{formatTime(item.time)}</Text>
      </View>
      {!item.read && <View style={[styles.unreadDot, { backgroundColor: theme.secondary }]} />}
    </TouchableOpacity>
  )

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Notifications</Text>
        {notifications && notifications.some((n) => !n.read) && (
          <TouchableOpacity style={[styles.markAllButton, { borderColor: theme.secondary }]}>
            <Text style={[styles.markAllText, { color: theme.secondary }]}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.secondary} />
        </View>
      ) : notifications && notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.notificationsList}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.secondary]} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={50} color={theme.text + "40"} />
          <Text style={[styles.emptyText, { color: theme.text }]}>No notifications</Text>
          <Text style={[styles.emptySubtext, { color: theme.text + "80" }]}>
            You don't have any notifications yet
          </Text>
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
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  markAllText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  notificationsList: {
    padding: 16,
    paddingTop: 0,
  },
  notificationItem: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  iconContainer: {
    marginRight: 16,
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginTop: 4,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginTop: 8,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    alignSelf: "center",
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

export default withAuth(FreelancerNotificationsScreen)
