"use client";

import { ReactNode, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../contexts/ThemeContext";
import { useMutation } from "@tanstack/react-query";

// Mock API calls
const updateSettings = async (settings: {
  emailNotifications: boolean;
  pushNotifications: boolean;
  darkMode: boolean;
  twoFactorAuth: boolean;
  loginAlerts: boolean;
  maintenanceMode: boolean;
  jobApprovalRequired: boolean;
  userVerificationRequired: boolean;
  maxReportsBeforeReview: number;
  maxJobsPerCompany: number;
  apiRateLimit: number;
  apiKey: string;
}) => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return { success: true };
};

const AdminSettingsScreen = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const navigation = useNavigation();

  // General settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(isDark);

  // Security settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);

  // System settings
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [jobApprovalRequired, setJobApprovalRequired] = useState(true);
  const [userVerificationRequired, setUserVerificationRequired] =
    useState(true);
  const [maxReportsBeforeReview, setMaxReportsBeforeReview] = useState("3");
  const [maxJobsPerCompany, setMaxJobsPerCompany] = useState("10");

  // API settings
  const [apiRateLimit, setApiRateLimit] = useState("100");
  const [apiKey, setApiKey] = useState("sk_admin_8f7d3e2c1a5b9d6e");

  const { mutate: saveSettings, status } = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      Alert.alert("Success", "Settings updated successfully");
    },
    onError: () => {
      Alert.alert("Error", "Failed to update settings. Please try again.");
    },
  });

  const isLoading = status === "pending";

  const handleSaveSettings = () => {
    const settings = {
      emailNotifications,
      pushNotifications,
      darkMode,
      twoFactorAuth,
      loginAlerts,
      maintenanceMode,
      jobApprovalRequired,
      userVerificationRequired,
      maxReportsBeforeReview: Number.parseInt(maxReportsBeforeReview),
      maxJobsPerCompany: Number.parseInt(maxJobsPerCompany),
      apiRateLimit: Number.parseInt(apiRateLimit),
      apiKey,
    };

    saveSettings(settings);
  };

  const handleToggleDarkMode = (value: boolean) => {
    setDarkMode(value);
    toggleTheme();
  };

  const handleMaintenanceMode = (value: boolean) => {
    if (value) {
      Alert.alert(
        "Enable Maintenance Mode",
        "This will make the platform inaccessible to all users except administrators. Are you sure?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Enable", onPress: () => setMaintenanceMode(true) },
        ]
      );
    } else {
      setMaintenanceMode(false);
    }
  };

  const regenerateApiKey = () => {
    Alert.alert(
      "Regenerate API Key",
      "This will invalidate the current API key. All services using this key will need to be updated. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Regenerate",
          onPress: () => {
            // Generate a random API key
            const newKey =
              "sk_admin_" + Math.random().toString(36).substring(2, 15);
            setApiKey(newKey);
          },
        },
      ]
    );
  };

  const SettingItem = ({
    title,
    description,
    children,
  }: {
    title: string;
    description: string;
    children: ReactNode;
  }) => (
    <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, { color: theme.text }]}>
          {title}
        </Text>
        {description && (
          <Text
            style={[styles.settingDescription, { color: theme.textSecondary }]}
          >
            {description}
          </Text>
        )}
      </View>
      <View style={styles.settingControl}>{children}</View>
    </View>
  );

  const SettingSection = ({
    title,
    icon,
    children,
  }: {
    title: string;
    icon: ReactNode;
    children: ReactNode;
  }) => (
    <View style={styles.settingSection}>
      <View style={styles.sectionHeader}>
        {icon}
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          {title}
        </Text>
      </View>
      <View
        style={[
          styles.sectionContent,
          { backgroundColor: theme.cardBackground },
        ]}
      >
        {children}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background, paddingTop: Platform.OS === 'ios' ? 30 : 40 }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Admin Settings
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <SettingSection
          title="General"
          icon={
            <Ionicons name="settings-outline" size={22} color={theme.primary} />
          }
        >
          <SettingItem
            title="Email Notifications"
            description="Receive email notifications for important admin events"
          >
            <Switch
              value={emailNotifications}
              onValueChange={setEmailNotifications}
              trackColor={{ false: theme.border, true: theme.primary + "80" }}
              thumbColor={emailNotifications ? theme.primary : "#f4f3f4"}
            />
          </SettingItem>

          <SettingItem
            title="Push Notifications"
            description="Receive push notifications on your device"
          >
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: theme.border, true: theme.primary + "80" }}
              thumbColor={pushNotifications ? theme.primary : "#f4f3f4"}
            />
          </SettingItem>

          <SettingItem
            title="Dark Mode"
            description="Toggle between light and dark theme"
          >
            <Switch
              value={darkMode}
              onValueChange={handleToggleDarkMode}
              trackColor={{ false: theme.border, true: theme.primary + "80" }}
              thumbColor={darkMode ? theme.primary : "#f4f3f4"}
            />
          </SettingItem>
        </SettingSection>

        <SettingSection
          title="Security"
          icon={
            <Ionicons name="shield-outline" size={22} color={theme.primary} />
          }
        >
          <SettingItem
            title="Two-Factor Authentication"
            description="Require a verification code when logging in"
          >
            <Switch
              value={twoFactorAuth}
              onValueChange={setTwoFactorAuth}
              trackColor={{ false: theme.border, true: theme.primary + "80" }}
              thumbColor={twoFactorAuth ? theme.primary : "#f4f3f4"}
            />
          </SettingItem>

          <SettingItem
            title="Login Alerts"
            description="Get notified of new login attempts"
          >
            <Switch
              value={loginAlerts}
              onValueChange={setLoginAlerts}
              trackColor={{ false: theme.border, true: theme.primary + "80" }}
              thumbColor={loginAlerts ? theme.primary : "#f4f3f4"}
            />
          </SettingItem>

          <SettingItem
            title="Change Password"
            description="Update your admin account password"
          >
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={() => {
                // Handle password change
                Alert.alert(
                  "Change Password",
                  "Password change functionality would go here"
                );
              }}
            >
              <Text style={styles.buttonText}>Change</Text>
            </TouchableOpacity>
          </SettingItem>
        </SettingSection>

        <SettingSection
          title="System"
          icon={
            <Ionicons
              name="construct-outline"
              size={22}
              color={theme.primary}
            />
          }
        >
          <SettingItem
            title="Maintenance Mode"
            description="Take the platform offline for maintenance"
          >
            <Switch
              value={maintenanceMode}
              onValueChange={handleMaintenanceMode}
              trackColor={{ false: theme.border, true: "#E74C3C80" }}
              thumbColor={maintenanceMode ? "#E74C3C" : "#f4f3f4"}
            />
          </SettingItem>

          <SettingItem
            title="Job Approval Required"
            description="Require admin approval for new job postings"
          >
            <Switch
              value={jobApprovalRequired}
              onValueChange={setJobApprovalRequired}
              trackColor={{ false: theme.border, true: theme.primary + "80" }}
              thumbColor={jobApprovalRequired ? theme.primary : "#f4f3f4"}
            />
          </SettingItem>

          <SettingItem
            title="User Verification Required"
            description="Require verification for new user accounts"
          >
            <Switch
              value={userVerificationRequired}
              onValueChange={setUserVerificationRequired}
              trackColor={{ false: theme.border, true: theme.primary + "80" }}
              thumbColor={userVerificationRequired ? theme.primary : "#f4f3f4"}
            />
          </SettingItem>

          <SettingItem
            title="Max Reports Before Review"
            description="Number of reports before auto-flagging content"
          >
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.text,
                  borderColor: theme.border,
                  backgroundColor: theme.inputBackground,
                },
              ]}
              value={maxReportsBeforeReview}
              onChangeText={setMaxReportsBeforeReview}
              keyboardType="numeric"
            />
          </SettingItem>

          <SettingItem
            title="Max Jobs Per Company"
            description="Maximum number of active job postings per company"
          >
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.text,
                  borderColor: theme.border,
                  backgroundColor: theme.inputBackground,
                },
              ]}
              value={maxJobsPerCompany}
              onChangeText={setMaxJobsPerCompany}
              keyboardType="numeric"
            />
          </SettingItem>
        </SettingSection>

        <SettingSection
          title="API Settings"
          icon={<MaterialIcons name="api" size={22} color={theme.primary} />}
        >
          <SettingItem
            title="API Rate Limit"
            description="Maximum requests per minute"
          >
            <TextInput
              style={[
                styles.input,
                {
                  color: theme.text,
                  borderColor: theme.border,
                  backgroundColor: theme.inputBackground,
                },
              ]}
              value={apiRateLimit}
              onChangeText={setApiRateLimit}
              keyboardType="numeric"
            />
          </SettingItem>

          <SettingItem
            title="API Key"
            description="Your admin API key for external integrations"
          >
            <View style={styles.apiKeyContainer}>
              <Text style={[styles.apiKey, { color: theme.text }]}>
                {apiKey.substring(0, 10)}...
              </Text>
              <TouchableOpacity
                style={[
                  styles.regenerateButton,
                  { backgroundColor: theme.primary },
                ]}
                onPress={regenerateApiKey}
              >
                <Text style={styles.buttonText}>Regenerate</Text>
              </TouchableOpacity>
            </View>
          </SettingItem>
        </SettingSection>

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: theme.primary }]}
          onPress={handleSaveSettings}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color="#fff" />
              <Text style={styles.saveButtonText}>Save Settings</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
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
  settingSection: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  sectionContent: {
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flex: 1,
    marginRight: 10,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
  },
  settingControl: {
    justifyContent: "center",
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
  },
  input: {
    width: 60,
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    textAlign: "center",
  },
  apiKeyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  apiKey: {
    fontSize: 14,
    marginRight: 10,
  },
  regenerateButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
});

export default AdminSettingsScreen;
