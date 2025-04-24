import { useState } from "react";
import { baseUrl } from "@/src/config/baseUrl";

const useRegister = () => {
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const register = async (username: string, email: string, password: string, role: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`${baseUrl}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                    role,
                }),
            });

            if (!response.ok) {
                throw new Error("Registration failed!");
            }

            const result = await response.json();
            setToken(result.data.token);
            return result.data;
        } catch (error) {
            setToken(null);
            setError("Registration failed. Please try again.");
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    return { register, isLoading, error, token };
}

export default useRegister;