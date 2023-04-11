import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { globalStyles } from "../styles/global";

export default function Home({ navigation }) {
  const [reviews, setReviews] = useState([
    {
      title: "article one",
      content:
        "article one content\naaaa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa",
      tags: ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
      key: "1",
    },
    {
      title: "article two",
      content: "article two content",
      tags: ["tag1", "tag2", "tag3"],
      key: "2",
    },
    {
      title: "article three",
      content: "article three content",
      tags: ["tag1", "tag2", "tag3"],
      key: "3",
    },
  ]);

  const pressHandler = () => {
    navigation.navigate("ReviewDetail");
  };

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={reviews}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("ReviewDetail", item)}
          >
            <Text style={globalStyles.homeText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
