import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import OnboardingScreen from "../screens/auth/OnboardingScreen";
import FreelancerRegistration from "../screens/auth/FreelancerRegistration";
import CompanyRegistration from "../screens/auth/CompanyRegistration";

export type AuthStackParamList = {
  Onboarding: undefined;
  Login: undefined;
  Register: undefined;
  FreelancerRegistration: undefined;
  CompanyRegistration: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "white" },
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen
        name="FreelancerRegistration"
        component={FreelancerRegistration}
      />
      <Stack.Screen
        name="CompanyRegistration"
        component={CompanyRegistration}
      />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
