import { useState } from "react";
import { baseUrl } from "@/src/config/baseUrl";

const useLogin = () => {
  const [isLoading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

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

      if (!response.ok) {
        throw new Error("Login failed!");
      }

      const result = await response.json();
      setToken(result.data.token);
      return result.data;
    } catch (error) {
      setToken(null);
      setError("Login failed. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { login, isLoading, error, token };
};

export default useLogin;
