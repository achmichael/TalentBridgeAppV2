import { createContext, useContext, useState, useEffect } from "react";
import { useTheme } from "../ThemeContext";
import { baseUrl } from "../../config/baseUrl";
import { useAuth } from "../AuthContext";
import { Job } from "../../types/Job";
import { Application } from "../../types/Application";
import { Employee } from "../../types/Employee";
import LoadingScreen from "../../screens/common/LoadingScreen";

interface DashboardData {
  jobs: Job[];
  applications: Application[];
  employees: Employee[];
}

interface DashboardContextType {
  isLoading: boolean;
  data: DashboardData | null;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const DashboardProvider: React.FC<{
  children: React.ReactNode;
  searchQuery?: string;
}> = ({ children, searchQuery }) => {
  const { theme } = useTheme();
  const { token, user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!token) return;
      try {
        const response = await fetch(`${baseUrl}/jobs/company-jobs`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user?.id,
          }),
        });

        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch dashboard data");
        }

        setData(result.data);
        return result.data;
      } catch (error) {
        setData(null);
        console.error("Error fetching dashboard data:", error);
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  useEffect(() => {
    if (!searchQuery) return;

    if (data) {
      const { jobs, applications, employees } = data;

      const filteredJobs = jobs.filter((job: Job) =>
        job.post.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const filteredApplications = applications.filter(
        (application: Application) =>
          application.applicant?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );

      const filteredEmployees = employees.filter((employee: Employee) =>
        employee.employee?.name
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase())
      );

      setData({
        jobs: filteredJobs,
        applications: filteredApplications,
        employees: filteredEmployees,
      });
    }
  }, [searchQuery, data]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <DashboardContext.Provider value={{ isLoading, data }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined)
    throw new Error("useDashboard must be used within a DashboardProvider");
  return context;
};
