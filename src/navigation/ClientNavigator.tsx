"use client"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useTheme } from "../contexts/ThemeContext"

// Screens
import ClientDashboardScreen from "../screens/client/ClientDashboardScreen"
import ClientSearchScreen from "../screens/client/ClientSearchScreen"
import ClientProjectsScreen from "../screens/client/ClientProjectsScreen"
import ClientNotificationsScreen from "../screens/client/ClientNotificationsScreen"
import ClientProfileScreen from "../screens/client/ClientProfileScreen"
import ClientSettingsScreen from "../screens/client/ClientSettingsScreen"
import JobDetailsScreen from "../screens/client/JobDetailsScreen"
import FreelancerProfileScreen from "../screens/client/FreelancerProfileScreen"

// Stack param lists
export type ClientStackParamList = {
  ClientTabs: undefined
  JobDetails: { jobId: string }
  FreelancerProfile: { freelancerId: string }
  ClientSettings: undefined
}

export type ClientTabParamList = {
  Dashboard: undefined
  Search: undefined
  Projects: undefined
  Notifications: undefined
  Profile: undefined
}

const Stack = createStackNavigator<ClientStackParamList>()
const Tab = createBottomTabNavigator<ClientTabParamList>()

// Tab Navigator
const ClientTabNavigator = () => {
  const { theme } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
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
        component={ClientDashboardScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={ClientSearchScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="search-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Projects"
        component={ClientProjectsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <MaterialIcons name="work-outline" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={ClientNotificationsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications-outline" size={size} color={color} />,
          tabBarBadge: 3,
          tabBarBadgeStyle: { backgroundColor: theme.notification },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ClientProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  )
}

// Stack Navigator
const ClientNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ClientTabs" component={ClientTabNavigator} />
      <Stack.Screen name="JobDetails" component={JobDetailsScreen} />
      <Stack.Screen name="FreelancerProfile" component={FreelancerProfileScreen} />
      <Stack.Screen name="ClientSettings" component={ClientSettingsScreen} />
    </Stack.Navigator>
  )
}

export default ClientNavigator
