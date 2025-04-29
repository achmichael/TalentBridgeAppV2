export type User = {
    id: string;
    username: string;
    email: string;
    role: "client" | "freelancer" | "company" | "admin";
    phone_number?: string;
    profile_picture?: string;
    is_verified: boolean;
}