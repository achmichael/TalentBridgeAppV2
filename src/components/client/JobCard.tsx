"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"

interface Job {
  id: string
  title: string
  budget: number
  deadline: string
  status: string
  proposals: number
  description: string
}

interface JobCardProps {
  job: Job
  onPress: () => void
}

const JobCard: React.FC<JobCardProps> = ({ job, onPress }) => {
  const { theme } = useTheme()

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: theme.card }]} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>{job.title}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: job.status === "active" ? theme.secondary + "20" : theme.primary + "20" },
          ]}
        >
          <Text style={[styles.statusText, { color: job.status === "active" ? theme.secondary : theme.primary }]}>
            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
          </Text>
        </View>
      </View>

      <Text style={[styles.description, { color: theme.text + "80" }]} numberOfLines={2}>
        {job.description}
      </Text>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Ionicons name="cash-outline" size={16} color={theme.text} />
          <Text style={[styles.detailText, { color: theme.text }]}>${job.budget}</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={16} color={theme.text} />
          <Text style={[styles.detailText, { color: theme.text }]}>{formatDate(job.deadline)}</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="people-outline" size={16} color={theme.text} />
          <Text style={[styles.detailText, { color: theme.text }]}>{job.proposals} Proposals</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  title: {
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
  description: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 15,
    lineHeight: 20,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginLeft: 5,
  },
})

export default JobCard
