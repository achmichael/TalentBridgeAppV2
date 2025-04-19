"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"
import { useAuth } from "../../contexts/AuthContext"

const CompanySettingsScreen = () => {
  const navigation = useNavigation()
  const { theme, isDark, toggleTheme } = useTheme()
  const { signOut } = useAuth()

  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true)
  const [jobAlertsEnabled, setJobAlertsEnabled] = useState(true)
  const [publicProfile, setPublicProfile] = useState(true)

  const handleDeleteAccount = () => {
    Alert.alert("Delete Account", "Are you sure you want to delete your company account? This action cannot be undone.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          // In a real app, you would call an API to delete the account
          Alert.alert("Account Deleted", "Your company account has been successfully deleted.")
          signOut()
        },
      },
    ])
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Account</Text>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="business-outline" size={22} color={theme.accent} />
              <Text style={[styles.settingText, { color: theme.text }]}>Edit Company Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + "80"} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="lock-closed-outline" size={22} color={theme.accent} />
              <Text style={[styles.settingText, { color: theme.text }]}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + "80"} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="card-outline" size={22} color={theme.accent} />
              <Text style={[styles.settingText, { color: theme.text }]}>Billing & Subscription</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + "80"} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Preferences</Text>

          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon-outline" size={22} color={theme.accent} />
              <Text style={[styles.settingText, { color: theme.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: "#767577", true: theme.accent + "80" }}
              thumbColor={isDark ? theme.accent : "#f4f3f4"}
            />
          </View>

          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={22} color={theme.accent} />
              <Text style={[styles.settingText, { color: theme.text }]}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#767577", true: theme.accent + "80" }}
              thumbColor={notificationsEnabled ? theme.accent : "#f4f3f4"}
            />
          </View>

          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="mail-outline" size={22} color={theme.accent} />
              <Text style={[styles.settingText, { color: theme.text }]}>Email Notifications</Text>
            </View>
            <Switch
              value={emailNotificationsEnabled}
              onValueChange={setEmailNotificationsEnabled}
              trackColor={{ false: "#767577", true: theme.accent + "80" }}
              thumbColor={emailNotificationsEnabled ? theme.accent : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Company Settings</Text>

          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="briefcase-outline" size={22} color={theme.accent} />
              <Text style={[styles.settingText, { color: theme.text }]}>Job Alerts</Text>
            </View>
            <Switch
              value={jobAlertsEnabled}
              onValueChange={setJobAlertsEnabled}
              trackColor={{ false: "#767577", true: theme.accent + "80" }}
              thumbColor={jobAlertsEnabled ? theme.accent : "#f4f3f4"}
            />
          </View>

          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="eye-outline" size={22} color={theme.accent} />
              <Text style={[styles.settingText, { color: theme.text }]}>Public Profile</Text>
            </View>
            <Switch
              value={publicProfile}
              onValueChange={setPublicProfile}
              trackColor={{ false: "#767577", true: theme.accent + "80" }}
              thumbColor={publicProfile ? theme.accent : "#f4f3f4"}
            />
          </View>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="people-outline" size={22} color={theme.accent} />
              <Text style={[styles.settingText, { color: theme.text }]}>Team Management</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + "80"} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Support</Text>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="help-circle-outline" size={22} color={theme.accent} />
              <Text style={[styles.settingText, { color: theme.text }]}>Help Center</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + "80"} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="chatbubble-ellipses-outline" size={22} color={theme.accent} />
              <Text style={[styles.settingText, { color: theme.text }]}>Contact Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + "80"} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="document-text-outline" size={22} color={theme.accent} />
              <Text style={[styles.settingText, { color: theme.text }]}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + "80"} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="shield-outline" size={22} color={theme.accent} />
              <Text style={[styles.settingText, { color: theme.text }]}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + "80"} />
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.signOutButton, { borderColor: theme.accent }]} onPress={signOut}>
            <Text style={[styles.signOutText, { color: theme.accent }]}>Sign Out</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.deleteButton, { backgroundColor: "#EF4444" }]} onPress={handleDeleteAccount}>
            <Text style={styles.deleteText}>Delete Account</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.text + "60" }]}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  title: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    marginLeft: 12,
  },
  actionButtons: {
    marginVertical: 24,
  },
  signOutButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
  },
  signOutText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  deleteButton: {
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
  versionContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  versionText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
})

export default CompanySettingsScreen

