import { Post } from "./Post";

export type Application = {
    id: string; // UUID
    post: Post; // UUID, refers to the post
    applicant: any; // UUID, refers to the user
    apply_file: string; // Path to the apply file (string with max length of 300)
    amount: number; // Float value for the amount
    status: 'pending' | 'accepted' | 'rejected'; // Enum type for status
    created_at: string; // Timestamp string (ISO format)
    updated_at: string; // Timestamp string (ISO format)
};

