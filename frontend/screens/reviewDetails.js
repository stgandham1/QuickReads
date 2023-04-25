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
import { FontAwesome } from "@expo/vector-icons";
export default function ReviewDetail({ route, navigation }) {
  const { title, content, tags, key } = route.params;
  const [isSelected, setSelection] = useState(false);
  const addBookmark = () => {
    setSelection(true);
    console.log("add to bookmark");
  };
  const removeBookmark = () => {
    setSelection(false);
    console.log("remove from bookmark");
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.titleText}>{title}</Text>
      <TouchableOpacity
        style={{ flexDirection: "row", justifyContent: "flex-end" }}
      >
        {!isSelected ? (
          <FontAwesome
            name="bookmark-o"
            size={30}
            color="black"
            backgroundColor="transparent"
            borderRadius={10}
            suppressHighlighting={false}
            onPress={addBookmark}
          />
        ) : (
          <FontAwesome
            name="bookmark"
            size={30}
            color="blue"
            backgroundColor="transparent"
            borderRadius={10}
            suppressHighlighting={false}
            onPress={removeBookmark}
          />
        )}
        {/* need to import the bookmar icon */}
      </TouchableOpacity>
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
