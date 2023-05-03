import React, { useEffect, useState } from "react";

import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Button,
} from "react-native";
import { globalStyles } from "../styles/global";
import { FontAwesome } from "@expo/vector-icons";
export default function ReviewDetail({ route, navigation }) {
  const { title, content, tags, URL, key } = route.params;
  const [isSelected, setSelection] = useState(false);
  const accessToken = "109514402886947340000"; //PLACEHOLDER UNTIL USERNAME PROP CAN BE PASSED IN
  const root =
    "http://quickreads-env.eba-nmhvwvfp.us-east-1.elasticbeanstalk.com";

  async function refreshBookmark() {
    const articleRequest = await fetch(root + "/getBookmarks/" + accessToken, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJSON) => {
        console.log(responseJSON);
        for (var key in responseJSON) {
          if (responseJSON[key]["url"] == URL) {
            setSelection(true);
            break;
          }
        }
      })
      .catch();
  }
  // useEffect(() => {
  //   refreshBookmark();
  // }, []);

  async function addToBackend() {
    const body = { id: accessToken, url: URL };
    try {
      const response = await fetch(root + "/addbookmarkpost", {
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

  async function removeFromBackend() {
    const body = { id: accessToken, url: URL };
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

  const addBookmark = () => {
    setSelection(true);
    addToBackend();
    console.log("add to bookmark");
  };
  const removeBookmark = () => {
    setSelection(false);
    removeFromBackend();
    console.log("remove from bookmark");
  };

  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.titleText}>{title}</Text>

      <ScrollView>
        <Text style={globalStyles.paragrph}>{content}</Text>
      </ScrollView>
      <View
        style={{
          justifyContent: "flex-end",
          marginBottom: 0,
        }}
      >
        {/* <Text style={globalStyles.tagText}>{tags}</Text> */}
        <FlatList
          horizontal={false}
          numColumns={10}
          data={[tags]}
          keyExtractor={(item, index) => index.toString()}
          //contentContainerStyle={globalStyles.scrollTags}
          renderItem={({ item }) => (
            <TouchableOpacity style={{ padding: 5 }}>
              <Text style={globalStyles.tagText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          style={{ flexDirection: "row", justifyContent: "flex-end" }}
        >
          {!isSelected ? (
            <FontAwesome
              name="bookmark-o"
              size={30}
              color="black"
              backgroundColor="transparent"
              borderRadius={10}
              suppressHighlighting={false}
              onPress={addBookmark}
            />
          ) : (
            <FontAwesome
              name="bookmark"
              size={30}
              color="blue"
              backgroundColor="transparent"
              borderRadius={10}
              suppressHighlighting={false}
              onPress={removeBookmark}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
