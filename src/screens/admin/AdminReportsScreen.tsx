"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Platform
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../contexts/ThemeContext";
import { useQuery } from "@tanstack/react-query";

// Mock API call
const fetchReports = async (searchQuery = "", filter = "all") => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock data
  const allReports = [
    {
      id: "1",
      title: "Inappropriate job posting",
      reportedBy: "John Doe",
      reportedUser: "TechCorp Inc.",
      type: "job",
      status: "pending",
      priority: "high",
      createdAt: "2023-06-15",
      description:
        "This job posting contains misleading information about the salary and benefits.",
    },
    {
      id: "2",
      title: "Fake profile",
      reportedBy: "Jane Smith",
      reportedUser: "Mark Wilson",
      type: "user",
      status: "pending",
      priority: "medium",
      createdAt: "2023-06-12",
      description:
        "This user profile appears to be fake with stolen portfolio items.",
    },
    {
      id: "3",
      title: "Harassment in messages",
      reportedBy: "Emily Davis",
      reportedUser: "Robert Johnson",
      type: "message",
      status: "investigating",
      priority: "high",
      createdAt: "2023-06-10",
      description:
        "This user has been sending harassing messages after a job rejection.",
    },
    {
      id: "4",
      title: "Spam job postings",
      reportedBy: "Michael Brown",
      reportedUser: "QuickHire LLC",
      type: "job",
      status: "resolved",
      priority: "low",
      createdAt: "2023-06-08",
      description:
        "This company is posting the same job multiple times with slight variations.",
    },
    {
      id: "5",
      title: "Payment dispute",
      reportedBy: "Sarah Wilson",
      reportedUser: "DesignHub",
      type: "payment",
      status: "investigating",
      priority: "medium",
      createdAt: "2023-06-05",
      description:
        "The client refused to pay after the work was completed according to requirements.",
    },
    {
      id: "6",
      title: "Copyright infringement",
      reportedBy: "David Taylor",
      reportedUser: "Lisa Anderson",
      type: "portfolio",
      status: "pending",
      priority: "high",
      createdAt: "2023-06-03",
      description:
        "This user has copied my portfolio work and is presenting it as their own.",
    },
    {
      id: "7",
      title: "Scam job posting",
      reportedBy: "James Martin",
      reportedUser: "Global Opportunities",
      type: "job",
      status: "resolved",
      priority: "high",
      createdAt: "2023-05-30",
      description:
        "This job posting is asking for payment to apply, which appears to be a scam.",
    },
    {
      id: "8",
      title: "Inappropriate profile picture",
      reportedBy: "Jennifer Clark",
      reportedUser: "Thomas White",
      type: "user",
      status: "resolved",
      priority: "low",
      createdAt: "2023-05-28",
      description:
        "The profile picture contains inappropriate content that violates platform guidelines.",
    },
    {
      id: "9",
      title: "Fraudulent company",
      reportedBy: "Robert Lewis",
      reportedUser: "InnovateTech",
      type: "company",
      status: "investigating",
      priority: "high",
      createdAt: "2023-05-25",
      description:
        "This company does not appear to be legitimate and may be collecting personal information.",
    },
    {
      id: "10",
      title: "Abusive language in review",
      reportedBy: "Patricia Moore",
      reportedUser: "Kevin Harris",
      type: "review",
      status: "pending",
      priority: "medium",
      createdAt: "2023-05-22",
      description:
        "The review contains abusive language and personal attacks rather than professional feedback.",
    },
  ];

  // Filter by search query
  let filteredReports = allReports;
  if (searchQuery) {
    filteredReports = allReports.filter(
      (report) =>
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.reportedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.reportedUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Filter by status or type
  if (filter !== "all") {
    if (["pending", "investigating", "resolved"].includes(filter)) {
      filteredReports = filteredReports.filter(
        (report) => report.status === filter
      );
    } else if (["high", "medium", "low"].includes(filter)) {
      filteredReports = filteredReports.filter(
        (report) => report.priority === filter
      );
    } else if (
      [
        "job",
        "user",
        "message",
        "payment",
        "portfolio",
        "company",
        "review",
      ].includes(filter)
    ) {
      filteredReports = filteredReports.filter(
        (report) => report.type === filter
      );
    }
  }

  return filteredReports;
};

const AdminReportsScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: reports,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["reports", searchQuery, filter],
    queryFn: () => fetchReports(searchQuery, filter),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#F39C12";
      case "investigating":
        return "#3498DB";
      case "resolved":
        return "#2ECC71";
      default:
        return theme.textSecondary;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "#E74C3C";
      case "medium":
        return "#F39C12";
      case "low":
        return "#3498DB";
      default:
        return theme.textSecondary;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "job":
        return "briefcase";
      case "user":
        return "person";
      case "message":
        return "chatbubble";
      case "payment":
        return "card";
      case "portfolio":
        return "images";
      case "company":
        return "business";
      case "review":
        return "star";
      default:
        return "alert-circle";
    }
  };

  const renderReportItem = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.reportCard, { backgroundColor: theme.cardBackground }]}
      onPress={() =>
        //   @ts-ignore
        navigation.navigate("ReportDetails", { reportId: item.id })
      }
    >
      <View style={styles.reportHeader}>
        <View style={styles.reportTitleContainer}>
          <Ionicons
            name={getTypeIcon(item.type)}
            size={20}
            color={theme.primary}
            style={styles.typeIcon}
          />
          <Text
            style={[styles.reportTitle, { color: theme.text }]}
            numberOfLines={1}
          >
            {item.title}
          </Text>
        </View>
        <View
          style={[
            styles.priorityContainer,
            { backgroundColor: getPriorityColor(item.priority) + "20" },
          ]}
        >
          <Text
            style={[
              styles.priorityText,
              { color: getPriorityColor(item.priority) },
            ]}
          >
            {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.reportInfo}>
        <Text style={[styles.reportInfoText, { color: theme.textSecondary }]}>
          Reported by:{" "}
          <Text style={{ fontWeight: "500", color: theme.text }}>
            {item.reportedBy}
          </Text>
        </Text>
        <Text style={[styles.reportInfoText, { color: theme.textSecondary }]}>
          Against:{" "}
          <Text style={{ fontWeight: "500", color: theme.text }}>
            {item.reportedUser}
          </Text>
        </Text>
      </View>

      <Text
        style={[styles.reportDescription, { color: theme.text }]}
        numberOfLines={2}
      >
        {item.description}
      </Text>

      <View style={styles.reportFooter}>
        <View
          style={[
            styles.statusContainer,
            { backgroundColor: getStatusColor(item.status) + "20" },
          ]}
        >
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>

        <Text style={[styles.dateText, { color: theme.textSecondary }]}>
          Reported: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const FilterButton = ({ label, value }: { label: string; value: string }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor:
            filter === value ? theme.primary : theme.cardBackground,
          borderColor: theme.border,
        },
      ]}
      onPress={() => setFilter(value)}
    >
      <Text
        style={[
          styles.filterButtonText,
          { color: filter === value ? "#fff" : theme.text },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: Platform.OS === 'ios' ? 30 : 40 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Manage Reports
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View
        style={[
          styles.searchContainer,
          { backgroundColor: theme.cardBackground, borderColor: theme.border },
        ]}
      >
        <Ionicons name="search" size={20} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search reports..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons
              name="close-circle"
              size={20}
              color={theme.textSecondary}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FilterButton label="All" value="all" />
          <FilterButton label="Pending" value="pending" />
          <FilterButton label="Investigating" value="investigating" />
          <FilterButton label="Resolved" value="resolved" />
          <FilterButton label="High Priority" value="high" />
          <FilterButton label="Medium Priority" value="medium" />
          <FilterButton label="Low Priority" value="low" />
        </ScrollView>
      </View>

      <View style={styles.typeFiltersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FilterButton label="Jobs" value="job" />
          <FilterButton label="Users" value="user" />
          <FilterButton label="Messages" value="message" />
          <FilterButton label="Payments" value="payment" />
          <FilterButton label="Portfolios" value="portfolio" />
          <FilterButton label="Companies" value="company" />
          <FilterButton label="Reviews" value="review" />
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Loading reports...
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.resultsContainer}>
            <Text style={[styles.resultsText, { color: theme.textSecondary }]}>
              {reports?.length || 0} reports found
            </Text>
          </View>

          <FlatList
            data={reports}
            renderItem={renderReportItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={[theme.primary]}
              />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="flag" size={60} color={theme.textSecondary} />
                <Text style={[styles.emptyText, { color: theme.text }]}>
                  No reports found
                </Text>
                <Text
                  style={[styles.emptySubtext, { color: theme.textSecondary }]}
                >
                  Try adjusting your search or filters
                </Text>
              </View>
            }
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    // paddingVertical: 10,
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filtersContainer: {
    marginBottom: 10,
  },
  typeFiltersContainer: {
    marginBottom: 15,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },
  filterButtonText: {
    fontWeight: "500",
  },
  resultsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  resultsText: {
    fontSize: 14,
  },
  listContainer: {
    paddingBottom: 20,
  },
  reportCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  reportTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  typeIcon: {
    marginRight: 8,
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  priorityContainer: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 10,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "500",
  },
  reportInfo: {
    marginBottom: 10,
  },
  reportInfoText: {
    fontSize: 14,
    marginBottom: 3,
  },
  reportDescription: {
    fontSize: 14,
    marginBottom: 12,
  },
  reportFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  dateText: {
    fontSize: 12,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 10,
    textAlign: "center",
  },
});

export default AdminReportsScreen;
