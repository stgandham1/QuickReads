import {React, useContext} from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  HomeStackNavigator,
  CategoryStackNavigator,
  SettingStackNavigator,
  NewsletterStackNavigator,
} from "./homeStack";
import { Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { globalStyles } from "../styles/global";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = ({route}) => {
  const { userInfo } = route.params;
  return (
      <Tab.Navigator>
        <Tab.Screen
          name="BottomHome"
          component={HomeStackNavigator}
          options={{
            headerShown: false,
            tabBarShowLabel: true,
            tabBarLabel: "Feed",
            showIcon: true,
            tabBarIcon:({focused})=>(
              <Ionicons name="newspaper-outline" size={28} color = "#4991eb"/>
              ),
          }}
          style={{ color: '#9489a3' }}
        />
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarShowLabel: true,
            tabBarLabel: "Top News",
            showIcon: true,
            tabBarIcon:({focused})=>(
              <Ionicons name="flame-outline" size={28} color = "#4991eb"/>
              ),
          }}
          name="BottomNewsletter"
          component={NewsletterStackNavigator}
        />
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarShowLabel: true,
            tabBarLabel: "Categories",
            showIcon: true,
            tabBarIcon:({focused})=>(
              <Ionicons name="duplicate-outline" size={28} color = "#4991eb"/>
              ),
          }}
          name="BottomCategory"
          component={CategoryStackNavigator}
        />
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarShowLabel: true,
            tabBarLabel: "Settings",
            showIcon: true,
            tabBarIcon:({focused})=>(
              <Ionicons name="person-circle-outline" size={28} color = "#4991eb"/>
              ),
          }}
          name="BottomSetting"
          component={SettingStackNavigator}
        />
      </Tab.Navigator>
  );
};

export default BottomTabNavigator;
