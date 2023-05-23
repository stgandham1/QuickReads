import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Button,
  TextInput,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { globalStyles } from "../styles/global";
import { AntDesign } from "@expo/vector-icons";
export default function Bookmark({ navigation }) {
  const [bookmark, setBookmark] = useState(""); //user's bookmark
  let accessToken = global.id; // Save global.id as accessToken
  const root =
    "http://quickreads-env.eba-nmhvwvfp.us-east-1.elasticbeanstalk.com";
  /* add new bookmark to user's bookmark */
  const submitHandler = (text) => {
    setBookmark((preText) => {
      return [text, ...preText];
    });
  };
  /* clear user's bookmark */
  const deleteHandler = () => {
    setBookmark((preText) => {
      return [];
    });
  };
  /* delete specific bookmark from user's bookmark and backend's database */
  const deleteBookmark = (text) => {
    removeFromBackend(text);
    setBookmark((preText) => {
      return preText.filter((i) => i.url != text.url);
    });
  };
  /* delete specific bookmark from backend */
  async function removeFromBackend(item) {
    const body = { id: accessToken, url: item.url };
    try {
      const response = await fetch(root + "/removebookmarkpost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
    } catch (error) {
      console.error("Error occurred:", error.message);
    }
  }

  /* get all bookmarks form backend and add in user's bookmark */
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
  /* every time visit bookmark page, refresh shown bookmark */
  useEffect(() => {
    refreshBookmark();
  }, []);
  //if user has no bookmark
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
          <View>
            {/* show delete icon */}
            <AntDesign
              name={"delete"}
              color={"#444"}
              size={18}
              onPress={() => {
                console.log("delete " + item.url);
                deleteBookmark(item);
              }}
            />
            {/* show bookmark url */}
            <TouchableOpacity
              style={globalStyles.homeText}
              onPress={() => {
                Linking.openURL(item.url);
              }}
            >
              {item.url}
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
      />
    </View>
  );
}
