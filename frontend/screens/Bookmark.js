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
  const deleteBookmark = (text) => {
    removeFromBackend(text);
    setBookmark((preText) => {
      return preText.filter((i) => i.url != text.url);
    });
  };

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
          <View>
            <AntDesign
              name={"delete"}
              color={"#444"}
              size={18}
              onPress={() => {
                console.log("delete " + item.url);
                deleteBookmark(item);
              }}
            />
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
