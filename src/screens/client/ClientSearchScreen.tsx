"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import type { StackNavigationProp } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"
import type { ClientStackParamList } from "../../navigation/ClientNavigator"
import { useQuery } from "@tanstack/react-query"
import FreelancerCard from "../../components/client/FreelancerCard"
import withAuth from "@/src/hoc/withAuth"

type ClientSearchScreenNavigationProp = StackNavigationProp<ClientStackParamList>

// Mock data fetching function
const searchFreelancers = async (query = "", filter = "all") => {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const allFreelancers = [
    {
      id: "1",
      name: "John Doe",
      title: "Full Stack Developer",
      rating: 4.8,
      hourlyRate: 25,
      avatar: "https://ui-avatars.com/api/?name=John+Doe",
      skills: ["React", "Node.js", "MongoDB"],
      category: "Development",
    },
    {
      id: "2",
      name: "Jane Smith",
      title: "UI/UX Designer",
      rating: 4.9,
      hourlyRate: 30,
      avatar: "https://ui-avatars.com/api/?name=Jane+Smith",
      skills: ["Figma", "Adobe XD", "Sketch"],
      category: "Design",
    },
    {
      id: "3",
      name: "Mike Johnson",
      title: "Mobile Developer",
      rating: 4.7,
      hourlyRate: 28,
      avatar: "https://ui-avatars.com/api/?name=Mike+Johnson",
      skills: ["React Native", "Flutter", "Swift"],
      category: "Development",
    },
    {
      id: "4",
      name: "Sarah Williams",
      title: "Content Writer",
      rating: 4.6,
      hourlyRate: 22,
      avatar: "https://ui-avatars.com/api/?name=Sarah+Williams",
      skills: ["Copywriting", "SEO", "Blogging"],
      category: "Writing",
    },
    {
      id: "5",
      name: "David Brown",
      title: "Digital Marketer",
      rating: 4.5,
      hourlyRate: 26,
      avatar: "https://ui-avatars.com/api/?name=David+Brown",
      skills: ["SEO", "Social Media", "Google Ads"],
      category: "Marketing",
    },
    {
      id: "6",
      name: "Emily Davis",
      title: "Graphic Designer",
      rating: 4.8,
      hourlyRate: 27,
      avatar: "https://ui-avatars.com/api/?name=Emily+Davis",
      skills: ["Photoshop", "Illustrator", "InDesign"],
      category: "Design",
    },
  ]

  // Filter freelancers based on search query
  let filteredFreelancers = allFreelancers
  if (query) {
    filteredFreelancers = allFreelancers.filter(
      (freelancer) =>
        freelancer.name.toLowerCase().includes(query.toLowerCase()) ||
        freelancer.title.toLowerCase().includes(query.toLowerCase()) ||
        freelancer.skills.some((skill) => skill.toLowerCase().includes(query.toLowerCase())),
    )
  }

  // Apply category filter
  if (filter !== "all") {
    filteredFreelancers = filteredFreelancers.filter((freelancer) => freelancer.category === filter)
  }

  return filteredFreelancers
}

const ClientSearchScreen = () => {
  const navigation = useNavigation<ClientSearchScreenNavigationProp>()
  const { theme } = useTheme()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeFilter, setActiveFilter] = useState("all")
  const [refreshing, setRefreshing] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const {
    data: freelancers,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["searchFreelancers", searchQuery, activeFilter],
    queryFn: () => searchFreelancers(searchQuery, activeFilter),
  })

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  const filterOptions = [
    { id: "all", label: "All Categories" },
    { id: "Development", label: "Development" },
    { id: "Design", label: "Design" },
    { id: "Marketing", label: "Marketing" },
    { id: "Writing", label: "Writing" },
  ]

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Find Freelancers</Text>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <Ionicons name="search" size={20} color={theme.text + "80"} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search for freelancers or skills..."
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
                  backgroundColor: activeFilter === item.id ? theme.primary : theme.card,
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

        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.viewToggleButton,
              {
                backgroundColor: viewMode === "grid" ? theme.primary : theme.card,
              },
            ]}
            onPress={() => setViewMode("grid")}
          >
            <Ionicons name="grid-outline" size={18} color={viewMode === "grid" ? "#FFFFFF" : theme.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewToggleButton,
              {
                backgroundColor: viewMode === "list" ? theme.primary : theme.card,
              },
            ]}
            onPress={() => setViewMode("list")}
          >
            <Ionicons name="list-outline" size={18} color={viewMode === "list" ? "#FFFFFF" : theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : freelancers && freelancers.length > 0 ? (
        <FlatList
          data={freelancers}
          renderItem={({ item }) => (
            <FreelancerCard
              freelancer={item}
              onPress={() => navigation.navigate("FreelancerProfile", { freelancerId: item.id })}
            />
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.freelancersList,
            viewMode === "grid" && { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
          ]}
          numColumns={viewMode === "grid" ? 2 : 1}
          key={viewMode} // Force re-render when view mode changes
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.primary]} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={50} color={theme.text + "40"} />
          <Text style={[styles.emptyText, { color: theme.text }]}>No freelancers found</Text>
          <Text style={[styles.emptySubtext, { color: theme.text + "80" }]}>Try adjusting your search or filters</Text>
        </View>
      )}
    </View>
  )
}

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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    paddingRight: 16,
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
  viewToggle: {
    flexDirection: "row",
  },
  viewToggleButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  freelancersList: {
    padding: 16,
    paddingTop: 0,
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
})

export default withAuth(ClientSearchScreen)
