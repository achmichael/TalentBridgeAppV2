import { User } from "./User";
import { Category } from "./CategoryPost";
import { Application } from "./Application";
import { Job } from "./Job";
export interface Post {
  id: string;
  posted_by: string;
  title: string;
  description: string;
  price: number;
  level_id: number;
  required_skills: string[] | string; // tergantung bagaimana dikembalikan dari backend
  min_experience_years: number;
  category: Category;
  created_at: string;
  updated_at: string;
  applications_count: number;
  user: User;
  applications: Application[];
  category_id: number;
  status: 'open' | 'closed';
  job: Job | null;
}