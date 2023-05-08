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
  //GETS THE USER SUMMARY LENGTH//
  return (
      <Tab.Navigator 
        screenOptions={{
          tabBarStyle: {backgroundColor: "#A2C4C9"},
        }}
      >
        <Tab.Screen
          name="BottomHome"
          component={HomeStackNavigator}
          options={{
            headerShown: false,
            tabBarShowLabel: true,
            tabBarLabel: "Feed",
            showIcon: true,
            tabBarIcon:({color})=>(
              <Ionicons name="newspaper-outline" size={28} color = {color}/>
              ),
              tabBarActiveTintColor: "#FFFFFF",
              tabBarInactiveTintColor: "#134F5C"
          }}
          style={{ color: '#A2C4C9' }}
        />
        <Tab.Screen
          options={{
            headerShown: false,
            tabBarShowLabel: true,
            tabBarLabel: "Top News",
            showIcon: true,
            tabBarIcon:({color})=>(
              <Ionicons name="flame-outline" size={28} color = {color}/>
              ),
              tabBarActiveTintColor: "#FFFFFF",
              tabBarInactiveTintColor: "#134F5C"
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
            tabBarIcon:({color})=>(
              <Ionicons name="duplicate-outline" size={28} color = {color}/>
              ),
              tabBarActiveTintColor: "#FFFFFF",
              tabBarInactiveTintColor: "#134F5C"
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
            tabBarIcon:({color})=>(
              <Ionicons name="person-circle-outline" size={28} color = {color}/>
              ),
            tabBarActiveTintColor: "#FFFFFF",
            tabBarInactiveTintColor: "#134F5C"
          }}
          name="BottomSetting"
          component={SettingStackNavigator}
        />
      </Tab.Navigator>
  );
};

export default BottomTabNavigator;
