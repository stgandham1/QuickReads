import React from "react";
import Home from "./screens/home";
import { useFonts } from "expo-font";
import Navigator from "./routes/homeStack";
export default function App() {
  const [loaded] = useFonts({
    "n-regular": require("./assets/fonts/Nunito-Regular.ttf"),
    "n-bold": require("./assets/fonts/Nunito-Bold.ttf"),
  });
  if (!loaded) {
    return null;
  }
  return <Navigator />;
}
