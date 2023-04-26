import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity
} from "react-native";
import { Avatar, Button, Card, Text, List} from 'react-native-paper';
import { globalStyles } from "../styles/global";
import { articles } from "../articles";

export default function Feed({ navigation }) {
  const [reviews, setReviews] = useState(articles);
  //GET ARTICLES FROM BACKEND

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
    let username = "nat"; //PLACEHOLDER UNTIL USERNAME PROP CAN BE PASSED IN
    let feedRoute =
      "http://quickreads-env.eba-nmhvwvfp.us-east-1.elasticbeanstalk.com/getarticles";
    const articleRequest = await fetch(feedRoute + "/" + username, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJSON) => {
        console.log(responseJSON);
        deleteHandler();
        for (var key in responseJSON) {
          submitHandler({
            title: responseJSON[key]["title"],
            content: responseJSON[key]["summary"],
            tags: ["tag1", "tag2", "tag3"],
            key: key,
          });
        }
      })
      .catch();
  }
  useEffect(() => {
    refreshArticles();
  }, []);

  const pressHandler = () => {
    navigation.navigate("ReviewDetail");

  };

  const [shouldShow, setShouldShow] = useState(true);
  return (
    <View style={globalStyles.test}>
      <FlatList
        data={reviews}
        renderItem={({ item }) => (
            <Card>
              <Card.Content>
                <Text variant="titleLarge" style={globalStyles.homeText}>{item.title}</Text>
              </Card.Content>
            <TouchableOpacity
              //onPress={() => navigation.navigate("ReviewDetail", item)}
              onPress={() =>  setShouldShow(!shouldShow)}
            >
              <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
            </TouchableOpacity>
              <Card.Content>
                {shouldShow ? (
                  //console.log(item.title)
                  <Text variant="titleLarge">{item.title}</Text>
                ) : null
                }
              </Card.Content>
            </Card>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
        />
    </View>
  );
}
