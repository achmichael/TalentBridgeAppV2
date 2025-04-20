"use client"

import { useState } from "react"
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
  Platform,
} from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useNavigation } from "@react-navigation/native"
import { useTheme } from "../../contexts/ThemeContext"
import { useQuery } from "@tanstack/react-query";


// Mock API call
const fetchJobs = async (searchQuery = "", filter = "all") => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock data
  const allJobs = [
    { 
      id: '1', 
      title: 'Senior React Native Developer', 
      company: 'TechCorp Inc.', 
      location: 'Remote',
      type: 'Full-time',
      status: 'active',
      applicants: 24,
      postedAt: '2023-06-15',
      salary: '$80,000 - $120,000'
    },
    { 
      id: '2', 
      title: 'UI/UX Designer', 
      company: 'DesignHub', 
      location: 'New York, NY',
      type: 'Contract',
      status: 'active',
      applicants: 18,
      postedAt: '2023-06-10',
      salary: '$70,000 - $90,000'
    },
    { 
      id: '3', 
      title: 'Backend Developer', 
      company: 'ServerStack', 
      location: 'San Francisco, CA',
      type: 'Full-time',
      status: 'active',
      applicants: 32,
      postedAt: '2023-06-05',
      salary: '$90,000 - $130,000'
    },
    { 
      id: '4', 
      title: 'Product Manager', 
      company: 'InnovateCo', 
      location: 'Austin, TX',
      type: 'Full-time',
      status: 'active',
      applicants: 15,
      postedAt: '2023-06-01',
      salary: '$100,000 - $140,000'
    },
    { 
      id: '5', 
      title: 'DevOps Engineer', 
      company: 'CloudSys', 
      location: 'Chicago, IL',
      type: 'Full-time',
      status: 'paused',
      applicants: 9,
      postedAt: '2023-05-28',
      salary: '$85,000 - $115,000'
    },
    { 
      id: '6', 
      title: 'Content Writer', 
      company: 'MediaGroup', 
      location: 'Remote',
      type: 'Part-time',
      status: 'active',
      applicants: 41,
      postedAt: '2023-05-25',
      salary: '$40,000 - $60,000'
    },
    { 
      id: '7', 
      title: 'Data Scientist', 
      company: 'AnalyticsPro', 
      location: 'Boston, MA',
      type: 'Full-time',
      status: 'active',
      applicants: 27,
      postedAt: '2023-05-20',
      salary: '$95,000 - $135,000'
    },
    { 
      id: '8', 
      title: 'Mobile App Tester', 
      company: 'QualityApps', 
      location: 'Seattle, WA',
      type: 'Contract',
      status: 'closed',
      applicants: 12,
      postedAt: '2023-05-15',
      salary: '$60,000 - $80,000'
    },
    { 
      id: '9', 
      title: 'Frontend Developer', 
      company: 'WebFront', 
      location: 'Remote',
      type: 'Full-time',
      status: 'active',
      applicants: 36,
      postedAt: '2023-05-10',
      salary: '$75,000 - $110,000'
    },
    { 
      id: '10', 
      title: 'Project Coordinator', 
      company: 'ManagePro', 
      location: 'Denver, CO',
      type: 'Full-time',
      status: 'paused',
      applicants: 8,
      postedAt: '2023-05-05',
      salary: '$55,000 - $75,000'
    },
  ];

  // Filter by search query
  let filteredJobs = allJobs
  if (searchQuery) {
    filteredJobs = allJobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }

  // Filter by status
  if (filter !== "all") {
    if (["active", "paused", "closed"].includes(filter)) {
      filteredJobs = filteredJobs.filter((job) => job.status === filter)
    } else if (["Full-time", "Part-time", "Contract"].includes(filter)) {
      filteredJobs = filteredJobs.filter((job) => job.type === filter)
    } else if (filter === "Remote") {
      filteredJobs = filteredJobs.filter((job) => job.location === "Remote")
    }
  }

  return filteredJobs
}

