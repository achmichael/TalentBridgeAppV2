import { navigationRef } from "@/App";

export function redirectBasedOnRole(role: string) {
  if (navigationRef.isReady()) {
    switch (role) {
      case "client":
        navigationRef.navigate("ClientRoot" as never);
        break;
      case "freelancer":
        navigationRef.navigate("FreelancerRoot" as never);
        break;
      case "company":
        navigationRef.navigate("CompanyRoot" as never);
        break;
      case "admin":
        navigationRef.navigate("AdminRoot" as never);
        break;
      default:
        navigationRef.navigate("Auth" as never);
    }
  } else {
    console.error("Navigation is not ready");
  }
}
