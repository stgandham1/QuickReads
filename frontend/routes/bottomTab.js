import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MainStackNavigator, ContactStackNavigator } from "./homeStack";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        options={{ headerShown: false }}
        name="Home"
        component={MainStackNavigator}
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="Contact"
        component={ContactStackNavigator}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
