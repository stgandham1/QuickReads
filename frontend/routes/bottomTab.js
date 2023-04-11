import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  HomeStackNavigator,
  CategoryStackNavigator,
  SettingStackNavigator,
} from "./homeStack";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        options={{ headerShown: false, tabBarShowLabel:true,tabBarLabel:"Feed",}}
        name="BottomHome"
        component={HomeStackNavigator}
      />
      <Tab.Screen
        options={{ headerShown: false, tabBarShowLabel:true, tabBarLabel:"Category", }}
        name="BottomCategory"
        component={CategoryStackNavigator}
      />
      <Tab.Screen
        options={{ headerShown: false, tabBarShowLabel:true, tabBarLabel:"Settings",}}
        name="BottomSetting"
        component={SettingStackNavigator}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
