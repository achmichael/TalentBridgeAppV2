import { Post } from "./Post";

export type Job = {
  id: string;
  post: Post;
  minExperience: number;
  numberOffEmployees: number;
  duration: number; // in month e.g 3 month
  status: "open" | "closed";
  typeJob: "full-time" | "part-time" | "contract";
  type_salary: "fixed" | "flexible";
  system: "remote" | "onsite" | "hybrid";
  created_at: Date;
  updated_at: Date;
};

