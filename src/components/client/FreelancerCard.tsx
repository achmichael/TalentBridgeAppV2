"use client"

import type React from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"

interface Freelancer {
  id: string
  name: string
  title: string
  rating: number
  hourlyRate: number
  avatar: string
  skills: string[]
}

interface FreelancerCardProps {
  freelancer: Freelancer
  onPress: () => void
  listMode?: boolean
}

const FreelancerCard: React.FC<FreelancerCardProps> = ({ freelancer, onPress, listMode = false }) => {
  const { theme } = useTheme()

  if (listMode) {
    return (
      <TouchableOpacity
        style={[styles.listContainer, { backgroundColor: theme.card }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Image source={{ uri: freelancer.avatar }} style={styles.listAvatar} />
        <View style={styles.listInfo}>
          <Text style={[styles.listName, { color: theme.text }]}>{freelancer.name}</Text>
          <Text style={[styles.listTitle, { color: theme.text + "80" }]}>{freelancer.title}</Text>
          <View style={styles.listRatingContainer}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={[styles.listRating, { color: theme.text }]}>{freelancer.rating.toFixed(1)}</Text>
          </View>
          <View style={styles.listSkillsContainer}>
            {freelancer.skills.slice(0, 2).map((skill, index) => (
              <View key={index} style={[styles.listSkillBadge, { backgroundColor: theme.primary + "20" }]}>
                <Text style={[styles.listSkillText, { color: theme.primary }]}>{skill}</Text>
              </View>
            ))}
            {freelancer.skills.length > 2 && (
              <Text style={[styles.moreSkills, { color: theme.text + "60" }]}>+{freelancer.skills.length - 2}</Text>
            )}
          </View>
        </View>
        <View style={styles.listRateContainer}>
          <Text style={[styles.listRate, { color: theme.primary }]}>${freelancer.hourlyRate}/hr</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity style={[styles.container, { backgroundColor: theme.card }]} onPress={onPress} activeOpacity={0.7}>
      <Image source={{ uri: freelancer.avatar }} style={styles.avatar} />

      <Text style={[styles.name, { color: theme.text }]}>{freelancer.name}</Text>

      <Text style={[styles.title, { color: theme.text + "80" }]}>{freelancer.title}</Text>

      <View style={styles.ratingContainer}>
        <Ionicons name="star" size={16} color="#FFD700" />
        <Text style={[styles.rating, { color: theme.text }]}>{freelancer.rating.toFixed(1)}</Text>
      </View>

      <View style={styles.divider} />

      <Text style={[styles.rateLabel, { color: theme.text + "80" }]}>Hourly Rate</Text>

      <Text style={[styles.rate, { color: theme.primary }]}>${freelancer.hourlyRate}/hr</Text>

      <View style={styles.skillsContainer}>
        {freelancer.skills.slice(0, 3).map((skill, index) => (
          <View key={index} style={[styles.skillBadge, { backgroundColor: theme.primary + "20" }]}>
            <Text style={[styles.skillText, { color: theme.primary }]}>{skill}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "48%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    textAlign: "center",
  },
  title: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  rating: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginLeft: 5,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
  },
  rateLabel: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  rate: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    marginBottom: 10,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  skillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    margin: 2,
  },
  skillText: {
    fontSize: 10,
    fontFamily: "Poppins-Medium",
  },
  // List mode styles
  listContainer: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  listAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginBottom: 2,
  },
  listTitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 4,
  },
  listRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  listRating: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginLeft: 5,
  },
  listSkillsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  listSkillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginRight: 5,
  },
  listSkillText: {
    fontSize: 10,
    fontFamily: "Poppins-Medium",
  },
  moreSkills: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginLeft: 5,
  },
  listRateContainer: {
    alignItems: "flex-end",
  },
  listRate: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
})

export default FreelancerCard
