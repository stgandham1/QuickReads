import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { globalStyles } from "../styles/global";
import { articles } from "../articles";
export default function Home({ navigation }) {
  const [reviews, setReviews] = useState(articles);

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
