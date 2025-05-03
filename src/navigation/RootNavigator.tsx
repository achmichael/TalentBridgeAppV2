"use client";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../contexts/AuthContext";
import AuthNavigator from "./AuthNavigator";
import ClientNavigator from "./ClientNavigator";
import FreelancerNavigator from "./FreelancerNavigator";
import CompanyNavigator from "./CompanyNavigator";
import AdminNavigator from "./AdminNavigator";
import LoadingScreen from "../screens/common/LoadingScreen";
import ChatScreen from "../screens/global/ChatScreen";
import ChatRoom from "../screens/global/ChatRoom";
import CallScreen from "../screens/global/CallScreen";

const Stack = createStackNavigator();

const RootNavigator = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Auth" component={AuthNavigator} />
      <Stack.Screen name="ClientRoot" component={ClientNavigator} />
      <Stack.Screen name="FreelancerRoot" component={FreelancerNavigator} />
      <Stack.Screen name="CompanyRoot" component={CompanyNavigator} />
      <Stack.Screen name="AdminRoot" component={AdminNavigator} />
      <Stack.Screen name="Chat" component={ChatScreen} />
      <Stack.Screen name="ChatRoom" component={ChatRoom} />
      <Stack.Screen name="Call" component={CallScreen} />  
    </Stack.Navigator>
  );
};

export default RootNavigator;
