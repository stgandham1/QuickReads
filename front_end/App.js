import React from "react";
import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import BottomTabNavigator from "./routes/buttomTab";

const App = () => {
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
};
export default App;
