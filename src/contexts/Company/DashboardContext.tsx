import { createContext, useContext, useState, useMemo } from "react";
import { QueryObserverResult, useQuery } from "@tanstack/react-query";
import { baseUrl } from "../../config/baseUrl";
import { useAuth } from "../AuthContext";
import LoadingScreen from "../../screens/common/LoadingScreen";

interface DashboardContextType {
  isLoading: boolean;
  data: any;
  refetch: () => Promise<QueryObserverResult<any, Error>>;
  filteredData: any;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const DashboardProvider: React.FC<{
  children: React.ReactNode;
  searchQuery?: string;
}> = ({ children }) => {
  const { token, user } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>("");

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
      console.log("Dashboard data:", result.data);
      return result.data;
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      throw error;
    }
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["dashboardCompanyData"],
    queryFn: fetchDashboardData,
  });

  const filteredData = useMemo(() => {
    if (!data || !searchQuery.trim()) return data;

    const query = searchQuery.toLowerCase();

    const filteredJobs = data?.jobs?.filter((item: any) => {
      const title =
        typeof item?.post?.title === "string"
          ? item.post.title.toLowerCase()
          : "";

      const description =
        typeof item?.post?.description === "string"
          ? item.post.description.toLowerCase()
          : "";

      let company = "";
      if (item?.post?.user?.company?.name) {
        company =
          typeof item.post.user.company.name === "string"
            ? item.post.user.company.name.toLowerCase()
            : "";
      }

      const address =
        typeof item?.post?.user?.company?.address === "string"
          ? item.post.user.company.address.toLowerCase()
          : "";

      return (
        title.includes(query) ||
        description.includes(query) ||
        company.includes(query) ||
        address.includes(query)
      );
    });

    const filteredTeams = data?.user?.company?.employees?.filter(
      (person: any) => {
        const name =
          typeof person?.employee?.username === "string"
            ? person?.employee?.username.toLowerCase()
            : "";
        const position =
          typeof person?.position === "string"
            ? person.position.toLowerCase()
            : "";

        return name.includes(query) || position.includes(query);
      }
    );

    return {
      ...data,
      jobs: filteredJobs,
      user: {
        ...data?.user,
        company: {
          ...data?.user?.company,
          employees: filteredTeams,
        },
      },
    };
  }, [data, searchQuery]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <DashboardContext.Provider
      value={{
        isLoading,
        data,
        refetch,
        filteredData,
        searchQuery,
        setSearchQuery,
      }}
    >
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
