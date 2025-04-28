export type History = { // history type that same with contracts table
  id: string; // UUID for the proposal
  contractType: string; // Type of the contract
  contractTypeId: string; // Polymorphic relation ID
  providerId: string; // ID of the provider (user)
  contractDate: string; // Timestamp for the contract date
  status: "active" | "completed" | "terminated" | "pending"; // Enum for contract status
  createdAt: string; // Timestamp for when the proposal was created
  updatedAt: string; // Timestamp for when the proposal was last updated
}
