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
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import type { FreelancerStackParamList } from "../../navigation/FreelancerNavigator";
import { useQuery } from "@tanstack/react-query";
import DashboardSkeleton from "../../components/skeletons/DashboardSkeleton";

type FreelancerDashboardScreenNavigationProp =
  StackNavigationProp<FreelancerStackParamList>;

// Mock data fetching functions
const fetchRecommendedJobs = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return [
    {
      id: "1",
      title: "React Native Developer Needed",
      client: {
        name: "John Smith",
        avatar: "https://ui-avatars.com/api/?name=John+Smith",
        rating: 4.8,
      },
      budget: 1500,
      deadline: "2023-12-15",
      description:
        "Looking for an experienced React Native developer to build a mobile app.",
      skills: ["React Native", "JavaScript", "TypeScript"],
      postedAt: "2023-11-20",
    },
    {
      id: "2",
      title: "Mobile App UI/UX Designer",
      client: {
        name: "Sarah Johnson",
        avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson",
        rating: 4.9,
      },
      budget: 2000,
      deadline: "2023-12-20",
      description:
        "Need a talented designer to create UI/UX for a mobile application.",
      skills: ["UI/UX", "Figma", "Mobile Design"],
      postedAt: "2023-11-22",
    },
    {
      id: "3",
      title: "Expo Developer for Quick Project",
      client: {
        name: "Mike Brown",
        avatar: "https://ui-avatars.com/api/?name=Mike+Brown",
        rating: 4.7,
      },
      budget: 800,
      deadline: "2023-12-10",
      description:
        "Looking for an Expo developer for a small project. Quick turnaround needed.",
      skills: ["Expo", "React Native", "JavaScript"],
      postedAt: "2023-11-23",
    },
  ];
};

const fetchActiveProjects = async () => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    {
      id: "1",
      title: "E-commerce Mobile App",
      client: {
        name: "Tech Solutions Inc.",
        avatar: "https://ui-avatars.com/api/?name=Tech+Solutions",
      },
      progress: 65,
      dueDate: "2023-12-30",
      payment: 3500,
      status: "in progress",
    },
    {
      id: "2",
      title: "Social Media Dashboard",
      client: {
        name: "Digital Marketing Co.",
        avatar: "https://ui-avatars.com/api/?name=Digital+Marketing",
      },
      progress: 40,
      dueDate: "2024-01-15",
      payment: 2800,
      status: "in progress",
    },
  ];
};

