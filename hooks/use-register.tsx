import { useState } from "react";
import { baseUrl } from "@/src/config/baseUrl";

type ErrorMessage = {
    success: false;
    message: string;
    errors?: {
      [key: string]: string[];
    };
  };
  

const useRegister = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errors, setErrors] = useState<ErrorMessage>({
        success: false,
        message: "",
        errors: {},
    });

    const register = async (username: string, email: string, password: string, password_confirmation: string, role: string) => {
        setIsLoading(true);
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
                    password_confirmation,
                    role_id: 2,
                }),
            });

            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.errors || "Registration failed!");
            }

            return result.data;
        } catch (error) {
            setErrors({
                success: false,
                message: (error as ErrorMessage)?.message || "Registration failed!",
                errors: (error as ErrorMessage)?.errors || {},
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    }

    return { register, isLoading, errors };
}

export default useRegister;