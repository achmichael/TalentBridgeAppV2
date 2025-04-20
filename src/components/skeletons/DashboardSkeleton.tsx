"use client"

import { View, StyleSheet, Dimensions } from "react-native"
import { useTheme } from "../../contexts/ThemeContext"
import SkeletonLoading from 'expo-skeleton-loading'

const { width } = Dimensions.get("window")

const DashboardSkeleton = () => {
  const { theme, isDark } = useTheme()

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <SkeletonLoading
      highlight="#E0E0E0"
      background="#F0F0F0"
      >
        <View>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <View style={styles.titleSkeleton} />
              <View style={styles.subtitleSkeleton} />
            </View>
            <View style={styles.circleSkeleton} />
          </View>

          {/* Search Bar */}
          <View style={styles.searchBarSkeleton} />

          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCardSkeleton} />
            <View style={styles.statCardSkeleton} />
            <View style={styles.statCardSkeleton} />
          </View>

          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleSkeleton} />
            <View style={styles.seeAllSkeleton} />
          </View>

          {/* Job Cards */}
          <View style={styles.jobCardSkeleton} />
          <View style={styles.jobCardSkeleton} />

          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleSkeleton} />
            <View style={styles.seeAllSkeleton} />
          </View>

          {/* Freelancer Cards */}
          <View style={styles.freelancersContainer}>
            <View style={styles.freelancerCardSkeleton} />
            <View style={styles.freelancerCardSkeleton} />
          </View>

          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleSkeleton} />
            <View style={styles.seeAllSkeleton} />
          </View>

          {/* Activity Cards */}
          <View style={styles.activityCardSkeleton} />
          <View style={styles.activityCardSkeleton} />
        </View>
      </SkeletonLoading>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 56,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titleSkeleton: {
    width: 150,
    height: 24,
    borderRadius: 4,
    marginBottom: 8,
  },
  subtitleSkeleton: {
    width: 200,
    height: 16,
    borderRadius: 4,
  },
  circleSkeleton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchBarSkeleton: {
    width: "100%",
    height: 50,
    borderRadius: 10,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCardSkeleton: {
    width: "31%",
    height: 80,
    borderRadius: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    marginTop: 25,
  },
  sectionTitleSkeleton: {
    width: 150,
    height: 20,
    borderRadius: 4,
  },
  seeAllSkeleton: {
    width: 50,
    height: 16,
    borderRadius: 4,
  },
  jobCardSkeleton: {
    width: "100%",
    height: 120,
    borderRadius: 10,
    marginBottom: 15,
  },
  freelancersContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  freelancerCardSkeleton: {
    width: 180,
    height: 220,
    borderRadius: 10,
    marginRight: 15,
  },
  activityCardSkeleton: {
    width: "100%",
    height: 100,
    borderRadius: 10,
    marginBottom: 15,
  },
})

export default DashboardSkeleton
