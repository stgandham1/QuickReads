import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { globalStyles } from "../styles/global";
import { articles } from "../articles";
export default function Bookmark({ navigation }) {
  const [bookmark, setBookmark] = useState("");
  let accessToken = global.id; //PLACEHOLDER UNTIL USERNAME PROP CAN BE PASSED IN
  const root =
    "http://quickreads-env.eba-nmhvwvfp.us-east-1.elasticbeanstalk.com";

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
    console.log(root + "/getBookmarks/" + accessToken);
    const articleRequest = await fetch(root + "/getBookmarks/" + accessToken, {
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
            url: responseJSON[key]["url"],
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
          <Text style={globalStyles.homeText}>{item.url}</Text>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
      />
    </View>
  );
}
