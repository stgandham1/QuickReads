import { StatusBar } from "expo-status-bar";
import React from "react";
import { useFonts } from "expo-font";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import BottomTabNavigator from "./routes/buttomTab";
import Home from "./screens/home";
import ReviewDetail from "./screens/reviewDetails";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  // const [loaded] = useFonts({
  //   "n-regular": require("./assets/fonts/Nunito-Regular.ttf"),
  //   "n-bold": require("./assets/fonts/Nunito-Bold.ttf"),
  // });
  // if (!loaded) {
  //   return null; //If Fonts not Loaded, return Null
  // }
  const [loaded] = useFonts({
    "n-regular": require("./assets/fonts/Nunito-Regular.ttf"),
    "n-bold": require("./assets/fonts/Nunito-Bold.ttf"),
  });
  if (!loaded) {
    return null;
  }
  return (
    <NavigationContainer>
      <BottomTabNavigator />
    </NavigationContainer>
  );
  // return (
  //   <NavigationContainer>
  //     <Stack.Navigator>
  //       {/* NATHANIEL'S COMPONENTS: LOGIN AND HOME */}
  //       <Stack.Screen options = {{headerShown: false}} name="Login" component={LoginPage} />
  //       <Stack.Screen options = {{headerShown: false}} name="Home" component={HomePage} />
  //       {/* HAORAN'S COMPONENTS: ARTICLE CONTAINER (HOME) AND ARTICLE REVIEW DETAILS*/}
  //       {/* <Stack.Screen  name="HomePage" component={Home} />
  //       <Stack.Screen  name="ReviewDetail" component={ReviewDetail} /> */}
  //     </Stack.Navigator>
  //   </NavigationContainer>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
