import React, { useState } from "react";
import { StyleSheet, View, Text, Button, TouchableOpacity } from "react-native";
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
  const [wordLength, setWordLength] = useState(1);
  const shortPress = () => {
    setWordLength(1);
    console.log("choose short word length");
  };
  const mediumPress = () => {
    setWordLength(2);
    console.log("choose medium word length");
  };
  const longPress = () => {
    setWordLength(3);
    console.log("choose long word length");
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
      <View style={{ flex: 0.1, marginBottom: 10 }}>
        <Button
          title="Bookmark"
          onPress={BookmarkPressHandler}
          style={{ marginTop: 505 }}
        />
      </View>
      <Text style={globalStyles.homeText}>Choose word length:</Text>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          {wordLength == 1 ? (
            <TouchableOpacity
              style={globalStyles.orangeButton}
              onPress={shortPress}
            >
              <Text> Short </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={globalStyles.grayButton}
              onPress={shortPress}
            >
              <Text> Short </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={{ flex: 1 }}>
          {wordLength == 2 ? (
            <TouchableOpacity
              style={globalStyles.orangeButton}
              onPress={mediumPress}
            >
              <Text> Medium </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={globalStyles.grayButton}
              onPress={mediumPress}
            >
              <Text> Medium </Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={{ flex: 1 }}>
          {wordLength == 3 ? (
            <TouchableOpacity
              style={globalStyles.orangeButton}
              onPress={longPress}
            >
              <Text> Long </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={globalStyles.grayButton}
              onPress={longPress}
            >
              <Text> Long </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
