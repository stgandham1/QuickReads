import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { globalStyles } from "../styles/global";
import Checkbox from "expo-checkbox";
export default function ReviewDetail({ route, navigation }) {
  const { title, content, tags } = route.params;
  const [isSelected, setSelection] = useState(false);
  const pressHandler = (newValue) => {
    setSelection(newValue);
    //if newValue is false, remove the article in bookmark website.
    //if newValue is true, add the article in bookmark website.
    //need a way to add articles.
  };
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.titleText}>{title}</Text>
      <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
        <Checkbox
          value={isSelected}
          onValueChange={pressHandler}
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
