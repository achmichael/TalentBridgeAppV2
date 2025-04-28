import { Company } from "./Company";

export type Employee = {
    id: string;
    company: Company; 
    employee: any;
    position: string;
    status: "active" | "inactive" | "cuty" | "resigned";
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}