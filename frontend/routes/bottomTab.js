import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  MainStackNavigator,
  ContactStackNavigator,
  SettingStackNavigator,
} from "./homeStack";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        options={{ headerShown: false }}
        name="BottomHome"
        component={MainStackNavigator}
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="BottomContact"
        component={ContactStackNavigator}
      />
      <Tab.Screen
        options={{ headerShown: false }}
        name="BottomSetting"
        component={SettingStackNavigator}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
