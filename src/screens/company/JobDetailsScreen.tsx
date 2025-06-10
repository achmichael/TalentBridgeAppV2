"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  FlatList,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import type { CompanyStackParamList } from "../../navigation/CompanyNavigator";
import { useQuery } from "@tanstack/react-query";
import withAuth from "@/src/hoc/withAuth";
import { fetcher } from "@/src/components/common/AutoHelper";
import { baseUrl } from "@/src/config/baseUrl";
import LoadingScreen from "../common/LoadingScreen";

type JobDetailsScreenRouteProp = RouteProp<CompanyStackParamList, "JobDetails">;
type JobDetailsScreenNavigationProp =
  StackNavigationProp<CompanyStackParamList>;

const fetchJobDetails = async (jobId: string) => {
  const response = await fetcher(`${baseUrl}/jobs/${jobId}`);
  if (response.error) {
    throw new Error(response.error);
  }

  return response.data;
};

const JobDetailsScreen = () => {
  const route = useRoute<JobDetailsScreenRouteProp>();
  const navigation = useNavigation<JobDetailsScreenNavigationProp>();
  const { theme } = useTheme();
  const { jobId } = route.params;
  const [activeTab, setActiveTab] = useState("details");

  const {
    data: job,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["companyJobDetails", jobId],
    queryFn: () => fetchJobDetails(jobId),
  });

  const handleCloseJob = () => {
    Alert.alert(
      "Close Job",
      "Are you sure you want to close this job posting?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Close Job",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Job Closed",
              "This job posting has been closed successfully."
            );
            navigation.goBack();
          },
        },
      ]
    );
  };

  const getApplicantStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#3B82F6"; // Blue
      case "reviewed":
        return "#F59E0B"; // Amber
      case "interviewing":
        return "#10B981"; // Green
      case "rejected":
        return "#EF4444"; // Red
      default:
        return theme.text;
    }
  };

  if (isLoading || !job) {
    return <LoadingScreen />;
  }

  const renderApplicantItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.applicantCard, { backgroundColor: theme.card }]}
      onPress={() =>
        navigation.navigate("ApplicantProfile", { applicantId: item.id })
      }
      activeOpacity={0.7}
    >
      <Image source={{ uri: item?.applicant?.profile_picture || 'https://i.pinimg.com/736x/ed/1f/41/ed1f41959e7e9aa7fb0a18b76c6c2755.jpg' }} style={styles.applicantAvatar} />
      <View style={styles.applicantInfo}>
        <Text style={[styles.applicantName, { color: theme.text, textTransform: 'capitalize' }]}>
          {item?.applicant?.username}
        </Text>
        <Text style={[styles.applicantTitle, { color: theme.text + "80" }]}>
          {item?.applicant?.email || "No Email Provided"}
        </Text>
        <Text style={[styles.appliedDate, { color: theme.text + "60" }]}>
          Applied {new Date(item.created_at).toLocaleDateString()}
        </Text>
      </View>
      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor: getApplicantStatusColor(item.status) + "20",
          },
        ]}
      >
        <Text
          style={[
            styles.statusText,
            {
              color: getApplicantStatusColor(item.status),
            },
          ]}
        >
          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Job Details
        </Text>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.jobHeader}>
        <Text style={[styles.jobTitle, { color: theme.text }]}>
          {job.post.title}
        </Text>
        <View style={styles.jobMeta}>
          <View style={styles.metaItem}>
            <Ionicons
              name="briefcase-outline"
              size={16}
              color={theme.text + "80"}
            />
            <Text
              style={[
                styles.metaText,
                { color: theme.text + "80", textTransform: "capitalize" },
              ]}
            >
              {job.type_job}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons
              name="location-outline"
              size={16}
              color={theme.text + "80"}
            />
            <Text
              style={[
                styles.metaText,
                { color: theme.text + "80", textTransform: "uppercase" },
              ]}
            >
              {job.system}
            </Text>
          </View>
        </View>
        <View style={styles.jobMeta}>
          <View style={styles.metaItem}>
            <Ionicons
              name="people-outline"
              size={16}
              color={theme.text + "80"}
            />
            <Text style={[styles.metaText, { color: theme.text + "80" }]}>
              {job.number_of_employee} People
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="cash-outline" size={16} color={theme.text + "80"} />
            <Text style={[styles.metaText, { color: theme.text + "80" }]}>
              {job.post.price}
            </Text>
          </View>
        </View>
        <View style={styles.jobMeta}>
          <View style={styles.metaItem}>
            <Ionicons
              name="calendar-outline"
              size={16}
              color={theme.text + "80"}
            />
            <Text style={[styles.metaText, { color: theme.text + "80" }]}>
              Posted {new Date(job.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "details" && {
              borderBottomColor: theme.accent,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setActiveTab("details")}
        >
          <Text
            style={[
              styles.tabButtonText,
              {
                color:
                  activeTab === "details" ? theme.accent : theme.text + "80",
              },
            ]}
          >
            Details
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "applicants" && {
              borderBottomColor: theme.accent,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setActiveTab("applicants")}
        >
          <Text
            style={[
              styles.tabButtonText,
              {
                color:
                  activeTab === "applicants" ? theme.accent : theme.text + "80",
              },
            ]}
          >
            Applicants ({job.post?.applications?.length || 0})
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "details" ? (
        <ScrollView
          style={styles.content}
          contentContainerStyle={{ paddingBottom: 20 }}
          bounces={false}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={async () => {
                await refetch();
                fetchJobDetails(jobId);
              }}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Job Description
            </Text>
            <Text style={[styles.description, { color: theme.text + "90" }]}>
              {job.post.description}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Required Skills
            </Text>
            {JSON.parse(job.post?.required_skills).map(
              (requirement: any, index: number) => (
                <View key={index} style={styles.listItem}>
                  <View
                    style={[
                      styles.bulletPoint,
                      { backgroundColor: theme.accent },
                    ]}
                  />
                  <Text
                    style={[styles.listItemText, { color: theme.text + "90" }]}
                  >
                    {requirement}
                  </Text>
                </View>
              )
            )}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Requirements
            </Text>
            {JSON.parse(job?.post?.requirements)?.map((requirement: any, index: number) => (
              <View key={index} style={styles.listItem}>
                <View
                  style={[
                    styles.bulletPoint,
                    { backgroundColor: theme.accent },
                  ]}
                />
                <Text
                  style={[styles.listItemText, { color: theme.text + "90" }]}
                >
                  {requirement}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Benefits
            </Text>
            {JSON.parse(job?.post?.benefits)?.map((benefit: any, index: number) => (
              <View key={index} style={styles.listItem}>
                <View
                  style={[
                    styles.bulletPoint,
                    { backgroundColor: theme.accent },
                  ]}
                />
                <Text
                  style={[styles.listItemText, { color: theme.text + "90" }]}
                >
                  {benefit}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[styles.editButton, { backgroundColor: theme.accent }]}
            >
              <Ionicons name="create-outline" size={20} color="#FFFFFF" />
              <Text style={styles.editButtonText}>Edit Job</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.closeButton, { borderColor: "#EF4444" }]}
              onPress={handleCloseJob}
            >
              <Text style={[styles.closeButtonText, { color: "#EF4444" }]}>
                Close Job
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <View style={styles.applicantsContainer}>
          <View style={styles.applicantsHeader}>
            <Text style={[styles.applicantsCount, { color: theme.text }]}>
              {job.post?.applications?.length || 0} Applicant
              {job.post?.applications?.length !== 1 ? "s" : ""}
            </Text>
            <TouchableOpacity
              style={[styles.filterButton, { borderColor: theme.border }]}
            >
              <Ionicons name="filter-outline" size={18} color={theme.text} />
              <Text style={[styles.filterButtonText, { color: theme.text }]}>
                Filter
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={job?.post?.applications}
            renderItem={renderApplicantItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.applicantsList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  moreButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  jobHeader: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  jobTitle: {
    fontSize: 22,
    fontFamily: "Poppins-Bold",
    marginBottom: 12,
  },
  jobMeta: {
    flexDirection: "row",
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 5,
  },
  metaText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginLeft: 6,
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 22,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginRight: 10,
  },
  listItemText: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 30,
  },
  editButton: {
    flex: 1,
    flexDirection: "row",
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
    marginLeft: 8,
  },
  closeButton: {
    flex: 1,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  applicantsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  applicantsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  applicantsCount: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginLeft: 5,
  },
  applicantsList: {
    paddingBottom: 20,
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
    marginBottom: 4,
  },
  appliedDate: {
    fontSize: 12,
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
});

export default withAuth(JobDetailsScreen);
