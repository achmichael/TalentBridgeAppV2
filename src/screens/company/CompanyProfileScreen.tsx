"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  Linking,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import type { CompanyStackParamList } from "../../navigation/CompanyNavigator";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/src/components/common/AutoHelper";
import { baseUrl, domainUrl } from "@/src/config/baseUrl";
import EditProfileModal from "@/src/components/EditProfileModal";
import LoadingScreen from "../common/LoadingScreen";
import withAuth from "@/src/hoc/withAuth";
import * as Clipboard from "expo-clipboard";
import AlertModal from "@/src/components/ModalAlert";

type CompanyProfileScreenNavigationProp =
  StackNavigationProp<CompanyStackParamList>;

const fetchCompanyProfile = async ({
  token,
  id,
}: {
  token: string | null | undefined;
  id: string | null | undefined;
}) => {
  try {
    const { data, error } = await fetcher(
      `${baseUrl}/companies/profile/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (error) throw new Error(error);

    return data;
  } catch (error) {
    console.error("Error fetching company profile:", error);
    throw error;
  }
};

const CompanyProfileScreen = () => {
  const navigation = useNavigation<CompanyProfileScreenNavigationProp>();
  const { theme } = useTheme();
  const { signOut, user, token } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const {
    data: company,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["companyProfile"],
    queryFn: () => fetchCompanyProfile({ token, id: user?.id }),
  });
  
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const copyLink = async () => {
    await Clipboard.setStringAsync(`${domainUrl}/profile/${user?.username}`);
    setAlertVisible(true);
    
    <AlertModal
      visible={alertVisible}
      onClose={() => setAlertVisible(false)}
      title="Link Copied"
      message="The profile link has been copied to your clipboard."
      type="info"
    />
  }

  if (isLoading || !company) {
    return <LoadingScreen />;
  }

  const socialLinks = company.social_links ? JSON.parse(company.social_links) : {};

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.accent]}
        />
      }
    >
      <EditProfileModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSave={async (updatedData) => {
            try {
              const response = await fetcher(
                `${baseUrl}/companies/update`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                  },
                  body: JSON.stringify(updatedData),
                }
              );

              if (response.error) {
                throw new Error(response.error);
              }

              refetch();
              setIsModalVisible(false);
            } catch (error) {
              console.error("Error updating profile:", error);
            }
          }}
          initialData={{ ...company, social_links: JSON.parse(company.social_links || '{}') }}
        />

      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.settingsButton, { backgroundColor: theme.card }]}
          onPress={() => navigation.navigate('CompanySettings')}
        >
          <Ionicons name="settings-outline" size={22} color={theme.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.coverContainer}>
        <Image
          source={{ uri: company.cover_image }}
          style={styles.coverImage}
        />
        <View style={styles.logoContainer}>
          <Image source={{ uri: company.cover_image }} style={styles.logo} />
        </View>
      </View>
        
      <View style={styles.profileHeader}>
        <Text
          style={[
            styles.companyName,
            {
              color: theme.text,
              textTransform: "capitalize",
              width: "100%",
              textAlign: "center",
            },
          ]}
        >
          {company.name}
        </Text>
        <Text
          style={[
            styles.industry,
            { color: theme.text + "80", textAlign: "center" },
          ]}
        >
          {company?.address.toUpperCase()}
        </Text>
        <View style={styles.locationContainer}>
          <Ionicons
            name="location-outline"
            size={15}
            color={theme.text + "80"}
          />
          <Text style={[styles.locationText, { color: theme.text + "80" }]}>
            {company.location}
          </Text>
        </View>
        <View style={styles.statsContainer}>
          <View style={[styles.statItem, { backgroundColor: theme.card }]}>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {company?.jobs.length || "0"}
            </Text>
            <Text style={[styles.statLabel, { color: theme.text + "80" }]}>
              Jobs Posted
            </Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: theme.card }]}>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {company?.jobs?.filter((item: any) => item.status === 'open')?.length || "0"}
            </Text>
            <Text style={[styles.statLabel, { color: theme.text + "80" }]}>
              Active Jobs
            </Text>
          </View>
          <View style={[styles.statItem, { backgroundColor: theme.card }]}>
            <Text style={[styles.statValue, { color: theme.text }]}>
              {company?.employees_count || "0"}
            </Text>
            <Text style={[styles.statLabel, { color: theme.text + "80" }]}>
              Total Hires
            </Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
            style={[styles.editButton, { backgroundColor: theme.accent }]}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={copyLink}
            style={[styles.shareButton, { borderColor: theme.accent }]}
          >
            <Ionicons
              name="share-social-outline"
              size={20}
              color={theme.accent}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "about" && {
              borderBottomColor: theme.accent,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setActiveTab("about")}
          >
          <Text
            style={[
              styles.tabButtonText,
              {
                color: activeTab === "about" ? theme.accent : theme.text + "80",
              },
            ]}
          >
            About
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "jobs" && {
              borderBottomColor: theme.accent,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setActiveTab("jobs")}
        >
          <Text
            style={[
              styles.tabButtonText,
              {
                color: activeTab === "jobs" ? theme.accent : theme.text + "80",
              },
            ]}
          >
            Jobs
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "team" && {
              borderBottomColor: theme.accent,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setActiveTab("team")}
        >
          <Text
            style={[
              styles.tabButtonText,
              {
                color: activeTab === "team" ? theme.accent : theme.text + "80",
              },
            ]}
          >
            Team
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "about" && (
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            About Us
          </Text>
          <Text style={[styles.aboutText, { color: theme.text + "90" }]}>
            {company.description}
          </Text>

          <View style={styles.companyDetails}>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: theme.text + "80" }]}>
                Website
              </Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {company.website}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={[styles.detailLabel, { color: theme.text + "80" }]}>
                Founded
              </Text>
              <Text style={[styles.detailValue, { color: theme.text }]}>
                {company.founded_at
                  ? new Date(company.founded_at).getFullYear()
                  : ""}
              </Text>
            </View>
          </View>

          <Text
            style={[styles.sectionTitle, { color: theme.text, marginTop: 20 }]}
          >
            Social Media
          </Text>
          <View style={styles.socialLinks}>
            <TouchableOpacity
              onPress={() => {
                if (socialLinks?.linkedin) {
                  Linking.openURL(socialLinks.linkedin);
                }
              }}
              style={[styles.socialButton, { backgroundColor: "#0077B5" }]}
            >
              <Ionicons name="logo-linkedin" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (socialLinks?.twitter) {
                  Linking.openURL(socialLinks.twitter);
                }
              }}
              style={[styles.socialButton, { backgroundColor: "#1DA1F2" }]}
            >
              <Ionicons name="logo-twitter" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (socialLinks?.facebook) {
                  Linking.openURL(socialLinks.facebook);
                }
              }}
              style={[styles.socialButton, { backgroundColor: "#4267B2" }]}
            >
              <Ionicons name="logo-facebook" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {activeTab === "jobs" && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Active Jobs
            </Text>
            {/* @ts-ignore */}
            <TouchableOpacity onPress={() => navigation.navigate("Jobs")}>
              <Text style={[styles.seeAll, { color: theme.accent }]}>
                See All
              </Text>
            </TouchableOpacity>
          </View>

          {company?.jobs.map((job: any) => (
            <TouchableOpacity
              key={job.id}
              style={[styles.jobCard, { backgroundColor: theme.card }]}
              onPress={() =>
                navigation.navigate("JobDetails", { jobId: job.id })
              }
            >
              <View style={styles.jobHeader}>
                <Text style={[styles.jobTitle, { color: theme.text }]}>
                  {job.post.title}
                </Text>
                <View
                  style={[
                    styles.jobTypeBadge,
                    { backgroundColor: theme.accent + "20" },
                  ]}
                >
                  <Text style={[styles.jobTypeText, { color: theme.accent }]}>
                    {job.type_job}
                  </Text>
                </View>
              </View>

              <View style={styles.jobDetails}>
                <View style={styles.jobDetail}>
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color={theme.text + "80"}
                  />
                  <Text
                    style={[styles.jobDetailText, { color: theme.text + "80", textTransform: "uppercase" }]}
                  >
                    {job.system}
                  </Text>
                </View>

                <View style={styles.jobDetail}>
                  <Ionicons
                    name="people-outline"
                    size={16}
                    color={theme.text + "80"}
                  />
                  <Text
                    style={[styles.jobDetailText, { color: theme.text + "80" }]}
                  >
                    {job.number_of_employee} Applicants
                  </Text>
                </View>

                <View style={styles.jobDetail}>
                  <Ionicons
                    name="time-outline"
                    size={16}
                    color={theme.text + "80"}
                  />
                  <Text
                    style={[styles.jobDetailText, { color: theme.text + "80" }]}
                  >
                    Posted {new Date(job.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.createJobButton, { backgroundColor: theme.accent }]}
            onPress={() => navigation.navigate("CreateJob")}
          >
            <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
            <Text style={styles.createJobText}>Post a New Job</Text>
          </TouchableOpacity>
        </View>
      )}

      {activeTab === "team" && (
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Recent Hires
            </Text>
            {/* @ts-ignore */}
            <TouchableOpacity onPress={() => navigation.navigate("Team")}>
              <Text style={[styles.seeAll, { color: theme.accent }]}>
                See All Team
              </Text>
            </TouchableOpacity>
          </View>

          {company?.employees.map((hire: any) => (
            <View
              key={hire.id}
              style={[styles.teamMemberCard, { backgroundColor: theme.card }]}
            >
              <Image
                source={{ uri: hire.employee.profile_picture || 'https://i.pinimg.com/736x/ed/1f/41/ed1f41959e7e9aa7fb0a18b76c6c2755.jpg' }}
                style={styles.memberAvatar}
              />
              <View style={styles.memberInfo}>
                <Text style={[styles.memberName, { color: theme.text }]}>
                  {hire.employee.username}
                </Text>
                <Text
                  style={[styles.memberPosition, { color: theme.text + "80" }]}
                >
                  {hire.position}
                </Text>
                <Text style={[styles.hireDate, { color: theme.text + "60" }]}>
                  Joined {new Date(hire.created_at).toLocaleDateString()}
                </Text>
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.viewTeamButton, { borderColor: theme.accent }]}
            // @ts-ignore
            onPress={() => navigation.navigate("Team")}
          >
            <Text style={[styles.viewTeamText, { color: theme.accent }]}>
              View All Team Members
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 35,
    paddingBottom: 20,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  coverContainer: {
    height: 250,
    position: "relative",
  },
  coverImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  logoContainer: {
    position: "absolute",
    bottom: -50,
    left: "50%",
    marginLeft: -50,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  profileHeader: {
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 60,
    marginBottom: 20,
  },
  companyName: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginBottom: 4,
  },
  industry: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 12,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  locationText: {
    fontSize: 10,
    fontFamily: "Poppins-Regular",
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 20,
  },
  statItem: {
    width: "31%",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  actionButtons: {
    flexDirection: "row",
    width: "100%",
    marginBottom: 20,
  },
  editButton: {
    flex: 1,
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
  },
  shareButton: {
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
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
  sectionContainer: {
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
  },
  seeAll: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  aboutText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 22,
    marginBottom: 10,
  },
  companyDetails: {
    // marginBottom: 20,
  },
  detailItem: {
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 15,
    color: "#000",
    fontFamily: "Poppins-Medium",
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  socialLinks: {
    flexDirection: "row",
    marginTop: 10,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  jobCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  jobTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    flex: 1,
  },
  jobTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  jobTypeText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  jobDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  jobDetail: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 5,
  },
  jobDetailText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginLeft: 5,
  },
  createJobButton: {
    flexDirection: "row",
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  createJobText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginLeft: 8,
  },
  teamMemberCard: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: "center",
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginBottom: 2,
  },
  memberPosition: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 4,
  },
  hireDate: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
  viewTeamButton: {
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    borderWidth: 1,
  },
  viewTeamText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
});

export default withAuth(CompanyProfileScreen);