const FreelancerDashboardScreen = () => {
  const navigation = useNavigation<FreelancerDashboardScreenNavigationProp>();
  const { theme } = useTheme();
  const { user } = useAuth();

  // Fetch recommended jobs
  const {
    data: jobs,
    isLoading: isLoadingJobs,
    refetch: refetchJobs,
  } = useQuery({
    queryKey: ["recommendedJobs"],
    queryFn: fetchRecommendedJobs,
  });

  // Fetch active projects
  const {
    data: projects,
    isLoading: isLoadingProjects,
    refetch: refetchProjects,
  } = useQuery({
    queryKey: ["activeProjects"],
    queryFn: fetchActiveProjects,
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchJobs(), refetchProjects()]);
    setRefreshing(false);
  };

  if (isLoadingJobs || isLoadingProjects) {
    return <DashboardSkeleton />;
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: theme.text }]}>
            Hello, {user?.username}
          </Text>
          <Text style={[styles.subGreeting, { color: theme.text + "80" }]}>
            Find your next opportunity
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.settingsButton, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate("FreelancerSettings")}
        >
          <Ionicons name="settings-outline" size={22} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statsCard, { backgroundColor: theme.secondary }]}>
          <Text style={styles.statsNumber}>$5,200</Text>
          <Text style={styles.statsLabel}>Earnings</Text>
        </View>
        <View style={[styles.statsCard, { backgroundColor: theme.primary }]}>
          <Text style={styles.statsNumber}>2</Text>
          <Text style={styles.statsLabel}>Active Projects</Text>
        </View>
        <View style={[styles.statsCard, { backgroundColor: theme.accent }]}>
          <Text style={styles.statsNumber}>12</Text>
          <Text style={styles.statsLabel}>Proposals</Text>
        </View>
      </View>

      {/* Active Projects */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Active Projects
          </Text>
          <TouchableOpacity onPress={() => 
            // @ts-ignore
            navigation.navigate("Projects")}>
            <Text style={[styles.seeAll, { color: theme.secondary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>

        {projects && projects.length > 0 ? (
          projects.map((project) => (
            <View
              key={project.id}
              style={[styles.projectCard, { backgroundColor: theme.card }]}
            >
              <View style={styles.projectHeader}>
                <View style={styles.clientInfo}>
                  <Image
                    source={{ uri: project.client.avatar }}
                    style={styles.clientAvatar}
                  />
                  <View>
                    <Text style={[styles.projectTitle, { color: theme.text }]}>
                      {project.title}
                    </Text>
                    <Text
                      style={[styles.clientName, { color: theme.text + "80" }]}
                    >
                      {project.client.name}
                    </Text>
                  </View>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: theme.secondary + "20" },
                  ]}
                >
                  <Text style={[styles.statusText, { color: theme.secondary }]}>
                    In Progress
                  </Text>
                </View>
              </View>

              <View style={styles.projectDetails}>
                <View style={styles.progressContainer}>
                  <View style={styles.progressLabels}>
                    <Text style={[styles.progressLabel, { color: theme.text }]}>
                      Progress
                    </Text>
                    <Text
                      style={[
                        styles.progressPercentage,
                        { color: theme.secondary },
                      ]}
                    >
                      {project.progress}%
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.progressBar,
                      { backgroundColor: theme.border },
                    ]}
                  >
                    <View
                      style={[
                        styles.progressFill,
                        {
                          backgroundColor: theme.secondary,
                          width: `${project.progress}%`,
                        },
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.projectFooter}>
                  <View style={styles.projectDetail}>
                    <Ionicons
                      name="calendar-outline"
                      size={16}
                      color={theme.text}
                    />
                    <Text style={[styles.detailText, { color: theme.text }]}>
                      Due: {new Date(project.dueDate).toLocaleDateString()}
                    </Text>
                  </View>

                  <View style={styles.projectDetail}>
                    <Ionicons
                      name="cash-outline"
                      size={16}
                      color={theme.text}
                    />
                    <Text style={[styles.detailText, { color: theme.text }]}>
                      ${project.payment}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={[styles.emptyState, { backgroundColor: theme.card }]}>
            <MaterialIcons
              name="work-outline"
              size={40}
              color={theme.text + "60"}
            />
            <Text style={[styles.emptyStateText, { color: theme.text }]}>
              You don't have any active projects
            </Text>
            <TouchableOpacity
              style={[
                styles.emptyStateButton,
                { backgroundColor: theme.secondary },
              ]}
              // @ts-ignore
              onPress={() => navigation.navigate("Jobs")}
            >
              <Text style={styles.emptyStateButtonText}>Find Jobs</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Recommended Jobs */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Recommended Jobs
          </Text>
          <TouchableOpacity onPress={() => 
            // @ts-ignore
            navigation.navigate("Jobs")}>
            <Text style={[styles.seeAll, { color: theme.secondary }]}>
              See All
            </Text>
          </TouchableOpacity>
        </View>

        {jobs &&
          jobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              style={[styles.jobCard, { backgroundColor: theme.card }]}
              onPress={() =>
                navigation.navigate("JobDetails", { jobId: job.id })
              }
              activeOpacity={0.7}
            >
              <View style={styles.jobHeader}>
                <Text style={[styles.jobTitle, { color: theme.text }]}>
                  {job.title}
                </Text>
                <Text style={[styles.jobBudget, { color: theme.secondary }]}>
                  ${job.budget}
                </Text>
              </View>

              <View style={styles.clientRow}>
                <Image
                  source={{ uri: job.client.avatar }}
                  style={styles.clientAvatar}
                />
                <Text style={[styles.clientName, { color: theme.text + "80" }]}>
                  {job.client.name}
                </Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={[styles.ratingText, { color: theme.text }]}>
                    {job.client.rating}
                  </Text>
                </View>
              </View>

              <Text
                style={[styles.jobDescription, { color: theme.text + "80" }]}
                numberOfLines={2}
              >
                {job.description}
              </Text>

              <View style={styles.skillsContainer}>
                {job.skills.map((skill, index) => (
                  <View
                    key={index}
                    style={[
                      styles.skillBadge,
                      { backgroundColor: theme.secondary + "20" },
                    ]}
                  >
                    <Text
                      style={[styles.skillText, { color: theme.secondary }]}
                    >
                      {skill}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.jobFooter}>
                <View style={styles.jobDetail}>
                  <Ionicons
                    name="time-outline"
                    size={14}
                    color={theme.text + "80"}
                  />
                  <Text
                    style={[styles.jobDetailText, { color: theme.text + "80" }]}
                  >
                    Posted {new Date(job.postedAt).toLocaleDateString()}
                  </Text>
                </View>

                <View style={styles.jobDetail}>
                  <Ionicons
                    name="calendar-outline"
                    size={14}
                    color={theme.text + "80"}
                  />
                  <Text
                    style={[styles.jobDetailText, { color: theme.text + "80" }]}
                  >
                    Due {new Date(job.deadline).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
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
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  statsLabel: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
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
  projectCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  projectHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 15,
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
  projectDetails: {
    marginTop: 5,
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
  emptyState: {
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginVertical: 10,
    textAlign: "center",
  },
  emptyStateButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  emptyStateButtonText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },
  jobCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    flex: 1,
    marginRight: 10,
  },
  jobBudget: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  clientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  ratingText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
    marginLeft: 3,
  },
  jobDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 10,
    lineHeight: 20,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  skillBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  skillText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  jobFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  jobDetail: {
    flexDirection: "row",
    alignItems: "center",
  },
  jobDetailText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginLeft: 5,
  },
});

export default FreelancerDashboardScreen;
