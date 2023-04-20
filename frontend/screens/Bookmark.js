import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { globalStyles } from "../styles/global";
export default function Bookmark({ navigation }) {
  const [bookmark, setBookmark] = useState("");

  const submitHandler = (text) => {
    setBookmark((preText) => {
      return [text, ...preText];
    });
  };
  const deleteHandler = () => {
    setBookmark((preText) => {
      return [];
    });
  };
  //need to create getBookmark website.
  async function refreshBookmark() {
    let username = "nat"; //PLACEHOLDER UNTIL USERNAME PROP CAN BE PASSED IN
    let feedRoute =
      "http://quickreads-env.eba-nmhvwvfp.us-east-1.elasticbeanstalk.com/getbookmarks";
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
    refreshBookmark();
  }, []);

  if (bookmark.length == 0) {
    return (
      <View style={globalStyles.container}>
        <Text style={globalStyles.titleText}>
          You don't have any article in bookmark, please add some.
        </Text>
      </View>
    );
  }
  return (
    <View style={globalStyles.container}>
      <FlatList
        data={bookmark}
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
