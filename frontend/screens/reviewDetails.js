import React from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { globalStyles } from "../styles/global";

export default function ReviewDetail({ route, navigation }) {
  const pressHandler = () => {
    navigation.goBack();
  };
  const { title, content } = route.params;
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.titleText}>{title}</Text>
      <Text style={globalStyles.paragrph}>{content}</Text>
      <Button title="back to home" onPress={pressHandler} />
    </View>
  );
}
