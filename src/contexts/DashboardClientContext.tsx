import { createContext, useContext, useState, useEffect } from "react";
import { useTheme } from "./ThemeContext";
import { baseUrl } from "../config/baseUrl";
import { useAuth } from "./AuthContext";
import LoadingScreen from "../screens/common/LoadingScreen";
import { Job } from "../types/Job";
import { History } from "../types/History";
import { Application } from "../types/Application";

interface DashboardData {
  data: {
    jobs: Job[];
    completed: History[];
    proposals: Application[];
  };
}

interface DashboardContextType {
  isLoading: boolean;
  data: DashboardData | null;
}

const DashboardClientContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const DashboardClientProvider: React.FC<{
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
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: user?.id
          })
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
      const { jobs, completed, proposals } = data.data;

      const filteredJobs = jobs.filter((job: Job) =>
        job.post.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const filteredCompleted = completed.filter((application: History) =>
        application?.contractType?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      const filteredProposals = proposals.filter((proposal: Application) =>
        proposal?.post?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      );

      setData({
        data: {
          jobs: filteredJobs,
          completed: filteredCompleted,
          proposals: filteredProposals,
        },
      });
    }
  }, [searchQuery, data]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <DashboardClientContext.Provider value={{ isLoading, data }}>
      {children}
    </DashboardClientContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardClientContext);
  if (context === undefined) throw new Error("useDashboard must be used within a DashboardProvider");
  return context;
}
