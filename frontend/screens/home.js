import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { globalStyles } from "../../front_end/styles/global";

export default function Home({ navigation }) {
  const [reviews, setReviews] = useState([
    { title: "article one", content: "article one content", key: "1" },
    { title: "article two", content: "article two content", key: "2" },
    { title: "article three", content: "article three content", key: "3" },
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
            <Text style={globalStyles.titleText}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
