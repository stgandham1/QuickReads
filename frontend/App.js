import React from "react";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { LoginStackNavigator } from "./routes/loginStack";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import LoginPage from "./screens/LoginPage";
// import BottomTabNavigator from "./routes/bottomTab";
// import Home from "./screens/home";
// import ReviewDetail from "./screens/reviewDetails";



export default function App() {
  const [loaded] = useFonts({
    "n-regular": require("./assets/fonts/Nunito-Regular.ttf"),
    "n-bold": require("./assets/fonts/Nunito-Bold.ttf"),
  });
  if (!loaded) {
    return null;
  }
  return (
      <NavigationContainer>
        <LoginStackNavigator />
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
