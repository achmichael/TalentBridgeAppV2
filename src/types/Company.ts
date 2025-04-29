import { User } from "./User";
export type Company = {
  id: string;
  name: string;
  image: string;
  user: User;
  address?: string;
  website?: string;
  foundedAt?: string;
};
