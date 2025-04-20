"use client";

import { ReactNode, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from "react-native";

import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { useQuery } from "@tanstack/react-query";
// Mock API calls
const fetchDashboardStats = async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    totalUsers: 1245,
    totalJobs: 378,
    activeJobs: 256,
    pendingReports: 12,
    newUsersToday: 24,
    newJobsToday: 8,
    userGrowth: [120, 145, 165, 190, 220, 250, 280],
    jobGrowth: [30, 45, 60, 75, 90, 110, 130],
    revenueGrowth: [1200, 1500, 1800, 2200, 2500, 2800, 3200],
  };
};

const AdminDashboardScreen = () => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const screenWidth = Dimensions.get("window").width;

  const { data, isLoading, refetch } = useQuery(
    {
        queryKey: ["dashboardStats"],
        queryFn: fetchDashboardStats,
    }
  );

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const chartConfig = {
    backgroundGradientFrom: theme.cardBackground,
    backgroundGradientTo: theme.cardBackground,
    color: (opacity = 1) => theme.primary + opacity * 255,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    labelColor: () => theme.text,
  };

  const userChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        data: data?.userGrowth || [0, 0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(71, 117, 234, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ["User Growth"],
  };

  const jobChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        data: data?.jobGrowth || [0, 0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ["Job Growth"],
  };

  const revenueChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        data: data?.revenueGrowth || [0, 0, 0, 0, 0, 0, 0],
        color: (opacity = 1) => `rgba(241, 196, 15, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ["Revenue ($)"],
  };

  const StatCard = ({
    icon,
    title,
    value,
    color,
    onPress,
  }: {
    icon: ReactNode;
    title: string;
    value: number | undefined;
    color: any;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.statCard, { backgroundColor: theme.cardBackground }]}
      onPress={onPress}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + "20" }]}>
        {icon}
      </View>
      <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: theme.textSecondary }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  if (isLoading && !data) {
    return (
      <View
        style={[styles.loadingContainer, { backgroundColor: theme.background }]}
      >
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.text }]}>
          Loading dashboard data...
        </Text>
      </View>
    );
  }

  return (
     <ScrollView
      style={[styles.container, { backgroundColor: theme.background, paddingTop: Platform.OS === 'ios' ? 20 : 30 }]}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[theme.primary]}
        />
      }
    >
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          Admin Dashboard
        </Text>
        <TouchableOpacity
          style={[
            styles.settingsButton,
            { backgroundColor: theme.cardBackground },
          ]}
          //   @ts-ignore
          onPress={() => navigation.navigate("AdminSettings")}
        >
          <Ionicons name="settings-outline" size={22} color={theme.text} />
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Overview</Text>
      <View style={styles.statsContainer}>
        <StatCard
          icon={<Ionicons name="people" size={24} color="#4775EA" />}
          title="Total Users"
          value={data?.totalUsers}
          color="#4775EA"
          //   @ts-ignore
          onPress={() => navigation.navigate("AdminUsers")}
        />
        <StatCard
          icon={<Ionicons name="briefcase" size={24} color="#2ECC71" />}
          title="Total Jobs"
          value={data?.totalJobs}
          color="#2ECC71"
          //   @ts-ignore
          onPress={() => navigation.navigate("AdminJobs")}
        />
        <StatCard
          icon={<MaterialIcons name="work" size={24} color="#3498DB" />}
          title="Active Jobs"
          value={data?.activeJobs}
          color="#3498DB"
          //   @ts-ignore
          onPress={() => navigation.navigate("AdminJobs")}
        />
        <StatCard
          icon={<Ionicons name="flag" size={24} color="#E74C3C" />}
          title="Pending Reports"
          value={data?.pendingReports}
          color="#E74C3C"
          //   @ts-ignore
          onPress={() => navigation.navigate("AdminReports")}
        />
      </View>

      <View style={styles.todayStatsContainer}>
        <View
          style={[styles.todayStat, { backgroundColor: theme.cardBackground }]}
        >
          <Text style={[styles.todayStatValue, { color: theme.text }]}>
            +{data?.newUsersToday}
          </Text>
          <Text style={[styles.todayStatTitle, { color: theme.textSecondary }]}>
            New Users Today
          </Text>
        </View>
        <View
          style={[styles.todayStat, { backgroundColor: theme.cardBackground }]}
        >
          <Text style={[styles.todayStatValue, { color: theme.text }]}>
            +{data?.newJobsToday}
          </Text>
          <Text style={[styles.todayStatTitle, { color: theme.textSecondary }]}>
            New Jobs Today
          </Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        User Growth
      </Text>
      <View
        style={[
          styles.chartContainer,
          { backgroundColor: theme.cardBackground },
        ]}
      >
        <LineChart
          data={userChartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>
        Job Growth
      </Text>
      <View
        style={[
          styles.chartContainer,
          { backgroundColor: theme.cardBackground },
        ]}
      >
        <LineChart
          data={jobChartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Revenue</Text>
      <View
        style={[
          styles.chartContainer,
          { backgroundColor: theme.cardBackground },
        ]}
      >
        <LineChart
          data={revenueChartData}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.quickActionsContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Quick Actions
        </Text>
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[
              styles.quickActionButton,
              { backgroundColor: theme.primary },
            ]}
            //   @ts-ignore
            onPress={() => navigation.navigate("AdminUsers")}
          >
            <Ionicons name="people" size={24} color="#fff" />
            <Text style={styles.quickActionText}>Manage Users</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.quickActionButton,
              { backgroundColor: theme.primary },
            ]}
            //   @ts-ignore
            onPress={() => navigation.navigate("AdminJobs")}
          >
            <Ionicons name="briefcase" size={24} color="#fff" />
            <Text style={styles.quickActionText}>Manage Jobs</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.quickActionButton,
              { backgroundColor: theme.primary },
            ]}
            //   @ts-ignore
            onPress={() => navigation.navigate("AdminReports")}
          >
            <Ionicons name="flag" size={24} color="#fff" />
            <Text style={styles.quickActionText}>View Reports</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  settingsButton: {
    padding: 10,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 14,
  },
  todayStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
  },
  todayStat: {
    width: "48%",
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  todayStatValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  todayStatTitle: {
    fontSize: 14,
  },
  chartContainer: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 10,
  },
  quickActionsContainer: {
    marginBottom: 30,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  quickActionButton: {
    width: "31%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionText: {
    color: "#fff",
    marginTop: 5,
    fontWeight: "500",
    textAlign: "center",
  },
});

export default AdminDashboardScreen;
