import { createContext, useContext, useState, useMemo } from "react";
import { useTheme } from "../ThemeContext";
import { baseUrl } from "../../config/baseUrl";
import { useAuth } from "../AuthContext";
import LoadingScreen from "../../screens/common/LoadingScreen";
import { Job } from "../../types/Job";
import { History } from "../../types/History";
import { Application } from "../../types/Application";
import { useQuery, QueryObserverResult } from "@tanstack/react-query";
import { Post } from "@/src/types/Post";

interface DashboardData {
  data: {
    jobs: Job[];
    completed: History[];
    proposals: Application[];
  };
}

interface DashboardContextType {
  isLoading: boolean;
  data: any | null;
  refetch: () => Promise<QueryObserverResult<any, Error>>;
  filteredData?: any;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const DashboardFreelancerContext = createContext<
  DashboardContextType | undefined
>(undefined);

export const DashboardFreelancerProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { token } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");

  const fetchDashboardData = async () => {
    if (!token) return;

    try {
      const response = await fetch(`${baseUrl}/posts`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('raw response:', response);

      const result = await response.json();

      console.log('result:', result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch dashboard data");
      }

      const transformedData = {
        jobs: result.data || [], 
        completed: [],
        proposals: []
      };

      console.log('Transformed data:', transformedData);
      
      return transformedData;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["jobs"],
    queryFn: fetchDashboardData,
  });

  const filteredData = useMemo(() => {
    if (!data) return { jobs: [], completed: [], proposals: [] };

    if (!searchQuery || searchQuery.trim() === '') return data;

    if (data && data.jobs) {
      const filteredJobs = data.jobs.filter((job: any) => {
        if (job.post) {
          return (
            job.post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.post.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (job.post.category?.category_name || '')
              .toLowerCase()
              .includes(searchQuery.toLowerCase())
          );
        }
        
        return (
          job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (job.category?.category_name || '')
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );
      });

      return {
        ...data,
        jobs: filteredJobs
      };
    }
    return data;
  }, [searchQuery, data]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <DashboardFreelancerContext.Provider
      value={{ isLoading, data, refetch, filteredData, searchQuery, setSearchQuery }}
    >
      {children}
    </DashboardFreelancerContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardFreelancerContext);
  if (context === undefined)
    throw new Error("useDashboard must be used within a DashboardProvider");
  return context;
};
