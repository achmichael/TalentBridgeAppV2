import { createNavigationContainerRef } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export function redirectBasedOnRole(role: string) {
  if (navigationRef.isReady()) {
    console.log("Redirecting to role:", role);
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
    console.log("Navigation is not ready");
  }
}

export const redirectToCompletedProfile = (role: string) => {
  if (role === "freelancer") {
    navigationRef.navigate("FreelancerRegistration" as never);
  } else if (role === "company") {
    navigationRef.navigate("CompanyRegistration" as never);
  }
};

export const redirectToAuth = (navigation: any) => {
  if (!navigation) {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      })
    );
  }
};