const AdminJobsScreen = () => {
  const { theme } = useTheme()
  const navigation = useNavigation()
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState("all")
  const [refreshing, setRefreshing] = useState(false)

  const {
    data: jobs,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["jobs", searchQuery, filter],
    queryFn: () => fetchJobs(searchQuery, filter),
  })

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#2ECC71"
      case "paused":
        return "#F39C12"
      case "closed":
        return "#95A5A6"
      default:
        return theme.textSecondary
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Full-time":
        return "#3498DB"
      case "Part-time":
        return "#9B59B6"
      case "Contract":
        return "#1ABC9C"
      default:
        return theme.textSecondary
    }
  }

  const renderJobItem = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.jobCard, { backgroundColor: theme.cardBackground }]}
    //   @ts-ignore
      onPress={() => navigation.navigate("JobDetails", { jobId: item.id })}
    >
      <View style={styles.jobHeader}>
        <Text style={[styles.jobTitle, { color: theme.text }]}>{item.title}</Text>
        <View style={[styles.statusContainer, { backgroundColor: getStatusColor(item.status) + "20" }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.companyContainer}>
        <Text style={[styles.companyName, { color: theme.text }]}>{item.company}</Text>
      </View>

      <View style={styles.jobMeta}>
        <View style={styles.metaItem}>
          <Ionicons name="location-outline" size={16} color={theme.textSecondary} />
          <Text style={[styles.metaText, { color: theme.textSecondary }]}>{item.location}</Text>
        </View>

        <View style={[styles.typeContainer, { backgroundColor: getTypeColor(item.type) + "20" }]}>
          <Text style={[styles.typeText, { color: getTypeColor(item.type) }]}>{item.type}</Text>
        </View>
      </View>

      <View style={styles.jobFooter}>
        <View style={styles.footerItem}>
          <Ionicons name="people-outline" size={16} color={theme.textSecondary} />
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>{item.applicants} applicants</Text>
        </View>

        <View style={styles.footerItem}>
          <Ionicons name="calendar-outline" size={16} color={theme.textSecondary} />
          <Text style={[styles.footerText, { color: theme.textSecondary }]}>
            Posted: {new Date(item.postedAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View style={styles.salaryContainer}>
        <MaterialIcons name="attach-money" size={16} color={theme.primary} />
        <Text style={[styles.salaryText, { color: theme.primary }]}>{item.salary}</Text>
      </View>
    </TouchableOpacity>
  )

  const FilterButton = ({ label, value }: { label: string, value: string}) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        {
          backgroundColor: filter === value ? theme.primary : theme.cardBackground,
          borderColor: theme.border,
        },
      ]}
      onPress={() => setFilter(value)}
    >
      <Text style={[styles.filterButtonText, { color: filter === value ? "#fff" : theme.text }]}>{label}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: Platform.OS === 'ios' ? 30 : 40}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Manage Jobs</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={[styles.searchContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <Ionicons name="search" size={20} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search jobs..."
          placeholderTextColor={theme.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <FilterButton label="All" value="all" />
          <FilterButton label="Active" value="active" />
          <FilterButton label="Paused" value="paused" />
          <FilterButton label="Closed" value="closed" />
          <FilterButton label="Full-time" value="Full-time" />
          <FilterButton label="Part-time" value="Part-time" />
          <FilterButton label="Contract" value="Contract" />
          <FilterButton label="Remote" value="Remote" />
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>Loading jobs...</Text>
        </View>
      ) : (
        <>
          <View style={styles.resultsContainer}>
            <Text style={[styles.resultsText, { color: theme.textSecondary }]}>{jobs?.length || 0} jobs found</Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.primary }]}
              onPress={() => {
                // Handle adding new job
                alert("Add new job functionality would go here")
              }}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add Job</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={jobs}
            renderItem={renderJobItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="briefcase" size={60} color={theme.textSecondary} />
                <Text style={[styles.emptyText, { color: theme.text }]}>No jobs found</Text>
                <Text style={[styles.emptySubtext, { color: theme.textSecondary }]}>
                  Try adjusting your search or filters
                </Text>
              </View>
            }
          />
        </>
      )}
    </View>
  )
}

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
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  filtersContainer: {
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
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "500",
    marginLeft: 5,
  },
  listContainer: {
    paddingBottom: 20,
  },
  jobCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 10,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "500",
  },
  companyContainer: {
    marginBottom: 8,
  },
  companyName: {
    fontSize: 14,
    fontWeight: "500",
  },
  jobMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
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
  jobFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    marginLeft: 5,
  },
  salaryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  salaryText: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
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
})

export default AdminJobsScreen
