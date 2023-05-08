import React, { useState } from "react";
import { StyleSheet, View, Text, Button, TouchableOpacity } from "react-native";
import { globalStyles } from "../styles/global";
import { useNavigation } from "@react-navigation/native";
import SelectDropdown from "react-native-select-dropdown";
import { FontAwesome } from "@expo/vector-icons";
export default function About() {
  const navigation = useNavigation();
  const pressHandler = () => {
    navigation.replace("Welcome to QuickReads!");
  };
  const BookmarkPressHandler = () => {
    navigation.navigate("Bookmark");
  };
  const [wordLength, setWordLength] = useState(2);
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
  const countries = [
    "ar",
    "de",
    "en",
    "es",
    "fr",
    "he",
    "it",
    "nl",
    "no",
    "pt",
    "ru",
    "sv",
    "ud",
    "zh",
  ];
  return (
    <View style={[globalStyles.container] }>
      <Text style={globalStyles.titleText}>Settings</Text>
      <Text>Current User: {global.name}</Text>
      <View style={{ flex: 0.1, marginBottom: 10 }}>
        <Button
          title="Log Out"
          onPress={pressHandler}
          style={{ marginTop: 505 }}
          color="#A2C4C9"
        />
      </View>
      <View style={{ flex: 0.1, marginBottom: 10 }}>
        <Button
          title="Bookmark"
          onPress={BookmarkPressHandler}
          style={{ marginTop: 505 }}
          color="#A2C4C9"
        />
      </View>
      <Text style={globalStyles.homeText}>Choose Summary length:</Text>
      <View style={{ flex: 0.18, flexDirection: "row" }}>
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
      <Text style={globalStyles.homeText}>Choose Languange:</Text>
      <SelectDropdown
        data={countries}
        defaultValueByIndex={2}
        defaultValue={"en"}
        onSelect={(selectedItem, index) => {
          console.log(selectedItem, index);
          //then tell backend languange changing
        }}
        defaultButtonText={"Select country"}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
        buttonStyle={globalStyles.dropdown1BtnStyle}
        buttonTextStyle={globalStyles.dropdown1BtnTxtStyle}
        renderDropdownIcon={(isOpened) => {
          return (
            <FontAwesome
              name={isOpened ? "chevron-up" : "chevron-down"}
              color={"#444"}
              size={18}
            />
          );
        }}
        dropdownIconPosition={"right"}
        dropdownStyle={globalStyles.dropdown1DropdownStyle}
        rowStyle={globalStyles.dropdown1RowStyle}
        rowTextStyle={globalStyles.dropdown1RowTxtStyle}
      />
    </View>
  );
}
