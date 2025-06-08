"use client";

import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import type { CompanyStackParamList } from "../../navigation/CompanyNavigator";
import withAuth from "@/src/hoc/withAuth";
import { useDashboard } from "@/src/contexts/Company/DashboardContext";
import LoadingScreen from "../common/LoadingScreen";
import { Job } from "@/src/types/Job";

type CompanyJobsScreenNavigationProp =
  StackNavigationProp<CompanyStackParamList>;

const CompanyJobsScreen = () => {
  const navigation = useNavigation<CompanyJobsScreenNavigationProp>();
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const { filteredData, isLoading, setSearchQuery, searchQuery, refetch } =
    useDashboard();

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await refetch();
      console.log("Data refreshed successfully");
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  useEffect(() => {
    if (!filteredData?.jobs) {
      setFilteredJobs([]);
      return;
    }

    if (activeFilter === "all") {
      setFilteredJobs(filteredData.jobs);
    } else {
      const filtered = filteredData.jobs.filter(
        (job: Job) => job.status === activeFilter
      );
      setFilteredJobs(filtered);
    }
  }, [activeFilter, filteredData?.jobs]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "#10B981";
      case "closed":
        return "#EF4444";
      case "draft":
        return "#F59E0B";
      default:
        return theme.text;
    }
  };

  const renderJobItem = ({ item }: { item: Job }) => (
    <TouchableOpacity
      style={[styles.jobCard, { backgroundColor: theme.card }]}
      onPress={() => navigation.navigate("JobDetails", { jobId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.jobHeader}>
        <Text style={[styles.jobTitle, { color: theme.text }]}>
          {item?.post?.title}
        </Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: getStatusColor(item?.status) + "20",
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color: getStatusColor(item?.status),
              },
            ]}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <Text
        style={[styles.jobDescription, { color: theme.text + "80" }]}
        numberOfLines={2}
      >
        {item?.post?.description}
      </Text>

      <View style={styles.jobDetails}>
        <View style={styles.jobDetail}>
          <Ionicons
            name="briefcase-outline"
            size={16}
            color={theme.text + "80"}
          />
          <Text
            style={[
              styles.jobDetailText,
              { color: theme.text + "80", textTransform: "capitalize" },
            ]}
          >
            {item.type_job}
          </Text>
        </View>

        <View style={styles.jobDetail}>
          <Ionicons
            name="location-outline"
            size={16}
            color={theme.text + "80"}
          />
          <Text
            style={[
              styles.jobDetailText,
              { color: theme.text + "80", textTransform: "uppercase" },
            ]}
          >
            {item.system}
          </Text>
        </View>
      </View>

      <View style={styles.jobFooter}>
        <View style={styles.jobDetail}>
          <Ionicons name="people-outline" size={16} color={theme.text + "80"} />
          <Text style={[styles.jobDetailText, { color: theme.text + "80" }]}>
            {item.post.applications_count} Applicants
          </Text>
        </View>

        <View style={styles.jobDetail}>
          <Ionicons name="time-outline" size={16} color={theme.text + "80"} />
          <Text style={[styles.jobDetailText, { color: theme.text + "80" }]}>
            Posted {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const filterOptions = [
    { id: "all", label: "All Jobs" },
    { id: "open", label: "Active" },
    { id: "closed", label: "Closed" },
    { id: "draft", label: "Draft" },
  ];

  const HeaderComponent = () => (
    <>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Manage Jobs</Text>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: theme.accent }]}
          onPress={() => navigation.navigate("CreateJob")}
        >
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.createButtonText}>Create Job</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <Ionicons name="search" size={20} color={theme.text + "80"} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search jobs..."
          placeholderTextColor={theme.text + "60"}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={theme.text + "80"} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filtersContainer}>
        <ScrollableFilters />
      </View>
    </>
  );

  const ScrollableFilters = () => (
    <FlatList
      data={filterOptions}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.filtersList}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={[
            styles.filterItem,
            {
              backgroundColor:
                activeFilter === item.id ? theme.accent : theme.card,
            },
          ]}
          onPress={() => setActiveFilter(item.id)}
        >
          <Text
            style={[
              styles.filterText,
              {
                color: activeFilter === item.id ? "#FFFFFF" : theme.text,
              },
            ]}
          >
            {item.label}
          </Text>
        </TouchableOpacity>
      )}
    />
  );

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="briefcase-outline" size={50} color={theme.text + "40"} />
      <Text style={[styles.emptyText, { color: theme.text }]}>
        No jobs found
      </Text>
      <Text style={[styles.emptySubtext, { color: theme.text + "80" }]}>
        {activeFilter === "all"
          ? "You haven't posted any jobs yet"
          : `You don't have any ${activeFilter} jobs`}
      </Text>
      <TouchableOpacity
        style={[styles.emptyButton, { backgroundColor: theme.accent }]}
        onPress={() => navigation.navigate("CreateJob")}
      >
        <Text style={styles.emptyButtonText}>Create a Job</Text>
      </TouchableOpacity>
    </View>
  );

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        data={filteredJobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={HeaderComponent}
        ListEmptyComponent={EmptyComponent}
        contentContainerStyle={[
          styles.jobsList, 
          filteredJobs.length === 0 && styles.emptyListContainer
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.accent]}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
    flexGrow: 1, // Ini memastikan bahwa container bisa di-scroll penuh
    backgroundColor: 'transparent',
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    marginLeft: 5,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    height: 50,
    borderRadius: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filtersList: {
    gap: 15
  },
  filterItem: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },
  jobsList: {
    padding: 16,
    paddingTop: 0,
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
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  jobDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 15,
    lineHeight: 20,
  },
  jobDetails: {
    flexDirection: "row",
    marginBottom: 10,
    columnGap: 5,
  },
  jobFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
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
  emptyButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },
});

export default withAuth(CompanyJobsScreen);
