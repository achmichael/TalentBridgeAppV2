import { Post } from "./Post";

export interface Job {
  id: string;
  post_id: string;
  number_of_employee: number;
  duration: number;
  status: 'open' | 'closed'; // asumsikan hanya dua status
  type_job: 'full-time' | 'part-time' | 'contract'; // sesuaikan jika ada jenis lain
  type_salary: 'fixed' | 'flexible'; // sesuai dari data
  system: 'wfo' | 'wfh' | 'hybrid'; // tambahkan jika ada opsi lain
  created_at: string;
  updated_at: string;
  post: Post;
}

