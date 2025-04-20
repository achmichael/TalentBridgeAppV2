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
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../contexts/ThemeContext";
import { useQuery } from "@tanstack/react-query";

// Mock API call
const fetchUsers = async (searchQuery = "", filter = "all") => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Mock data
  const allUsers = [
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "client",
      status: "active",
      createdAt: "2023-01-15",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "freelancer",
      status: "active",
      createdAt: "2023-02-20",
    },
    {
      id: "3",
      name: "Robert Johnson",
      email: "robert@example.com",
      role: "company",
      status: "active",
      createdAt: "2023-03-10",
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily@example.com",
      role: "freelancer",
      status: "suspended",
      createdAt: "2023-01-05",
    },
    {
      id: "5",
      name: "Michael Brown",
      email: "michael@example.com",
      role: "client",
      status: "active",
      createdAt: "2023-04-12",
    },
    {
      id: "6",
      name: "Sarah Wilson",
      email: "sarah@example.com",
      role: "company",
      status: "inactive",
      createdAt: "2023-02-28",
    },
    {
      id: "7",
      name: "David Taylor",
      email: "david@example.com",
      role: "freelancer",
      status: "active",
      createdAt: "2023-05-15",
    },
    {
      id: "8",
      name: "Lisa Anderson",
      email: "lisa@example.com",
      role: "client",
      status: "active",
      createdAt: "2023-03-22",
    },
    {
      id: "9",
      name: "James Martin",
      email: "james@example.com",
      role: "company",
      status: "active",
      createdAt: "2023-04-30",
    },
    {
      id: "10",
      name: "Jennifer Clark",
      email: "jennifer@example.com",
      role: "freelancer",
      status: "suspended",
      createdAt: "2023-01-18",
    },
  ];

  // Filter by search query
  let filteredUsers = allUsers;
  if (searchQuery) {
    filteredUsers = allUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // Filter by role/status
  if (filter !== "all") {
    if (["client", "freelancer", "company"].includes(filter)) {
      filteredUsers = filteredUsers.filter((user) => user.role === filter);
    } else if (["active", "inactive", "suspended"].includes(filter)) {
      filteredUsers = filteredUsers.filter((user) => user.status === filter);
    }
  }

  return filteredUsers;
};

const AdminUsersScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: users,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["users", searchQuery, filter],
    queryFn: () => fetchUsers(searchQuery, filter),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "client":
        return "#4775EA";
      case "freelancer":
        return "#2ECC71";
      case "company":
        return "#F39C12";
      default:
        return theme.textSecondary;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#2ECC71";
      case "inactive":
        return "#95A5A6";
      case "suspended":
        return "#E74C3C";
      default:
        return theme.textSecondary;
    }
  };

  const renderUserItem = ({ item }: any) => (
    <TouchableOpacity
      style={[styles.userCard, { backgroundColor: theme.cardBackground }]}
      //   @ts-ignore
      onPress={() => navigation.navigate("UserDetails", { userId: item.id })}
    >
      <View style={styles.userInfo}>
        <View style={styles.nameContainer}>
          <Text style={[styles.userName, { color: theme.text }]}>
            {item.name}
          </Text>
          <View
            style={[
              styles.roleContainer,
              { backgroundColor: getRoleColor(item.role) + "20" },
            ]}
          >
            <Text style={[styles.roleText, { color: getRoleColor(item.role) }]}>
              {item.role.charAt(0).toUpperCase() + item.role.slice(1)}
            </Text>
          </View>
        </View>
        <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
          {item.email}
        </Text>
        <View style={styles.userMeta}>
          <View
            style={[
              styles.statusContainer,
              { backgroundColor: getStatusColor(item.status) + "20" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: getStatusColor(item.status) },
              ]}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
          <Text style={[styles.dateText, { color: theme.textSecondary }]}>
            Joined: {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
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
          Manage Users
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
          placeholder="Search users..."
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
          <FilterButton label="Clients" value="client" />
          <FilterButton label="Freelancers" value="freelancer" />
          <FilterButton label="Companies" value="company" />
          <FilterButton label="Active" value="active" />
          <FilterButton label="Inactive" value="inactive" />
          <FilterButton label="Suspended" value="suspended" />
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={[styles.loadingText, { color: theme.text }]}>
            Loading users...
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.resultsContainer}>
            <Text style={[styles.resultsText, { color: theme.textSecondary }]}>
              {users?.length || 0} users found
            </Text>
            <TouchableOpacity
              style={[styles.addButton, { backgroundColor: theme.primary }]}
              onPress={() => {
                // Handle adding new user
                alert("Add new user functionality would go here");
              }}
            >
              <Ionicons name="add" size={20} color="#fff" />
              <Text style={styles.addButtonText}>Add User</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={users}
            renderItem={renderUserItem}
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
                <Ionicons name="people" size={60} color={theme.textSecondary} />
                <Text style={[styles.emptyText, { color: theme.text }]}>
                  No users found
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
  userCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  userInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  roleContainer: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 12,
    fontWeight: "500",
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  userMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginRight: 10,
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

export default AdminUsersScreen;
