import React from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { globalStyles } from "../styles/global";
import { useNavigation } from "@react-navigation/native";

export default function About() {
  const navigation = useNavigation();
  const pressHandler = () => {
    navigation.replace("Welcome to QuickReads!");
  };
  const BookmarkPressHandler = () => {
    navigation.navigate("Bookmark");
  };
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.titleText}>Settings</Text>
      <View style={{ flex: 0.1, marginBottom: 10 }}>
        <Button
          title="Log Out"
          onPress={pressHandler}
          style={{ marginTop: 505 }}
        />
      </View>
      <Button
        title="Bookmark"
        onPress={BookmarkPressHandler}
        style={{ marginTop: 505 }}
      />
    </View>
  );
}
