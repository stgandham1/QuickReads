import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Feed from "../screens/Feed";
import Category from "../screens/Category";
import Setting from "../screens/setting";
import Newsletter from "../screens/Newsletter";
import Bookmark from "../screens/Bookmark";

const Stack = createNativeStackNavigator();

const screenOptionStyle = {
  headerStyle: {
    backgroundColor: "#A2C4C9",
  },
  headerTintColor: "white",
  headerBackTitle: "Back",
};

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Feed" component={Feed} />
    </Stack.Navigator>
  );
};

const CategoryStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Categories" component={Category} />
    </Stack.Navigator>
  );
};

const SettingStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Settings" component={Setting} />
      <Stack.Screen name="Bookmark" component={Bookmark} />
    </Stack.Navigator>
  );
};

const NewsletterStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={screenOptionStyle}>
      <Stack.Screen name="Top News" component={Newsletter} />
    </Stack.Navigator>
  );
};

export {
  HomeStackNavigator,
  CategoryStackNavigator,
  SettingStackNavigator,
  NewsletterStackNavigator,
};
