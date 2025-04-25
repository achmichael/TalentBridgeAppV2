import { useState } from "react";
import { baseUrl } from "@/src/config/baseUrl";

const useLogin = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
           username,
           password, 
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || "Login failed!");
      }

      return result.data;
    } catch (error) {
      setError("Login failed. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { login, isLoading, error };
};

export default useLogin;
