import { Post } from "./Post";
import { User } from "./User";

export type Application = {
    id: string; // UUID
    post: Post; // UUID, refers to the post
    applicant_id: string;
    post_id: string;
    applicant: User; // UUID, refers to the user
    apply_file: string; // Path to the apply file (string with max length of 300)
    amount: number; // Float value for the amount
    status: 'pending' | 'accepted' | 'rejected'; // Enum type for status
    created_at: string; // Timestamp string (ISO format)
    updated_at: string; // Timestamp string (ISO format)
};

