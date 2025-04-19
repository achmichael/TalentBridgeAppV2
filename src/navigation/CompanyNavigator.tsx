"use client"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../contexts/ThemeContext"

// Screens
import CompanyDashboardScreen from "../screens/company/CompanyDashboardScreen"
import CompanyJobsScreen from "../screens/company/CompanyJobsScreen"
import CompanyTeamScreen from "../screens/company/CompanyTeamScreen"
import CompanyNotificationsScreen from "../screens/company/CompanyNotificationsScreen"
import CompanyProfileScreen from "../screens/company/CompanyProfileScreen"
import CompanySettingsScreen from "../screens/company/CompanySettingsScreen"
import JobDetailsScreen from "../screens/company/JobDetailsScreen"
import ApplicantProfileScreen from "../screens/company/ApplicantProfileScreen"
import CreateJobScreen from "../screens/company/CreateJobScreen"

// Stack param lists
export type CompanyStackParamList = {
  CompanyTabs: undefined
  JobDetails: { jobId: string }
  ApplicantProfile: { applicantId: string }
  CompanySettings: undefined
  CreateJob: undefined
}

export type CompanyTabParamList = {
  Dashboard: undefined
  Jobs: undefined
  Team: undefined
  Notifications: undefined
  Profile: undefined
}

const Stack = createStackNavigator<CompanyStackParamList>()
const Tab = createBottomTabNavigator<CompanyTabParamList>()

// Tab Navigator
const CompanyTabNavigator = () => {
  const { theme } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.accent,
        tabBarInactiveTintColor: theme.text,
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={CompanyDashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Jobs"
        component={CompanyJobsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="briefcase-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Team"
        component={CompanyTeamScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={CompanyNotificationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications-outline" size={size} color={color} />,
          tabBarBadge: 2,
          tabBarBadgeStyle: { backgroundColor: theme.notification },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={CompanyProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="business-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}

// Stack Navigator
const CompanyNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CompanyTabs" component={CompanyTabNavigator} />
      <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
      <Stack.Screen name="ApplicantProfile" component={ApplicantProfileScreen} />
      <Stack.Screen name="CompanySettings" component={CompanySettingsScreen} />
      <Stack.Screen name="CreateJob" component={CreateJobScreen} />
    </Stack.Navigator>
  )
}

export default CompanyNavigator
