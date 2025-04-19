"use client"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useTheme } from "../contexts/ThemeContext"

// Screens
import FreelancerDashboardScreen from "../screens/freelancer/FreelancerDashboardScreen"
import FreelancerJobsScreen from "../screens/freelancer/FreelancerJobsScreen"
import FreelancerProjectsScreen from "../screens/freelancer/FreelancerProjectsScreen"
import FreelancerNotificationsScreen from "../screens/freelancer/FreelancerNotificationsScreen"
import FreelancerProfileScreen from "../screens/freelancer/FreelancerProfileScreen"
import FreelancerSettingsScreen from "../screens/freelancer/FreelancerSettingsScreen"
import JobDetailsScreen from "../screens/freelancer/JobDetailsScreen"
import ClientProfileScreen from "../screens/freelancer/ClientProfileScreen"

// Stack param lists
export type FreelancerStackParamList = {
  FreelancerTabs: undefined
  JobDetails: { jobId: string }
  ClientProfile: { clientId: string }
  FreelancerSettings: undefined
}

export type FreelancerTabParamList = {
  Dashboard: undefined
  Jobs: undefined
  Projects: undefined
  Notifications: undefined
  Profile: undefined
}

const Stack = createStackNavigator<FreelancerStackParamList>()
const Tab = createBottomTabNavigator<FreelancerTabParamList>()

// Tab Navigator
const FreelancerTabNavigator = () => {
  const { theme } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.secondary,
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
        component={FreelancerDashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Jobs"
        component={FreelancerJobsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="briefcase-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Projects"
        component={FreelancerProjectsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="work-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={FreelancerNotificationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications-outline" size={size} color={color} />,
          tabBarBadge: 5,
          tabBarBadgeStyle: { backgroundColor: theme.notification },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={FreelancerProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}

// Stack Navigator
const FreelancerNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FreelancerTabs" component={FreelancerTabNavigator} />
      <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
      <Stack.Screen name="ClientProfile" component={ClientProfileScreen} />
      <Stack.Screen name="FreelancerSettings" component={FreelancerSettingsScreen} />
    </Stack.Navigator>
  )
}

export default FreelancerNavigator
