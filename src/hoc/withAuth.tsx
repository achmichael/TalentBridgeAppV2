import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from '@/src/contexts/AuthContext';
import { baseUrl } from '@/src/config/baseUrl';
import { useTheme } from '@/src/contexts/ThemeContext';
import { navigationRef } from '@/App';
import { CommonActions } from '@react-navigation/native';

const redirectToAuth = () => {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
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
          redirectToAuth();
          return;
        }

        try {
          const response = await fetch(`${baseUrl}/verify-token`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          const data = await response.json();

          if (!response.ok || !data.valid) {
            logout();
            redirectToAuth();
          }
        } catch (error) {
          console.error('Error verifying token:', error);
          logout();
          redirectToAuth();
        } finally {
          setIsVerifying(false);
        }
      };

      verifyToken();
    }, [token, user, logout]);

    if (isVerifying) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
          <ActivityIndicator size="large" color={theme.accent} />
        </View>
      );
    }

    return <WrappedComponent {...props} />;
  };


  WithAuth.displayName = `WithAuth(${getDisplayName(WrappedComponent)})`;
  
  return WithAuth;
};


function getDisplayName(WrappedComponent: React.ComponentType<any>) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withAuth;
