"use client";

import { useState } from "react";
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
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTheme } from "../../contexts/ThemeContext";
import { useQuery, useMutation } from "react-query";
import { AdminStackParamList } from "@/src/navigation/AdminNavigator";
import { RouteProp } from "@react-navigation/native";

// Mock API calls
const fetchJobDetails = async (jobId: string) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock job data
  return {
    id: jobId,
    title: "Senior React Native Developer",
    company: "TechCorp Inc.",
    companyLogo: "https://randomuser.me/api/portraits/men/32.jpg",
    location: "Remote",
    type: "Full-time",
    status: "active",
    createdAt: "2023-06-15",
    updatedAt: "2023-06-16",
    expiresAt: "2023-07-15",
    salary: "$80,000 - $120,000",
    description: `We are looking for an experienced React Native developer to join our mobile development team. The ideal candidate will have a strong understanding of React Native, its core principles, and experience building and deploying mobile applications.

Responsibilities:
- Develop and maintain high-quality mobile applications using React Native
- Work with cross-functional teams to define, design, and ship new features
- Identify and address performance bottlenecks
- Unit-test code for robustness, including edge cases, usability, and general reliability
- Work on bug fixing and improving application performance

Requirements:
- 3+ years of experience with React Native
- Strong knowledge of JavaScript/TypeScript
- Experience with state management libraries (Redux, MobX, etc.)
- Familiarity with native build tools (Xcode, Android Studio)
- Understanding of RESTful APIs and GraphQL
- Experience with version control systems (Git)`,
    skills: ["React Native", "JavaScript", "TypeScript", "Redux", "Git"],
    applicants: 24,
    views: 156,
    featured: true,
    promoted: true,
    reportCount: 0,
    postedBy: {
      id: "3",
      name: "Robert Johnson",
      role: "company",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    recentApplicants: [
      {
        id: "1",
        name: "John Doe",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      },
      {
        id: "2",
        name: "Jane Smith",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      },
      {
        id: "3",
        name: "Michael Brown",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      },
      {
        id: "4",
        name: "Emily Davis",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      },
    ],
  };
};

const updateJobStatus = async ({ jobId, status }: { jobId: string, status: string}) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { success: true };
};

const JobDetailsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AdminStackParamList, 'JobDetails'>>();
  const { jobId } = route.params;

  const [showActionModal, setShowActionModal] = useState(false);

  const {
    data: job,
    isLoading,
    refetch,
  } = useQuery(["jobDetails", jobId], () => fetchJobDetails(jobId));

  const { mutate: updateStatus, isLoading: isUpdating } = useMutation(
    updateJobStatus,
    {
      onSuccess: () => {
        refetch();
        Alert.alert("Success", "Job status updated successfully");
      },
      onError: () => {
        Alert.alert("Error", "Failed to update job status");
      },
    }
  );

  const handleStatusChange = (newStatus: "active" | "paused" | "closed") => {
    setShowActionModal(false);

    const statusMessages = {
      active: "This will make the job visible to all users.",
      paused: "This will temporarily hide the job from search results.",
      closed:
        "This will mark the job as closed and no longer accepting applications.",
    };

    Alert.alert(
      `Confirm ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
      statusMessages[newStatus],
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm",
          onPress: () => {
            updateStatus({ jobId, status: newStatus });
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "active":
        return "#2ECC71";
      case "paused":
        return "#F39C12";
      case "closed":
        return "#95A5A6";
      default:
        return theme.textSecondary;
    }
  };

  const getTypeColor = (type: string | undefined) => {
    switch (type) {
      case "Full-time":
        return "#3498DB";
      case "Part-time":
        return "#9B59B6";
      case "Contract":
        return "#1ABC9C";
      default:
        return theme.textSecondary;
    }
  };

  if (isLoading) {
    return (
      <View
        style={[styles.loadingContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>
          Loading job details...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Job Details
        </Text>
        <TouchableOpacity onPress={() => setShowActionModal(true)}>
          <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={[styles.jobHeader, { backgroundColor: theme.cardBackground }]}
        >
          <View style={styles.companyInfo}>
            <Image
              source={{ uri: job?.companyLogo }}
              style={styles.companyLogo}
            />
            <View style={styles.companyDetails}>
              <Text style={[styles.jobTitle, { color: theme.text }]}>
                {job?.title}
              </Text>
              <Text style={[styles.companyName, { color: theme.text }]}>
                {job?.company}
              </Text>
            </View>
          </View>

          <View style={styles.jobMeta}>
            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons
                  name="location-outline"
                  size={16}
                  color={theme.textSecondary}
                />
                <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                  {job?.location}
                </Text>
              </View>

              <View
                style={[
                  styles.typeContainer,
                  { backgroundColor: getTypeColor(job?.type) + "20" },
                ]}
              >
                <Text
                  style={[styles.typeText, { color: getTypeColor(job?.type) }]}
                >
                  {job?.type}
                </Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={theme.textSecondary}
                />
                <Text style={[styles.metaText, { color: theme.textSecondary }]}>
                  Posted:{" "}
                  {job?.createdAt
                    ? new Date(job.createdAt).toLocaleDateString()
                    : "N/A"}
                </Text>
              </View>

              <View
                style={[
                  styles.statusContainer,
                  { backgroundColor: getStatusColor(job?.status) + "20" },
                ]}
              >
                {job && (
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(job?.status) },
                    ]}
                  >
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </Text>
                )}
              </View>
            </View>
          </View>

          <View style={styles.salaryContainer}>
            <MaterialIcons
              name="attach-money"
              size={18}
              color={theme.primary}
            />
            <Text style={[styles.salaryText, { color: theme.primary }]}>
              {job?.salary}
            </Text>
          </View>

          {(job?.featured || job?.promoted) && (
            <View style={styles.tagsContainer}>
              {job?.featured && (
                <View
                  style={[
                    styles.tagContainer,
                    { backgroundColor: "#9B59B620" },
                  ]}
                >
                  <Ionicons name="star" size={14} color="#9B59B6" />
                  <Text style={[styles.tagText, { color: "#9B59B6" }]}>
                    Featured
                  </Text>
                </View>
              )}

              {job?.promoted && (
                <View
                  style={[
                    styles.tagContainer,
                    { backgroundColor: "#F39C1220" },
                  ]}
                >
                  <Ionicons name="trending-up" size={14} color="#F39C12" />
                  <Text style={[styles.tagText, { color: "#F39C12" }]}>
                    Promoted
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        <View
          style={[
            styles.sectionCard,
            { backgroundColor: theme.cardBackground },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Job Description
          </Text>
          <Text style={[styles.descriptionText, { color: theme.text }]}>
            {job?.description}
          </Text>
        </View>

        <View
          style={[
            styles.sectionCard,
            { backgroundColor: theme.cardBackground },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Required Skills
          </Text>
          <View style={styles.skillsContainer}>
            {job?.skills.map((skill, index) => (
              <View
                key={index}
                style={[
                  styles.skillBadge,
                  { backgroundColor: theme.primary + "20" },
                ]}
              >
                <Text style={[styles.skillText, { color: theme.primary }]}>
                  {skill}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={[
            styles.sectionCard,
            { backgroundColor: theme.cardBackground },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Job Stats
          </Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {job?.applicants}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Applicants
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {job?.views}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Views
              </Text>
            </View>

            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {job?.reportCount}
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Reports
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.sectionCard,
            { backgroundColor: theme.cardBackground },
          ]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Recent Applicants
            </Text>
            <TouchableOpacity
              style={[styles.viewAllButton, { borderColor: theme.primary }]}
              onPress={() => {
                // View all applicants
                Alert.alert(
                  "View Applicants",
                  "View all applicants functionality would go here"
                );
              }}
            >
              <Text style={[styles.viewAllText, { color: theme.primary }]}>
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.applicantsContainer}>
            {job?.recentApplicants.map((applicant, index) => (
              <TouchableOpacity
                key={index}
                style={styles.applicantItem}
                onPress={() =>
                // @ts-ignore
                  navigation.navigate("UserDetails", { userId: applicant.id })
                }
              >
                <Image
                  source={{ uri: applicant.avatar }}
                  style={styles.applicantAvatar}
                />
                <Text
                  style={[styles.applicantName, { color: theme.text }]}
                  numberOfLines={1}
                >
                  {applicant.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View
          style={[
            styles.sectionCard,
            { backgroundColor: theme.cardBackground },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Posted By
          </Text>
          <TouchableOpacity
            style={styles.postedByContainer}
            onPress={() =>
                // @ts-ignore
              navigation.navigate("UserDetails", { userId: job.postedBy.id })
            }
          >
            <Image
              source={{ uri: job?.postedBy.avatar }}
              style={styles.postedByAvatar}
            />
            <View style={styles.postedByInfo}>
              <Text style={[styles.postedByName, { color: theme.text }]}>
                {job?.postedBy.name}
              </Text>
              {job && (
                <Text
                  style={[styles.postedByRole, { color: theme.textSecondary }]}
                >
                  {job.postedBy.role.charAt(0).toUpperCase() +
                    job.postedBy.role.slice(1)}
                </Text>
              )}
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#3498DB" }]}
            onPress={() => {
              // Edit job
              Alert.alert("Edit Job", "Edit job functionality would go here");
            }}
          >
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Edit Job</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#E74C3C" }]}
            onPress={() => {
              // Delete job
              Alert.alert(
                "Delete Job",
                "Are you sure you want to delete this job? This action cannot be undone.",
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                      // Handle delete
                      Alert.alert("Success", "Job has been deleted");
                      navigation.goBack();
                    },
                  },
                ]
              );
            }}
          >
            <Ionicons name="trash-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Delete Job</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={showActionModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowActionModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowActionModal(false)}
        >
          <View
            style={[
              styles.actionModal,
              { backgroundColor: theme.cardBackground },
            ]}
          >
            <TouchableOpacity
              style={styles.actionItem}
              onPress={() => handleStatusChange("active")}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={22}
                color="#2ECC71"
              />
              <Text style={[styles.actionText, { color: theme.text }]}>
                Activate Job
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionItem,
                { borderTopWidth: 1, borderTopColor: theme.border },
              ]}
              onPress={() => handleStatusChange("paused")}
            >
              <Ionicons name="pause-circle-outline" size={22} color="#F39C12" />
              <Text style={[styles.actionText, { color: theme.text }]}>
                Pause Job
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionItem,
                { borderTopWidth: 1, borderTopColor: theme.border },
              ]}
              onPress={() => handleStatusChange("closed")}
            >
              <Ionicons name="close-circle-outline" size={22} color="#95A5A6" />
              <Text style={[styles.actionText, { color: theme.text }]}>
                Close Job
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionItem,
                { borderTopWidth: 1, borderTopColor: theme.border },
              ]}
              onPress={() => {
                setShowActionModal(false);
                // Toggle featured status
                Alert.alert(
                  "Feature Job",
                  "Feature job functionality would go here"
                );
              }}
            >
              <Ionicons name="star-outline" size={22} color="#9B59B6" />
              <Text style={[styles.actionText, { color: theme.text }]}>
                {job?.featured ? "Remove Featured" : "Mark as Featured"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionItem,
                { borderTopWidth: 1, borderTopColor: theme.border },
              ]}
              onPress={() => {
                setShowActionModal(false);
                // Toggle promoted status
                Alert.alert(
                  "Promote Job",
                  "Promote job functionality would go here"
                );
              }}
            >
              <Ionicons name="trending-up-outline" size={22} color="#F39C12" />
              <Text style={[styles.actionText, { color: theme.text }]}>
                {job?.promoted ? "Remove Promotion" : "Promote Job"}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

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
  jobHeader: {
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
  companyInfo: {
    flexDirection: "row",
    marginBottom: 15,
  },
  companyLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  companyDetails: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  companyName: {
    fontSize: 16,
  },
  jobMeta: {
    marginBottom: 15,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  metaText: {
    fontSize: 14,
    marginLeft: 5,
  },
  typeContainer: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  salaryContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  salaryText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 5,
  },
  tagsContainer: {
    flexDirection: "row",
  },
  tagContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 3,
  },
  sectionCard: {
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
  descriptionText: {
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
  viewAllButton: {
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  viewAllText: {
    fontSize: 14,
    fontWeight: "500",
  },
  applicantsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  applicantItem: {
    alignItems: "center",
    width: "22%",
  },
  applicantAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 5,
  },
  applicantName: {
    fontSize: 12,
    textAlign: "center",
  },
  postedByContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  postedByAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  postedByInfo: {
    flex: 1,
  },
  postedByName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 3,
  },
  postedByRole: {
    fontSize: 14,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginBottom: 30,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    paddingVertical: 12,
    borderRadius: 10,
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "500",
    marginLeft: 8,
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
});

export default JobDetailsScreen;
