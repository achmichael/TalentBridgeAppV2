"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../../contexts/ThemeContext"
import { useAuth } from "../../contexts/AuthContext"
import withAuth from "@/src/hoc/withAuth"

const FreelancerSettingsScreen = () => {
  const navigation = useNavigation()
  const { theme, isDark, toggleTheme } = useTheme()
  const { signOut } = useAuth()

  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true)
  const [availableForWork, setAvailableForWork] = useState(true)
  const [profileVisibility, setProfileVisibility] = useState(true)

  const handleDeleteAccount = () => {
    Alert.alert("Delete Account", "Are you sure you want to delete your account? This action cannot be undone.", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          // In a real app, you would call an API to delete the account
          Alert.alert("Account Deleted", "Your account has been successfully deleted.")
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
              <Ionicons name="person-outline" size={22} color={theme.secondary} />
              <Text style={[styles.settingText, { color: theme.text }]}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + "80"} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="lock-closed-outline" size={22} color={theme.secondary} />
              <Text style={[styles.settingText, { color: theme.text }]}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + "80"} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="card-outline" size={22} color={theme.secondary} />
              <Text style={[styles.settingText, { color: theme.text }]}>Payment Methods</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + "80"} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Preferences</Text>

          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="moon-outline" size={22} color={theme.secondary} />
              <Text style={[styles.settingText, { color: theme.text }]}>Dark Mode</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: "#767577", true: theme.secondary + "80" }}
              thumbColor={isDark ? theme.secondary : "#f4f3f4"}
            />
          </View>

          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="notifications-outline" size={22} color={theme.secondary} />
              <Text style={[styles.settingText, { color: theme.text }]}>Push Notifications</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: "#767577", true: theme.secondary + "80" }}
              thumbColor={notificationsEnabled ? theme.secondary : "#f4f3f4"}
            />
          </View>

          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="mail-outline" size={22} color={theme.secondary} />
              <Text style={[styles.settingText, { color: theme.text }]}>Email Notifications</Text>
            </View>
            <Switch
              value={emailNotificationsEnabled}
              onValueChange={setEmailNotificationsEnabled}
              trackColor={{ false: "#767577", true: theme.secondary + "80" }}
              thumbColor={emailNotificationsEnabled ? theme.secondary : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Freelancer Settings</Text>

          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="briefcase-outline" size={22} color={theme.secondary} />
              <Text style={[styles.settingText, { color: theme.text }]}>Available for Work</Text>
            </View>
            <Switch
              value={availableForWork}
              onValueChange={setAvailableForWork}
              trackColor={{ false: "#767577", true: theme.secondary + "80" }}
              thumbColor={availableForWork ? theme.secondary : "#f4f3f4"}
            />
          </View>

          <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="eye-outline" size={22} color={theme.secondary} />
              <Text style={[styles.settingText, { color: theme.text }]}>Profile Visibility</Text>
            </View>
            <Switch
              value={profileVisibility}
              onValueChange={setProfileVisibility}
              trackColor={{ false: "#767577", true: theme.secondary + "80" }}
              thumbColor={profileVisibility ? theme.secondary : "#f4f3f4"}
            />
          </View>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="cash-outline" size={22} color={theme.secondary} />
              <Text style={[styles.settingText, { color: theme.text }]}>Hourly Rate</Text>
            </View>
            <View style={styles.settingValue}>
              <Text style={[styles.valueText, { color: theme.text }]}>$35/hr</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.text + "80"} />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Support</Text>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="help-circle-outline" size={22} color={theme.secondary} />
              <Text style={[styles.settingText, { color: theme.text }]}>Help Center</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + "80"} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="chatbubble-ellipses-outline" size={22} color={theme.secondary} />
              <Text style={[styles.settingText, { color: theme.text }]}>Contact Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + "80"} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="document-text-outline" size={22} color={theme.secondary} />
              <Text style={[styles.settingText, { color: theme.text }]}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + "80"} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { borderBottomColor: theme.border }]}>
            <View style={styles.settingInfo}>
              <Ionicons name="shield-outline" size={22} color={theme.secondary} />
              <Text style={[styles.settingText, { color: theme.text }]}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.text + "80"} />
          </TouchableOpacity>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={[styles.signOutButton, { borderColor: theme.secondary }]} onPress={signOut}>
            <Text style={[styles.signOutText, { color: theme.secondary }]}>Sign Out</Text>
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
  settingValue: {
    flexDirection: "row",
    alignItems: "center",
  },
  valueText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginRight: 8,
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

export default withAuth(FreelancerSettingsScreen)
