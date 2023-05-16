import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, Button, TouchableOpacity } from "react-native";
import { globalStyles } from "../styles/global";
import { useNavigation } from "@react-navigation/native";
import SelectDropdown from "react-native-select-dropdown";
import { FontAwesome } from "@expo/vector-icons";
export default function About() {
  const root =
    "http://quickreads-env.eba-nmhvwvfp.us-east-1.elasticbeanstalk.com";
  let accessToken = global.id;
  const [chosenLang, setChosenLang] = useState("");
  const [chosenCountry, setChosenCountry] = useState("");
  const [wordLength, setWordLength] = useState(2);
  async function getLang() {
    console.log(root + "/getlang/" + accessToken);
    const request = await fetch(root + "/getlang/" + accessToken, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJSON) => {
        setChosenLang(responseJSON["lang"]);
      })
      .catch();
  }

  async function getCountry() {
    console.log(root + "/getcountry/" + accessToken);
    const request = await fetch(root + "/getcountry/" + accessToken, {
      method: "GET",
    })
      .then((response) => {
        return response.text();
      })
      .then((responseJSON) => {
        console.log(responseJSON);
        setChosenCountry(responseJSON);
      })
      .catch();
  }
  async function getLength() {
    console.log(root + "/getsummarylength/" + accessToken);
    const request = await fetch(root + "/getsummarylength/" + accessToken, {
      method: "GET",
    })
      .then((response) => {
        //console.log(response);
        return response.text();
      })
      .then((responseJSON) => {
        console.log(responseJSON);
        if (responseJSON == "medium") {
          setWordLength(2);
        } else if (responseJSON == "long") {
          setWordLength(3);
        } else {
          setWordLength(1);
        }
      })
      .catch();
  }

  async function addLangToBackend(item) {
    const body = { id: accessToken, lang: item };
    try {
      const response = await fetch(root + "/updatelang", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error occurred:", error.message);
    }
  }

  async function addCountryToBackend(item) {
    const body = { id: accessToken, country: item };
    try {
      const response = await fetch(root + "/changecountry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error occurred:", error.message);
    }
  }

  async function addLengthToBackend(item) {
    const body = { id: accessToken, length: item };
    try {
      const response = await fetch(root + "/changesummarylength", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error occurred:", error.message);
    }
  }

  useEffect(() => {
    getLang();
    getCountry();
    getLength();
  }, []);
  const navigation = useNavigation();
  const pressHandler = () => {
    navigation.replace("Login");
  };
  const BookmarkPressHandler = () => {
    navigation.navigate("Bookmark");
  };
  console.log("Entering Settings");

  const shortPress = () => {
    setWordLength(1);
    addLengthToBackend("short");
    console.log("choose short word length");
  };
  const mediumPress = () => {
    setWordLength(2);
    addLengthToBackend("medium");
    console.log("choose medium word length");
  };
  const longPress = () => {
    setWordLength(3);
    addLengthToBackend("long");
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
    <View style={[globalStyles.container]}>
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
        //defaultValueByIndex={2}
        defaultValue={chosenLang}
        onSelect={(selectedItem, index) => {
          console.log(selectedItem, index);
          //then tell backend languange changing
          addLangToBackend(selectedItem);
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

      <Text style={globalStyles.homeText}>{"\n"}Choose Country:</Text>
      <SelectDropdown
        data={countries}
        //defaultValueByIndex={2}
        defaultValue={chosenCountry}
        onSelect={(selectedItem, index) => {
          console.log(selectedItem, index);
          //then tell backend languange changing
          addCountryToBackend(selectedItem);
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
