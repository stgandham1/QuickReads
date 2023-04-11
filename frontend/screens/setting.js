import React from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { globalStyles } from "../styles/global";
import { useNavigation } from "@react-navigation/native";

export default function About() {
  const navigation = useNavigation();
  const pressHandler = () => {
    navigation.replace("Welcome to QuickReads!");
  };
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.titleText}>Settings</Text>
      <Button title="Log Out" onPress={pressHandler} />
    </View>
  );
}
