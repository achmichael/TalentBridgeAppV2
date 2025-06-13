"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { RouteProp } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import type { FreelancerStackParamList } from "../../navigation/FreelancerNavigator";
import { useQuery } from "@tanstack/react-query";
import withAuth from "@/src/hoc/withAuth";
import { baseUrl } from "@/src/config/baseUrl";
import { fetcher, poster } from "@/src/components/common/AutoHelper";
import { useAuth } from "@/src/contexts/AuthContext";
import * as DocumentPicker from "expo-document-picker";

type JobDetailsScreenRouteProp = RouteProp<
  FreelancerStackParamList,
  "JobDetails"
>;
type JobDetailsScreenNavigationProp =
  StackNavigationProp<FreelancerStackParamList>;

const fetchJobDetails = async (
  jobId: string,
  token: string | undefined | null
) => {
  try {
    const response = await fetcher(`${baseUrl}/posts/${jobId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data;
  } catch (err) {
    console.error("Error fetching job details:", err);
  }
};

const JobDetailsScreen = () => {
  const route = useRoute<JobDetailsScreenRouteProp>();
  const navigation = useNavigation<JobDetailsScreenNavigationProp>();
  const { theme } = useTheme();
  const { token } = useAuth();
  const { jobId } = route.params;

  const [bidAmount, setBidAmount] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [fileError, setFileError] = useState("");

  const { data: job, isLoading } = useQuery({
    queryKey: ["jobDetails", jobId],
    queryFn: () => fetchJobDetails(jobId, token),
  });

  const handleFilePicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
      });

      if (
        result.canceled === false &&
        result.assets &&
        result.assets.length > 0
      ) {
        const file = result.assets[0];
        if (file.size && file.size > 5 * 1024 * 1024) {
          setFileError("File size exceeds 5MB limit");
          return;
        }
        setSelectedFile(file);
        setFileError("");
      }
    } catch (error) {
      console.error("Error picking document:", error);
      setFileError("Error selecting file. Please try again.");
    }
  };

  const handleSubmitProposal = async () => {
    if (!bidAmount || !coverLetter) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (isNaN(Number(bidAmount)) || Number(bidAmount) <= 0) {
      Alert.alert("Error", "Please enter a valid bid amount");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("post_id", jobId);
      formData.append("amount", bidAmount);
      if (selectedFile) {
        // @ts-ignore: FormData in React Native accepts { uri, name, type }
        formData.append("apply_file", {
          uri: selectedFile.uri,
          name: selectedFile.name,
          type: selectedFile.mimeType || "application/octet-stream",
        });
      }

      const { data, error } = await poster(`${baseUrl}/applications/`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: formData,
      });

      if (error){
        throw new Error(error);
      }

      if (data?.success) {
        Alert.alert("Success", "Your proposal has been submitted successfully!");
        navigation.goBack();
      } else {
        Alert.alert("Error", data?.message || "Failed to submit proposal");
      }

    }catch(err: any){
      console.log('error submitting proposal:', err.message);
    }finally{
      setIsSubmitting(false);
    }
  };

  if (isLoading || !job) {
    return (
      <View
        style={[styles.loadingContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={theme.secondary} />
      </View>
    );
  }

  console.log("Job Details:", job);

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
        <TouchableOpacity style={styles.saveButton}>
          <Ionicons name="bookmark-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.jobHeader}>
          <Text style={[styles.jobTitle, { color: theme.text }]}>
            {job.title}
          </Text>
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
            <View style={styles.metaItem}>
              <Ionicons
                name="location-outline"
                size={16}
                color={theme.text + "80"}
              />
              <Text
                style={[
                  styles.metaText,
                  {
                    color: theme.text + "80",
                    textTransform: "capitalize",
                    width: 100,
                  },
                ]}
              >
                {job.job?.system}
              </Text>
            </View>
          </View>
          <View style={styles.jobMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="cash-outline" size={16} color={theme.secondary} />
              <Text style={[styles.budgetText, { color: theme.secondary }]}>
                {Number(job.price).toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons
                name="people-outline"
                size={16}
                color={theme.text + "80"}
              />
              <Text style={[styles.metaText, { color: theme.text + "80" }]}>
                {job.applications?.length} proposals
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, { borderBottomColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Client Information
          </Text>
          <TouchableOpacity
            style={styles.clientInfo}
            onPress={() =>
              navigation.navigate("ClientProfile", { clientId: job.client.id })
            }
          >
            <Image
              source={{
                uri:
                  job.client?.profile_picture ||
                  "https://i.pinimg.com/736x/ed/1f/41/ed1f41959e7e9aa7fb0a18b76c6c2755.jpg",
              }}
              style={styles.clientAvatar}
            />
            <View style={styles.clientDetails}>
              <Text style={[styles.clientName, { color: theme.text }]}>
                {job.user?.username.charAt(0).toUpperCase() +
                  job.user?.username.slice(1)}
              </Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="medal" size={14} color="#FFD700" />
                <Text style={[styles.ratingText, { color: theme.text }]}>
                  {job.level?.name}
                </Text>
              </View>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.text + "60"}
            />
          </TouchableOpacity>
          <View style={styles.clientStats}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {job.user?.posts?.length}
              </Text>
              <Text style={[styles.statLabel, { color: theme.text + "80" }]}>
                Jobs Posted
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {1} %
              </Text>
              <Text style={[styles.statLabel, { color: theme.text + "80" }]}>
                Hire Rate
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: theme.text }]}>
                {new Date().getFullYear() -
                  new Date(job.user.created_at).getFullYear()}
              </Text>
              <Text style={[styles.statLabel, { color: theme.text + "80" }]}>
                Years
              </Text>
            </View>
          </View>
        </View>

        <View style={[styles.section, { borderBottomColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Job Description
          </Text>
          <Text style={[styles.description, { color: theme.text + "90" }]}>
            {job.description}
          </Text>
        </View>

        <View style={[styles.section, { borderBottomColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Skills Required
          </Text>
          <View style={styles.skillsContainer}>
            {(typeof job?.required_skills === "string"
              ? JSON.parse(job.required_skills || "[]")
              : job?.required_skills || []
            )?.map((skill: any, index: number) => (
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
        </View>

        <View style={[styles.section, { borderBottomColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Requirements
          </Text>
          {JSON.parse(job?.requirements)?.map((attachment: any) => (
            <TouchableOpacity
              key={attachment.id}
              style={[styles.attachmentItem, { backgroundColor: theme.card }]}
            >
              <Ionicons
                name="document-outline"
                size={24}
                color={theme.secondary}
              />
              <View style={styles.attachmentInfo}>
                <Text style={[styles.attachmentName, { color: theme.text }]}>
                  {attachment}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.section, { borderBottomColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Benefits
          </Text>
          {JSON.parse(job?.benefits)?.map((attachment: any) => (
            <TouchableOpacity
              key={attachment.id}
              style={[styles.attachmentItem, { backgroundColor: theme.card }]}
            >
              <Ionicons
                name="document-outline"
                size={24}
                color={theme.secondary}
              />
              <View style={styles.attachmentInfo}>
                <Text style={[styles.attachmentName, { color: theme.text }]}>
                  {attachment}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Submit a Proposal
          </Text>
          <View style={styles.proposalForm}>
            <Text style={[styles.inputLabel, { color: theme.text }]}>
              Your Bid Amount ($)
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Enter your bid amount"
              placeholderTextColor={theme.text + "60"}
              keyboardType="numeric"
              value={bidAmount}
              onChangeText={setBidAmount}
            />

            <Text
              style={[styles.inputLabel, { color: theme.text, marginTop: 16 }]}
            >
              Cover Letter
            </Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.border,
                },
              ]}
              placeholder="Introduce yourself and explain why you're a good fit for this job..."
              placeholderTextColor={theme.text + "60"}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              value={coverLetter}
              onChangeText={setCoverLetter}
            />

            <Text
              style={[styles.inputLabel, { color: theme.text, marginTop: 16 }]}
            >
              Upload CV/Resume or Portfolio
            </Text>
            <TouchableOpacity
              style={[
                styles.fileUploadButton,
                {
                  backgroundColor: theme.card,
                  borderColor: theme.border,
                },
              ]}
              onPress={handleFilePicker}
            >
              {selectedFile ? (
                <View style={styles.selectedFileContainer}>
                  <Ionicons
                    name="document-text"
                    size={24}
                    color={theme.secondary}
                  />
                  <Text
                    style={[styles.selectedFileName, { color: theme.text }]}
                    numberOfLines={1}
                  >
                    {selectedFile.name}
                  </Text>
                  <TouchableOpacity onPress={() => setSelectedFile(null)}>
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={theme.text + "80"}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.uploadPlaceholder}>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={24}
                    color={theme.text + "80"}
                  />
                  <Text
                    style={[styles.uploadText, { color: theme.text + "80" }]}
                  >
                    Tap to select a file (PDF, DOC, DOCX)
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            {fileError ? (
              <Text style={styles.errorText}>{fileError}</Text>
            ) : null}

            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: theme.secondary },
                isSubmitting && { opacity: 0.7 },
              ]}
              onPress={handleSubmitProposal}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Proposal</Text>
              )}
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
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
  saveButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  jobHeader: {
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
    marginRight: 16,
  },
  metaText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginLeft: 6,
  },
  budgetText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    marginLeft: 6,
  },
  section: {
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 16,
  },
  clientInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  clientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  clientDetails: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginLeft: 4,
  },
  clientStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  description: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 22,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  skillText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  attachmentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  attachmentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  attachmentName: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginBottom: 2,
  },
  attachmentSize: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  proposalForm: {
    marginTop: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  textArea: {
    minHeight: 120,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  submitButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  fileUploadButton: {
    height: 80,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  uploadPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  uploadText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginTop: 8,
  },
  selectedFileContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
  },
  selectedFileName: {
    flex: 1,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginLeft: 8,
    marginRight: 8,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginTop: 4,
  },
});

export default withAuth(JobDetailsScreen);
