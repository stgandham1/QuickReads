import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
} from "react-native";
import { globalStyles } from "../styles/global";
import { articles } from "../articles";
import { AccessTokenRequest } from "expo-auth-session";

export default function Feed({ navigation }) {
  const [reviews, setReviews] = useState(articles);
  let accessToken = "baz"; //PLACEHOLDER UNTIL USERNAME PROP CAN BE PASSED IN
  const root = "http://quickreads-env.eba-nmhvwvfp.us-east-1.elasticbeanstalk.com";


  const submitHandler = (text) => {
    setReviews((preText) => {
      return [text, ...preText];
    });
  };

  //Passing an article constent to the submitHandler
  //adds it to the article holder
  //below is an example
  // const pressHandler2 = () => {
  //   submitHandler({
  //     title: "article 1",
  //     content:
  //       "article 1 content\naaaa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa",
  //     tags: ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
  //     key: "1",
  //   });
  // };

  const deleteHandler = () => {
    setReviews((preText) => {
      return [];
    });
  };
  //deletinng all the articles

  async function refreshArticles() {
    const articleRequest = await fetch(root+"/getarticles/"+accessToken, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJSON) => {
        console.log(responseJSON);
        deleteHandler();
        for (var key in responseJSON) {
          submitHandler({ // Submit handler receives functions
            title: responseJSON[key]["title"],
            content: responseJSON[key]["summary"],
            tags: responseJSON[key]["category"],
            imageURL: responseJSON[key]["imageurl"],
            URL: responseJSON[key]["newsurl"],
            key: key,
          });
        }
      })
      .catch();
  }

  useEffect(() => { // refreshes articles wheh opening page.
    refreshArticles();
  }, []);

  const pressHandler = () => {
    navigation.navigate("ReviewDetail");
  };

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={reviews} // we're updating reviews
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("ReviewDetail", item)}
          >
            <Text style={globalStyles.homeText}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
      />
    </View>
  );
}
