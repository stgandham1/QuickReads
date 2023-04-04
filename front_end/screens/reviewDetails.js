import React from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { globalStyles } from "../styles/global";

export default function ReviewDetail({ navigation }) {
  const pressHandler = () => {
    navigation.goBack();
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.titleText}>{navigation.getParam("title")}</Text>
      <Text style={globalStyles.paragrph}>
        {navigation.getParam("content")}
      </Text>
      <Button title="back to home" onPress={pressHandler} />
    </View>
  );
}
