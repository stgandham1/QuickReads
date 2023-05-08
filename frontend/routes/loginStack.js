import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import BottomTabNavigator  from "./bottomTab";
import Login from "../screens/Login";

const Stack = createNativeStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "#A2C4C9",
  },
  headerTintColor: "white",
  headerBackTitle: "Back",
};

const LoginStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen options={{ headerShown: false }} name="BottomTabNavigator" component={BottomTabNavigator} />
    </Stack.Navigator>
  );
};

export { LoginStackNavigator };
