import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Button,
} from "react-native";
import { Avatar, Card, Text, List } from "react-native-paper";
import { globalStyles } from "../styles/global";
import { articles } from "../articles";

export default function Feed({ navigation }) {
  const [reviews, setReviews] = useState();
  const [refresh, setRefresh] = React.useState(false);

  const root =
    "http://quickreads-env.eba-nmhvwvfp.us-east-1.elasticbeanstalk.com";
  let accessToken = "hi"; //PLACEHOLDER UNTIL USERNAME PROP CAN BE PASSED IN;

  //GET ARTICLES FROM BACKEND

  const submitHandler = (text) => {
    setReviews((preText) => {
      return [text, ...preText];
    });
  };

  const deleteHandler = () => {
    setReviews((preText) => {
      return [];
    });
  };

  useEffect(() => {
    refreshArticles();
  }, []);
  // deleting all the articles

  async function refreshArticles() {
    const articleRequest = await fetch(root + "/getarticles/" + accessToken, {
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
            shouldShow: false,
          });
        }
      })
      .catch();
  }

  const pressHandler = () => {
    navigation.navigate("ReviewDetail");
  };

  const printArticles = () => {
    console.log(reviews);
    console.log(reviews[0].title);
    console.log(reviews[0].summary);
  };

  async function handleAddBookmark(bookmarkURL) {
    let body = { url: bookmarkURL, username: accessToken };
    console.log(body);
    const request = await fetch(root + "/addbookmarkpost", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }).catch();
    console.log("Adding " + bookmarkURL + " to Bookmarks");
  }

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={reviews}
        renderItem={({ item }) => (
          <Card>
            <Card.Content>
              <Text variant="titleLarge" style={globalStyles.homeText}>
                {item.title}
              </Text>
            </Card.Content>
            <TouchableOpacity
              //onPress={() => navigation.navigate("ReviewDetail", item)}
              onPress={() => {
                console.log(item.shouldShow);
                item.shouldShow = !item.shouldShow;
                setRefresh(!refresh);
              }}
            >
              <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
            </TouchableOpacity>
            <Card.Content>
              {item.shouldShow ? (
                <Text variant="titleLarge">{item.content}</Text>
              ) : null}
            </Card.Content>
            <Button
              title="Bookmark"
              onPress={() => {
                console.log(item);
              }}
              style={globalStyles.button}
            ></Button>
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
      />
    </View>
  );
}
