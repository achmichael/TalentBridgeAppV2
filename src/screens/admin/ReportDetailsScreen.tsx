"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  TextInput,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useNavigation, useRoute } from "@react-navigation/native"
import { useTheme } from "../../contexts/ThemeContext"
import { useQuery, useMutation } from "react-query"

// Mock API calls
const fetchReportDetails = async (reportId: string): Promise<any> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Mock report data
  return {
    id: reportId,
    title: "Inappropriate job posting",
    description:
      "This job posting contains misleading information about the salary and benefits. The company is advertising a much higher salary range than what they actually offer during interviews.",
    reportedBy: {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    reportedUser: {
      id: "3",
      name: "TechCorp Inc.",
      email: "hr@techcorp.com",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    reportedContent: {
      type: "job",
      id: "1",
      title: "Senior React Native Developer",
      description: "Job posting with misleading salary information",
    },
    type: "job",
    status: "pending",
    priority: "high",
    createdAt: "2023-06-15",
    updatedAt: null,
    assignedTo: null,
    notes: [],
    evidence: [
      {
        type: "screenshot",
        url: "https://randomuser.me/api/portraits/men/32.jpg",
        description: "Screenshot of the misleading job posting",
      },
      {
        type: "message",
        url: null,
        description: "Email conversation with the company representative",
      },
    ],
  }
}

const updateReportStatus = async ({ reportId, status, note }: { reportId: string; status: string; note: string }): Promise<any> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { success: true }
}

