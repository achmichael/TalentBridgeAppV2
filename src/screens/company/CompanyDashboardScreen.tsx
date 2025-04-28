"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import type { CompanyStackParamList } from "../../navigation/CompanyNavigator";
import { useQuery } from "@tanstack/react-query";
import DashboardSkeleton from "../../components/skeletons/DashboardSkeleton";
import withAuth from "@/src/hoc/withAuth";
import { baseUrl } from "@/src/config/baseUrl";

type CompanyDashboardScreenNavigationProp =
  StackNavigationProp<CompanyStackParamList>;

const CompanyDashboardScreen = () => {
  const navigation = useNavigation<CompanyDashboardScreenNavigationProp>();
  const { theme } = useTheme();
  const { user, token } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${baseUrl}/jobs/company-jobs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: user?.id,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch dashboard data");
      }

      return result.data;
    } catch (error) {
      console.error("Error in fetchDashboardData:", error);
      throw error;
    }
  };


  const {
    data: dashboardData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["companyDashboard"],
    queryFn: fetchDashboardData,
  });

  console.log('DashboardData:', dashboardData);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.accent]}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text
            style={[
              styles.greeting,
              { color: theme.text, textTransform: "capitalize" },
            ]}
          >
            Hello, {user?.username}
          </Text>
          <Text style={[styles.subGreeting, { color: theme.text + "80" }]}>
            Manage your jobs and team members
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.settingsButton, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate("CompanySettings")}
        >
          <Ionicons name="settings-outline" size={22} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statsCard, { backgroundColor: theme.accent }]}>
          <Text style={styles.statsNumber}>{dashboardData?.activeJobs || 0}</Text>
          <Text style={styles.statsLabel}>Active Jobs</Text>
        </View>
        <View style={[styles.statsCard, { backgroundColor: theme.primary }]}>
          <Text style={styles.statsNumber}>
            {dashboardData?.totalApplicants || 0}
          </Text>
          <Text style={styles.statsLabel}>Applicants</Text>
        </View>
        <View style={[styles.statsCard, { backgroundColor: theme.secondary }]}>
          <Text style={styles.statsNumber}>
            {dashboardData?.teamMembers || 0}
          </Text>
          <Text style={styles.statsLabel}>Team</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View
        style={[styles.quickActionsContainer, { backgroundColor: theme.card }]}
      >
        <Text style={[styles.quickActionsTitle, { color: theme.text }]}>
          Quick Actions
        </Text>
        <View style={styles.quickActionsGrid}>
          <TouchableOpacity
            style={styles.quickActionItem}
            onPress={() => navigation.navigate("CreateJob")}
          >
            <View
              style={[
                styles.quickActionIcon,
                { backgroundColor: theme.accent + "20" },
              ]}
            >
              <Ionicons
                name="add-circle-outline"
                size={24}
                color={theme.accent}
              />
            </View>
            <Text style={[styles.quickActionText, { color: theme.text }]}>
              Post a Job
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionItem}
            // @ts-ignore
            onPress={() => navigation.navigate("Jobs")}
          >
            <View
              style={[
                styles.quickActionIcon,
                { backgroundColor: theme.primary + "20" },
              ]}
            >
              <Ionicons
                name="briefcase-outline"
                size={24}
                color={theme.primary}
              />
            </View>
            <Text style={[styles.quickActionText, { color: theme.text }]}>
              Manage Jobs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionItem}
            // @ts-ignore
            onPress={() => navigation.navigate("Team")}
          >
            <View
              style={[
                styles.quickActionIcon,
                { backgroundColor: theme.secondary + "20" },
              ]}
            >
              <Ionicons
                name="people-outline"
                size={24}
                color={theme.secondary}
              />
            </View>
            <Text style={[styles.quickActionText, { color: theme.text }]}>
              Team
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionItem}>
            <View
              style={[styles.quickActionIcon, { backgroundColor: "#F59E0B20" }]}
            >
              <Ionicons name="stats-chart-outline" size={24} color="#F59E0B" />
            </View>
            <Text style={[styles.quickActionText, { color: theme.text }]}>
              Analytics
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Applicants */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Recent Applicants
          </Text>
          <TouchableOpacity>
            <Text style={[styles.seeAll, { color: theme.accent }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>

        {dashboardData?.recentApplicants?.map((applicant: any) => (
          <TouchableOpacity
            key={applicant.id}
            style={[styles.applicantCard, { backgroundColor: theme.card }]}
            onPress={() =>
              navigation.navigate("ApplicantProfile", {
                applicantId: applicant.id,
              })
            }
          >
            <Image
              source={{ uri: applicant.avatar }}
              style={styles.applicantAvatar}
            />
            <View style={styles.applicantInfo}>
              <Text style={[styles.applicantName, { color: theme.text }]}>
                {applicant.name}
              </Text>
              <Text
                style={[styles.applicantTitle, { color: theme.text + "80" }]}
              >
                {applicant.title}
              </Text>
              <View style={styles.applicantMeta}>
                <Text style={[styles.appliedFor, { color: theme.accent }]}>
                  Applied for: {applicant.appliedFor}
                </Text>
                <Text
                  style={[styles.appliedTime, { color: theme.text + "60" }]}
                >
                  {new Date(applicant.appliedAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.text + "60"}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Active Jobs */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Active Jobs
          </Text>
          {/* @ts-ignore */}
          <TouchableOpacity onPress={() => navigation.navigate("Jobs")}>
            <Text style={[styles.seeAll, { color: theme.accent }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>

        {dashboardData?.map((job: any) => (
          <TouchableOpacity
            key={job.id}
            style={[styles.jobCard, { backgroundColor: theme.card }]}
            onPress={() => navigation.navigate("JobDetails", { jobId: job.id })}
          >
            <View style={styles.jobHeader}>
              <Text style={[styles.jobTitle, { color: theme.text }]}>
                {job.title}
              </Text>
              <View
                style={[
                  styles.jobTypeBadge,
                  { backgroundColor: theme.accent + "20" },
                ]}
              >
                <Text style={[styles.jobTypeText, { color: theme.accent }]}>
                  {job.type}
                </Text>
              </View>
            </View>

            <View style={styles.jobDetails}>
              <View style={styles.jobDetail}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={theme.text + "80"}
                />
                <Text
                  style={[styles.jobDetailText, { color: theme.text + "80" }]}
                >
                  {job.location}
                </Text>
              </View>

              <View style={styles.jobDetail}>
                <Ionicons
                  name="people-outline"
                  size={16}
                  color={theme.text + "80"}
                />
                <Text
                  style={[styles.jobDetailText, { color: theme.text + "80" }]}
                >
                  {job.applicants} Applicants
                </Text>
              </View>

              <View style={styles.jobDetail}>
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={theme.text + "80"}
                />
                <Text
                  style={[styles.jobDetailText, { color: theme.text + "80" }]}
                >
                  Posted {new Date(job.postedAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Activity */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Recent Activity
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate("Notifications" as never)}
          >
            <Text style={[styles.seeAll, { color: theme.accent }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.activityCard, { backgroundColor: theme.card }]}>
          <View style={styles.activityHeader}>
            <View
              style={[
                styles.activityIcon,
                { backgroundColor: theme.accent + "20" },
              ]}
            >
              <Ionicons name="person-outline" size={20} color={theme.accent} />
            </View>
            <View style={styles.activityInfo}>
              <Text style={[styles.activityTitle, { color: theme.text }]}>
                New Application
              </Text>
              <Text style={[styles.activityTime, { color: theme.text + "80" }]}>
                2 hours ago
              </Text>
            </View>
          </View>
          <Text style={[styles.activityDescription, { color: theme.text }]}>
            Jane Smith has applied for the "Product Designer" position.
          </Text>
        </View>

        <View style={[styles.activityCard, { backgroundColor: theme.card }]}>
          <View style={styles.activityHeader}>
            <View
              style={[
                styles.activityIcon,
                { backgroundColor: theme.secondary + "20" },
              ]}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color={theme.secondary}
              />
            </View>
            <View style={styles.activityInfo}>
              <Text style={[styles.activityTitle, { color: theme.text }]}>
                Interview Scheduled
              </Text>
              <Text style={[styles.activityTime, { color: theme.text + "80" }]}>
                5 hours ago
              </Text>
            </View>
          </View>
          <Text style={[styles.activityDescription, { color: theme.text }]}>
            Interview scheduled with Mike Johnson for the "React Native
            Developer" position.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 40,
  },
  greeting: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
  },
  subGreeting: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statsCard: {
    width: "31%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  statsNumber: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  statsLabel: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
  quickActionsContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  quickActionsTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickActionItem: {
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  seeAll: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  applicantCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  applicantAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  applicantInfo: {
    flex: 1,
  },
  applicantName: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginBottom: 2,
  },
  applicantTitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 5,
  },
  applicantMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appliedFor: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  appliedTime: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  jobCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    flex: 1,
  },
  jobTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  jobTypeText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  jobDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  jobDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 5,
  },
  jobDetailText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginLeft: 5,
  },
  activityCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  activityTime: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  activityDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 20,
  },
});

export default withAuth(CompanyDashboardScreen);
