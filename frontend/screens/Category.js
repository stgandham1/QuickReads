import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { globalStyles } from "../styles/global";

export default function Category() {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.titleText}>Add and Remove Categories</Text>
    </View>
  );
}
