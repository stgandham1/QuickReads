import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigator  from "./bottomTab";
import LoginPage from "../screens/LoginPage";

const Stack = createNativeStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "#9AC4F8",
  },
  headerTintColor: "white",
  headerBackTitle: "Back",
};

const LoginStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="LoginPage" component={LoginPage} />
      <Stack.Screen options={{ headerShown: false }} name="BottomTabNavigator" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
};

export { LoginStackNavigator };
