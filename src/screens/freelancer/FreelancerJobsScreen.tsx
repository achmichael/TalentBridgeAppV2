"use client";

import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import type { FreelancerStackParamList } from "../../navigation/FreelancerNavigator";
import withAuth from "@/src/hoc/withAuth";
import { useDashboard } from "@/src/contexts/Freelancer/DashboardContext";
import type { Job } from "@/src/types/Job";
import { set } from "date-fns";

type FreelancerJobsScreenNavigationProp =
  StackNavigationProp<FreelancerStackParamList>;

const FreelancerJobsScreen = () => {
  const navigation = useNavigation<FreelancerJobsScreenNavigationProp>();
  const { theme } = useTheme();
  const [activeFilter, setActiveFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);
  const { filteredData, isLoading, refetch, searchQuery, setSearchQuery } =
    useDashboard();
  const [jobs, setJobs] = useState<Job[]>([]);
  // store original jobs will return when all filter is selected after filtering by other categories
  const [originalJobs, setOriginalJobs] = useState<Job[]>([]);
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    try {
      if (filteredData?.jobs && Array.isArray(filteredData.jobs)) {
        const mappedJobs = filteredData.jobs.map((job: any) => {
          if (!job.post) {
            return {
              id: job.id || `job-${Math.random().toString(36).substr(2, 9)}`,
              title: job.title || "Untitled Job",
              budget: job.price || 0,
              description: job.description || "",
              client: {
                id: job.user?.id || "unknown",
                name: job.user?.username || "Unknown Client",
                avatar:
                  job.user?.profile_picture ||
                  "https://i.pinimg.com/736x/ed/1f/41/ed1f41959e7e9aa7fb0a18b76c6c2755.jpg",
                rating: job.user?.rating || 4.5,
              },
              skills: typeof job?.required_skills === "string"
              ? JSON.parse(job.required_skills || "[]")
              : job?.required_skills || [],
              postedAt: job.created_at || new Date().toISOString(),
              deadline:
                job.deadline ||
                new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            };
          }

          return {
            id: job.id || `job-${Math.random().toString(36).substr(2, 9)}`,
            title: job.post?.title || "Untitled Job",
            budget: job.post?.price || 0,
            description: job.post?.description || "",
            client: {
              id: job.post?.user?.id || "unknown",
              name: job.post?.user?.username || "Unknown Client",
              avatar:
                job.post?.user?.profile_picture ||
                "https://i.pinimg.com/736x/ed/1f/41/ed1f41959e7e9aa7fb0a18b76c6c2755.jpg",
              rating: job.post?.user?.rating || 4.5,
            },
            skills: typeof job?.post.required_skills === "string"
              ? JSON.parse(job.post.required_skills || "[]")
              : job?.post.required_skills || [],
            postedAt:
              job.post?.created_at ||
              job.created_at ||
              new Date().toISOString(),
            deadline:
              job.post?.deadline ||
              new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          };
        });

        setJobs(mappedJobs);
        setOriginalJobs(mappedJobs);
      } else {
        setJobs([]);
        setOriginalJobs([]);
      }
    } catch (error) {
      console.error("Failed to process jobs data:", error);
      setJobs([]);
    }
  }, [filteredData]);

  const renderJobItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.jobCard, { backgroundColor: theme.card }]}
      onPress={() => navigation.navigate("JobDetails", { jobId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.jobHeader}>
        <Text style={[styles.jobTitle, { color: theme.text }]}>
          {item.title}
        </Text>
        <Text style={[styles.jobBudget, { color: theme.secondary }]}>
          ${item.budget}
        </Text>
      </View>

      <View style={styles.clientRow}>
        <TouchableOpacity
          style={styles.clientInfo}
          onPress={() =>
            navigation.navigate("ClientProfile", { clientId: item.client.id })
          }
        >
          <Image
            source={{ uri: item.client.avatar }}
            style={styles.clientAvatar}
          />
          <Text style={[styles.clientName, { color: theme.text + "80", textTransform: 'capitalize', width: 100 }]}>
            {item.client.name}
          </Text>
        </TouchableOpacity>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFD700" />
          <Text style={[styles.ratingText, { color: theme.text }]}>
            {item.client.rating}
          </Text>
        </View>
      </View>

      <Text
        style={[styles.jobDescription, { color: theme.text + "80" }]}
        numberOfLines={2}
      >
        {item.description}
      </Text>

      <View style={styles.skillsContainer}>
        {item.skills.map((skill: string, index: number) => (
          <View
            key={index}
            style={[
              styles.skillBadge,
              { backgroundColor: theme.secondary + "20" },
            ]}
          >
            <Text style={[styles.skillText, { color: theme.secondary }]}>
              {skill}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.jobFooter}>
        <View style={styles.jobDetail}>
          <Ionicons name="time-outline" size={14} color={theme.text + "80"} />
          <Text style={[styles.jobDetailText, { color: theme.text + "80" }]}>
            Posted {new Date(item.postedAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.jobDetail}>
          <Ionicons
            name="calendar-outline"
            size={14}
            color={theme.text + "80"}
          />
          <Text style={[styles.jobDetailText, { color: theme.text + "80" }]}>
            Due {new Date(item.deadline).toLocaleDateString()}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const filterOptions = [
    { id: "all", label: "All Jobs" },
    { id: "mobile", label: "Mobile Development" },
    { id: "design", label: "Design" },
    { id: "backend", label: "Backend" },
    { id: "full stack", label: "Full Stack" },
  ];

  useEffect(() => {
    if (activeFilter === "all") {
      setJobs(originalJobs);
    } else {
      const categoryFilteredJobs = jobs.filter((job: any) => {
        const categoryName =
          job.category?.category_name ||
          (job.post?.category?.category_name || "").toLowerCase();

        return categoryName.toLowerCase().includes(activeFilter.toLowerCase());
      });

      console.log(
        `Filtered by category '${activeFilter}':`,
        categoryFilteredJobs
      );

      setJobs(categoryFilteredJobs);
    }
  }, [activeFilter]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Find Jobs</Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <Ionicons name="search" size={20} color={theme.text + "80"} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search for jobs..."
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
        <ScrollableFilters
          options={filterOptions}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          theme={theme}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.secondary} />
        </View>
      ) : jobs && jobs.length > 0 ? (
        <FlatList
          data={jobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.jobsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.secondary]}
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={50} color={theme.text + "40"} />
          <Text style={[styles.emptyText, { color: theme.text }]}>
            No jobs found
          </Text>
          <Text style={[styles.emptySubtext, { color: theme.text + "80" }]}>
            Try adjusting your search or filters
          </Text>
        </View>
      )}
    </View>
  );
};

interface ScrollableFiltersProps {
  options: Array<{ id: string; label: string }>;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  theme: any;
}

const ScrollableFilters: React.FC<ScrollableFiltersProps> = ({
  options,
  activeFilter,
  onFilterChange,
  theme,
}) => {
  return (
    <FlatList
      data={options}
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
                activeFilter === item.id ? theme.secondary : theme.card,
            },
          ]}
          onPress={() => onFilterChange(item.id)}
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
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
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
    paddingHorizontal: 16,
  },
  filterItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  jobBudget: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
  },
  clientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  clientInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  clientAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  clientName: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
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
});

export default withAuth(FreelancerJobsScreen);
