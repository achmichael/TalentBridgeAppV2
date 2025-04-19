"use client"
import { createStackNavigator } from "@react-navigation/stack"
import { useAuth } from "../contexts/AuthContext"
import AuthNavigator from "./AuthNavigator"
import ClientNavigator from "./ClientNavigator"
import FreelancerNavigator from "./FreelancerNavigator"
import CompanyNavigator from "./CompanyNavigator"
// import AdminNavigator from "./AdminNavigator"
import LoadingScreen from "../screens/common/LoadingScreen"

const Stack = createStackNavigator()

const RootNavigator = () => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : (
        <>
          {user.role === "client" && <Stack.Screen name="ClientRoot" component={ClientNavigator} />}
          {user.role === "freelancer" && <Stack.Screen name="FreelancerRoot" component={FreelancerNavigator} />}
          {user.role === "company" && <Stack.Screen name="CompanyRoot" component={CompanyNavigator} />}
          {/* {user.role === "admin" && <Stack.Screen name="AdminRoot" component={AdminNavigator} />} */}
        </>
      )}
    </Stack.Navigator>
  )
}

export default RootNavigator
