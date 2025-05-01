import React from "react";
import { useAuth } from "@/src/contexts/AuthContext";
import { redirectToAuth } from "../components/common/navigation";
import { navigationRef } from "../components/common/navigation";

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  const WithAuth = (props: any) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) redirectToAuth(navigationRef);

    return <WrappedComponent {...props} />;
  };

  WithAuth.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;

  return WithAuth;
};

function getDisplayName(WrappedComponent: React.ComponentType<any>) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default withAuth;
