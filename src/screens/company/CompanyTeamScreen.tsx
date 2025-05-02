"use client"

import { ReactNode, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"
import withAuth from "@/src/hoc/withAuth"
import { useDashboard } from "@/src/contexts/Company/DashboardContext"
import { navigationRef } from "@/src/components/common/navigation"

const CompanyTeamScreen = () => {
  const { theme } = useTheme()
  const [refreshing, setRefreshing] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState("All")
  const { filteredData, refetch, isLoading, searchQuery, setSearchQuery } = useDashboard();

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch()
    setRefreshing(false)
  }

  const teamsData = filteredData.user?.company?.employees;

  const departments = teamsData
    ? ["All", ...Array.from(new Set(teamsData.map((member: any) => member.position)))]
    : ["All"]

  const filteredMembers =
    teamsData && selectedDepartment !== "All"
      ? teamsData.filter((member: any) => member.position === selectedDepartment)
      : teamsData

  const renderTeamMember = ({ item }: { item: any }) => (
    <TouchableOpacity style={[styles.memberCard, { backgroundColor: theme.card }]} activeOpacity={0.7}>
      <Image source={{ uri: item.avatar || 'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D' }} style={styles.avatar} />
      <View style={styles.memberInfo}>
        <Text style={[styles.memberName, { color: theme.text , textTransform: 'capitalize'}]}>{item?.employee?.username}</Text>
        {/* <Text style={[styles.memberPosition, { color: getStatusColor(item?.status) + "90", textTransform: 'capitalize' }]}>{item.status}</Text> */}
        <View style={styles.memberDetails}>
          <View style={styles.memberDetail}>
            <Ionicons name="briefcase-outline" size={14} color={theme.text + "80"} />
            <Text style={[styles.memberDetailText, { color: theme.text + "80" }]}>{item.position}</Text>
          </View>
          <View style={styles.memberDetail}>
            <Ionicons name="calendar-outline" size={14} color={theme.text + "80"} />
            <Text style={[styles.memberDetailText, { color: theme.text + "80" }]}>
              Joined {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.memberActions}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.accent + "20" }]}>
          <Ionicons name="mail-outline" size={18} color={theme.accent} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.accent + "20" }]}>
          <Ionicons name="call-outline" size={18} color={theme.accent} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Team Members</Text>
        <TouchableOpacity onPress={() => navigationRef.navigate('CreateTeam' as never)} style={[styles.addButton, { backgroundColor: theme.accent }]}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add Member</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.searchContainer, { backgroundColor: theme.card }]}>
        <Ionicons name="search" size={20} color={theme.text + "80"} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search team members..."
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

      <View style={styles.departmentsContainer}>
        <FlatList
          data={departments}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item: any) => item}
          contentContainerStyle={styles.departmentsList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.departmentItem,
                {
                  backgroundColor: selectedDepartment === item ? theme.accent : theme.card,
                },
              ]}
              onPress={() => setSelectedDepartment(item as string)}
            >
              <Text
                style={[
                  styles.departmentText,
                  {
                    color: selectedDepartment === item ? "#FFFFFF" : theme.text,
                  },
                ]}
              >
                {item as ReactNode}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      ) : filteredMembers && filteredMembers.length > 0 ? (
        <FlatList
          data={filteredMembers}
          renderItem={renderTeamMember}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.membersList}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.accent]} />}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={50} color={theme.text + "40"} />
          <Text style={[styles.emptyText, { color: theme.text }]}>No team members found</Text>
          <Text style={[styles.emptySubtext, { color: theme.text + "80" }]}>
            {searchQuery
              ? "Try adjusting your search"
              : selectedDepartment !== "All"
              ? `No members in ${selectedDepartment} department`
              : "Add team members to get started"}
          </Text>
          <TouchableOpacity style={[styles.emptyButton, { backgroundColor: theme.accent }]}>
            <Text style={styles.emptyButtonText}>Add Team Member</Text>
          </TouchableOpacity>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    marginLeft: 5,
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
  departmentsContainer: {
    marginBottom: 16,
  },
  departmentsList: {
    paddingHorizontal: 16,
  },
  departmentItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  departmentText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },
  membersList: {
    padding: 16,
    paddingTop: 0,
  },
  memberCard: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  memberPosition: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 5,
  },
  memberDetails: {
    flexDirection: "column",
    flexWrap: "wrap",
  },
  memberDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 5,
  },
  memberDetailText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginLeft: 5,
  },
  memberActions: {
    flexDirection: "column",
    justifyContent: "space-between",
    rowGap: 5,
    height: 60,
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
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
})

export default withAuth(CompanyTeamScreen)

