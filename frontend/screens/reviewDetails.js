import React from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { globalStyles } from "../styles/global";
import { useNavigation } from "@react-navigation/native";

export default function ReviewDetail() {
  const navigation = useNavigation();
  const pressHandler = () => {
    navigation.goBack();
  };

  return (
    <View style={globalStyles.container}>
      <h1>REVIEW DETAIL HERE</h1>
      <Text style={globalStyles.titleText}>{navigation.getParam("title")}</Text>
      <Text style={globalStyles.paragrph}>
        {navigation.getParam("content")}
      </Text>
      <Button title="back to home" onPress={pressHandler} />
    </View>
  );
}
