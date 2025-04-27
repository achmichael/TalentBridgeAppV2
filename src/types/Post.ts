import { Category } from "./CategoryPost";

export type Post = {
  id: string;
  title: string;
  level: {
    id: number;
    name: string;
    description?: string;
  };
  postedBy: string;
  description: string;
  price: number;
  requiredSkills: string[];
  category: Category;
  created_at: Date;
  updated_at: Date;
};