const ReportDetailsScreen = () => {
  const { theme } = useTheme()
  const navigation = useNavigation()
  const route = useRoute()
  const { reportId } = route.params as { reportId: string }

  const [adminNote, setAdminNote] = useState("")

  const { data: report, isLoading, refetch } = useQuery(["reportDetails", reportId], () => fetchReportDetails(reportId))

  const { mutate: updateStatus, isLoading: isUpdating } = useMutation(updateReportStatus, {
    onSuccess: () => {
      refetch()
      setAdminNote("")
      Alert.alert("Success", "Report status updated successfully")
    },
    onError: () => {
      Alert.alert("Error", "Failed to update report status")
    },
  })

  const handleStatusChange = (newStatus: "pending" | "investigating" | "resolved") => {
    const statusMessages = {
      pending: "Mark this report as pending review.",
      investigating: "Mark this report as under investigation.",
      resolved: "Mark this report as resolved. This will close the report.",
    }

    Alert.alert(`Confirm ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`, statusMessages[newStatus], [
      { text: "Cancel", style: "cancel" },
      {
        text: "Confirm",
        onPress: () => {
          updateStatus({ reportId, status: newStatus, note: adminNote })
        },
      },
    ])
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "pending":
        return "#F39C12"
      case "investigating":
        return "#3498DB"
      case "resolved":
        return "#2ECC71"
      default:
        return theme.textSecondary
    }
  }

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case "high":
        return "#E74C3C"
      case "medium":
        return "#F39C12"
      case "low":
        return "#3498DB"
      default:
        return theme.textSecondary
    }
  }

  const getTypeIcon = (type: string): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case "job":
        return "briefcase"
      case "user":
        return "person"
      case "message":
        return "chatbubble"
      case "payment":
        return "card"
      case "portfolio":
        return "images"
      case "company":
        return "business"
      case "review":
        return "star"
      default:
        return "alert-circle"
    }
  }

  if (isLoading || !report) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>Loading report details...</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Report Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.reportHeader, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.reportTitleContainer}>
            <Ionicons name={getTypeIcon(report.type)} size={24} color={theme.primary} style={styles.typeIcon} />
            <Text style={[styles.reportTitle, { color: theme.text }]}>{report.title}</Text>
          </View>

          <View style={styles.reportMeta}>
            <View style={[styles.statusContainer, { backgroundColor: getStatusColor(report.status) + "20" }]}>
              <Text style={[styles.statusText, { color: getStatusColor(report.status) }]}>
                {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
              </Text>
            </View>

            <View style={[styles.priorityContainer, { backgroundColor: getPriorityColor(report.priority) + "20" }]}>
              <Text style={[styles.priorityText, { color: getPriorityColor(report.priority) }]}>
                {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)} Priority
              </Text>
            </View>
          </View>

          <Text style={[styles.reportDate, { color: theme.textSecondary }]}>
            Reported on {new Date(report.createdAt).toLocaleDateString()}
          </Text>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Description</Text>
          <Text style={[styles.descriptionText, { color: theme.text }]}>{report.description}</Text>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Reported By</Text>
          <TouchableOpacity
            style={styles.userContainer}
            // @ts-ignore
            onPress={() => navigation.navigate("UserDetails", { userId: report.reportedBy.id })}
          >
            <Image source={{ uri: report.reportedBy.avatar }} style={styles.userAvatar} />
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: theme.text }]}>{report.reportedBy.name}</Text>
              <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{report.reportedBy.email}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.sectionCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Reported User/Content</Text>
          <TouchableOpacity
            style={styles.userContainer}
            // @ts-ignore
            onPress={() => navigation.navigate("UserDetails", { userId: report.reportedUser.id })}
          >
            <Image source={{ uri: report.reportedUser.avatar }} style={styles.userAvatar} />
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: theme.text }]}>{report.reportedUser.name}</Text>
              <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{report.reportedUser.email}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
          </TouchableOpacity>

          <View style={styles.contentContainer}>
            <Text style={[styles.contentTitle, { color: theme.text }]}>Reported Content:</Text>
            <TouchableOpacity
              style={[styles.contentCard, { backgroundColor: theme.background }]}
              onPress={() => {
                // Navigate to the reported content
                if (report.reportedContent.type === "job") {
                 // @ts-ignore
                  navigation.navigate("JobDetails", { jobId: report.reportedContent.id })
                } else {
                  Alert.alert("View Content", "Navigate to the reported content")
                }
              }}
            >
              <View style={styles.contentHeader}>
                <Ionicons name={getTypeIcon(report.reportedContent.type)} size={20} color={theme.primary} />
                <Text style={[styles.contentType, { color: theme.primary }]}>
                  {report.reportedContent.type.charAt(0).toUpperCase() + report.reportedContent.type.slice(1)}
                </Text>
              </View>
              <Text style={[styles.contentName, { color: theme.text }]}>{report.reportedContent.title}</Text>
              <Text style={[styles.contentDescription, { color: theme.textSecondary }]} numberOfLines={2}>
                {report.reportedContent.description}
              </Text>
              <Text style={[styles.viewContent, { color: theme.primary }]}>View Content</Text>
            </TouchableOpacity>
          </View>
        </View>

        {report.evidence.length > 0 && (
          <View style={[styles.sectionCard, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Evidence</Text>
            {report.evidence.map((item: any, index: number) => (
              <View key={index} style={styles.evidenceItem}>
                {item.url && <Image source={{ uri: item.url }} style={styles.evidenceImage} />}
                <View style={styles.evidenceInfo}>
                  <Text style={[styles.evidenceType, { color: theme.text }]}>
                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </Text>
                  <Text style={[styles.evidenceDescription, { color: theme.textSecondary }]}>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={[styles.sectionCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Admin Notes</Text>
          {report.notes.length > 0 ? (
            report.notes.map((note: any, index: number) => (
              <View
                key={index}
                style={[
                  styles.noteItem,
                  index < report.notes.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: theme.border,
                  },
                ]}
              >
                <View style={styles.noteHeader}>
                  <Text style={[styles.noteAdmin, { color: theme.text }]}>{note.admin}</Text>
                  <Text style={[styles.noteDate, { color: theme.textSecondary }]}>
                    {new Date(note.date).toLocaleDateString()}
                  </Text>
                </View>
                <Text style={[styles.noteText, { color: theme.text }]}>{note.text}</Text>
              </View>
            ))
          ) : (
            <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No admin notes yet</Text>
          )}

          <View style={styles.addNoteContainer}>
            <TextInput
              style={[
                styles.noteInput,
                {
                  color: theme.text,
                  borderColor: theme.border,
                  backgroundColor: theme.inputBackground,
                },
              ]}
              placeholder="Add a note..."
              placeholderTextColor={theme.textSecondary}
              multiline
              value={adminNote}
              onChangeText={setAdminNote}
            />
            <TouchableOpacity
              style={[styles.addNoteButton, { backgroundColor: theme.primary }]}
              onPress={() => {
                if (adminNote.trim()) {
                  updateStatus({
                    reportId,
                    status: report.status,
                    note: adminNote,
                  })
                } else {
                  Alert.alert("Error", "Please enter a note")
                }
              }}
              disabled={isUpdating || !adminNote.trim()}
            >
              {isUpdating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.addNoteButtonText}>Add Note</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#F39C12" }]}
            onPress={() => handleStatusChange("pending")}
            disabled={report.status === "pending" || isUpdating}
          >
            <Ionicons name="time-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Mark Pending</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#3498DB" }]}
            onPress={() => handleStatusChange("investigating")}
            disabled={report.status === "investigating" || isUpdating}
          >
            <Ionicons name="search-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Investigate</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: "#2ECC71" }]}
            onPress={() => handleStatusChange("resolved")}
            disabled={report.status === "resolved" || isUpdating}
          >
            <Ionicons name="checkmark-outline" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Resolve</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

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
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    reportHeader: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    reportTitleContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    typeIcon: {
        marginRight: 8,
    },
    reportTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    reportMeta: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 8,
    },
    statusContainer: {
        padding: 4,
        borderRadius: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: "bold",
    },
    priorityContainer: {
        padding: 4,
        borderRadius: 4,
    },
    priorityText: {
        fontSize: 12,
        fontWeight: "bold",
    },
    reportDate: {
        marginTop: 8,
        fontSize: 12,
    },
    sectionCard: {
        margin: 16,
        borderRadius: 10,
        padding: 16,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 14,
        lineHeight: 20,
    },
    userContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
        borderRadius: 10,
        backgroundColor: "#f9f9f9",
    },
    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    userInfo: {
        flex: 1,
        marginLeft: 16,
    },
    userName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    userEmail: {
        fontSize: 14,
        color: "#888",
    },
    contentContainer: {
        marginTop: 16,
    },
    contentTitle: {
        fontSize: 14,
        fontWeight: "bold",
    },
    contentCard: {
        marginTop: 8,
        padding: 16,
        borderRadius: 10,
        elevation: 2,
    },
    contentHeader: {
        flexDirection: "row",
        alignItems: "center",
    },
    contentType: {
        fontSize: 14,
        fontWeight: "bold",
        marginLeft: 8,
    },
    contentName: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 8,
    },
    contentDescription: {
        fontSize: 14,
        color: "#888",
        marginTop: 4,
    },
    viewContent: {
        marginTop: 8,
        fontSize: 14,
        color: "#3498DB",
    },
    evidenceItem: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
    },
    evidenceImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    evidenceInfo: {
        flex: 1,
        marginLeft: 16,
    },
    evidenceType: {
        fontSize: 14,
        fontWeight: "bold",
    },
    evidenceDescription: {
        fontSize: 14,
        color: "#888",
    },
    noteItem: {
        paddingVertical: 8,
    },
    noteHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    noteAdmin: {
        fontSize: 14,
        fontWeight: "bold",
    },
    noteDate: {
        fontSize: 12,
        color: "#888",
    },
    noteText: {
        fontSize: 14,
        marginTop: 4,
    },
    addNoteContainer: {
        marginTop: 16,
        flexDirection: "row",
        alignItems: "center",
    },
    noteInput: {
        flex: 1,
        borderRadius: 10,
        padding: 8,
        marginRight: 8,
    },
    addNoteButton: {
        padding: 10,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    addNoteButtonText: {
        fontSize: 14,
        color: "#fff",
    },
    actionButtonsContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
    },
    actionButton: {
        flex: 1,
        padding: 16,
        borderRadius: 10,
        marginHorizontal: 4,
        justifyContent: "center",
        alignItems: "center",
    },
    actionButtonText: {
        fontSize: 14,
        color: "#fff",
        marginTop: 4,
    },
    emptyText: {
        fontSize: 14,
        color: "#888",
        textAlign: "center",
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 12,
        color: "#888",
        textAlign: "center",
    }
});

export default ReportDetailsScreen