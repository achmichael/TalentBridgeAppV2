"use client"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useTheme } from "../contexts/ThemeContext"

import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen"
import AdminUsersScreen from "../screens/admin/AdminUsersScreen"
import AdminJobsScreen from "../screens/admin/AdminJobsScreen"
import AdminReportsScreen from "../screens/admin/AdminReportsScreen"
import AdminSettingsScreen from "../screens/admin/AdminSettingsScreen"
import UserDetailsScreen from "../screens/admin/UserDetailsScreen"
import JobDetailsScreen from "../screens/admin/JobDetailsScreen"
import ReportDetailsScreen from "../screens/admin/ReportDetailsScreen"

export type AdminStackParamList = {
  AdminTabs: undefined
  UserDetails: { userId: string }
  JobDetails: { jobId: string }
  ReportDetails: { reportId: string }
  AdminSettings: undefined
}

export type AdminTabParamList = {
  Dashboard: undefined
  Users: undefined
  Jobs: undefined
  Reports: undefined
  Settings: undefined
}

const Stack = createStackNavigator<AdminStackParamList>()
const Tab = createBottomTabNavigator<AdminTabParamList>()

const AdminTabNavigator = () => {
  const { theme } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#9333EA", // Purple for admin
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
        component={AdminDashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="grid-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Users"
        component={AdminUsersScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Jobs"
        component={AdminJobsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="briefcase-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Reports"
        component={AdminReportsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="report-problem" size={size} color={color} />,
          tabBarBadge: 4,
          tabBarBadgeStyle: { backgroundColor: theme.notification },
        }}
      />
      <Tab.Screen
        name="Settings"
        component={AdminSettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}

// Stack Navigator
const AdminNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminTabs" component={AdminTabNavigator} />
      <Stack.Screen name="UserDetails" component={UserDetailsScreen} />
      <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
      <Stack.Screen name="ReportDetails" component={ReportDetailsScreen} />
      <Stack.Screen name="AdminSettings" component={AdminSettingsScreen} />
    </Stack.Navigator>
  )
}

export default AdminNavigator
