import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "@/src/contexts/AuthContext";
import { baseUrl } from "@/src/config/baseUrl";
import { useTheme } from "@/src/contexts/ThemeContext";
import { CommonActions } from "@react-navigation/native";
import { navigationRef } from "@/App";
import LoadingScreen from "../screens/common/LoadingScreen";

const redirectToAuth = (navigation: any) => {
  if (!navigation) {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "Auth" }],
      })
    );
  }
};

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  const WithAuth = (props: any) => {
    const { user, token, logout } = useAuth();
    const { theme } = useTheme();
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
      const verifyToken = async () => {
        if (!token || !user) {
          setIsVerifying(false);
          redirectToAuth(navigationRef);
          return;
        }

        try {
          const response = await fetch(`${baseUrl}/verify-token`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();

          if (!response.ok || !data.success) {
            logout();
            redirectToAuth(navigationRef);
          }
        } catch (error) {
          logout();
          redirectToAuth(navigationRef);
        } finally {
          setIsVerifying(false);
        }
      };
      verifyToken();
    }, [token, user]);

    if (isVerifying) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: theme.background,
          }}
        >
          <LoadingScreen />
        </View>
      );
    }

    return <WrappedComponent {...props} />;
  };

  WithAuth.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;

  return WithAuth;
};

function getDisplayName(WrappedComponent: React.ComponentType<any>) {
  return WrappedComponent.displayName || WrappedComponent.name || "Component";
}

export default withAuth;
