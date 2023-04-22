import React, { useEffect, useState } from "react";

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Button,
} from "react-native";
import { globalStyles } from "../styles/global";
import Checkbox from "expo-checkbox";
export default function ReviewDetail({ route, navigation }) {
  const { title, content, tags, key } = route.params;
  const [isSelected, setSelection] = useState(false);
  useEffect(() => {
    if (isSelected) {
      postData();
    }
  }, [isSelected]);
  const postData = () => {
    let state = "DATA I WANT TO SEND";
    let username = "nat"; //PLACEHOLDER UNTIL USERNAME PROP CAN BE PASSED IN
    let feedRoute =
      "http://quickreads-env.eba-nmhvwvfp.us-east-1.elasticbeanstalk.com/getBookmarks";
    fetch(feedRoute + "/" + username, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        state: state,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.titleText}>{title}</Text>
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <Checkbox
          value={isSelected}
          onValueChange={setSelection}
          color={isSelected ? "#4630EB" : undefined}
        />
        {/* need to import the bookmar icon */}
      </View>
      <ScrollView>
        <Text style={globalStyles.paragrph}>{content}</Text>
      </ScrollView>
      <View
        style={{
          justifyContent: "flex-end",
          marginBottom: 0,
        }}
      >
        <FlatList
          horizontal={false}
          numColumns={10}
          data={tags}
          keyExtractor={(item, index) => index.toString()}
          //contentContainerStyle={globalStyles.scrollTags}
          renderItem={({ item }) => (
            <TouchableOpacity style={{ padding: 5 }}>
              <Text style={globalStyles.tagText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}
