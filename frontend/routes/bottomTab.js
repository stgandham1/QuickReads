import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  HomeStackNavigator,
  CategoryStackNavigator,
  SettingStackNavigator,
  NewsletterStackNavigator,
} from "./homeStack";
import {Image} from 'react-native';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="BottomHome"
        component={HomeStackNavigator}
        options={{
          headerShown: false, 
          tabBarShowLabel:true,
          tabBarLabel:"Feed",
          // showIcon: true,
          // tabBarIcon:({focused})=>(
          //   focused?
          //   <Image source={require("../assets/quickreads_newsletter_icon.png")} style={{width:'40px'}}/>
          //   : <Image source={require("../assets/quickreads_newsletter_icon.png")} style={{width:'40px'}}/>
          // ),
        }}
      />
      <Tab.Screen
        options={{ headerShown: false, tabBarShowLabel:true, tabBarLabel:"Newsletter", }}
        name="BottomNewsletter"
        component={NewsletterStackNavigator}
      />
      <Tab.Screen
        options={{ headerShown: false, tabBarShowLabel:true, tabBarLabel:"Categories", }}
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
