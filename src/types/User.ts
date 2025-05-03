import { Company } from "./Company";
export interface User {
    id: string;
    username: string;
    email: string;
    role_id: number;
    phone_number: string | null;
    profile_picture: string | null;
    is_verified: number;
    created_at: string;
    updated_at: string;
    company: Company;
}