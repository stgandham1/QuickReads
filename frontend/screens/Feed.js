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
import { FontAwesome } from "@expo/vector-icons";
import { AccessTokenRequest } from "expo-auth-session";

export default function Feed({ navigation }) {
  const [reviews, setReviews] = useState();
  const [refresh, setRefresh] = React.useState(false);
  const [selectedBookmark, setselectedBookmark] = useState(false);
  const root =
    "http://quickreads-env.eba-nmhvwvfp.us-east-1.elasticbeanstalk.com";
  let accessToken = "109514402886947340000"; //PLACEHOLDER UNTIL USERNAME PROP CAN BE PASSED IN;
  async function refreshBookmark() {
    const articleRequest = await fetch(root + "/getBookmarks/" + accessToken, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJSON) => {
        //console.log(responseJSON);
        for (var key in responseJSON) {
          console.log(responseJSON[key]["url"]);
          if (
            responseJSON[key]["url"] ==
            "https://www.causal.app/blog/the-ultimate-guide-to-finance-for-seed-series-a-companies"
          ) {
            console.log("yes");
            setselectedBookmark(true);
            break;
          }
        }
      })
      .catch();
  }
  async function addToBackend(item) {
    const body = { id: accessToken, url: item.newsurl };
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
  async function removeFromBackend(item) {
    const body = { id: accessToken, url: item.newsurl };
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
  //GET ARTICLES FROM BACKEND
  const addBookmark = (item) => {
    item.isSelected = true;
    addToBackend(item);
    console.log("add to bookmark");
  };
  const removeBookmark = (item) => {
    item.isSelected = false;
    removeFromBackend(item);
    console.log("remove from bookmark");
  };
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
        //console.log(responseJSON);
        deleteHandler();
        for (var key in responseJSON) {
          const url = responseJSON[key]["newsurl"];
          // refreshBookmark(url);
          //console.log(url);
          submitHandler({
            title: responseJSON[key]["title"],
            content: responseJSON[key]["summary"],
            tags: ["tag1", "tag2", "tag3"],
            key: key,
            imgURL: responseJSON[key]["imageurl"],
            newsurl: responseJSON[key]["newsurl"],
            shouldShow: false,
            isSelected: selectedBookmark,
          });
          setselectedBookmark(false);
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
    let body = { url: bookmarkURL, id: accessToken };
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
                //console.log(item.imgURL);
                item.shouldShow = !item.shouldShow;
                setRefresh(!refresh);
              }}
            >
              <Card.Cover source={{ uri: item.imgURL }} />
            </TouchableOpacity>
            <Card.Content>
              {item.shouldShow ? (
                <View>
                  <Text variant="titleLarge">{item.content}</Text>
                  <TouchableOpacity
                    style={{ flexDirection: "row", justifyContent: "flex-end" }}
                  >
                    {!item.isSelected ? (
                      <FontAwesome
                        name="bookmark-o"
                        size={30}
                        color="black"
                        backgroundColor="transparent"
                        borderRadius={10}
                        suppressHighlighting={false}
                        onPress={() => {
                          addBookmark(item);
                          setRefresh(!refresh);
                        }}
                      />
                    ) : (
                      <FontAwesome
                        name="bookmark"
                        size={30}
                        color="blue"
                        backgroundColor="transparent"
                        borderRadius={10}
                        suppressHighlighting={false}
                        onPress={() => {
                          removeBookmark(item);
                          setRefresh(!refresh);
                        }}
                      />
                    )}
                  </TouchableOpacity>
                </View>
              ) : null}
            </Card.Content>
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
      />
    </View>
  );
  // const [reviews, setReviews] = useState(articles);
  // let accessToken = "109514402886947340000"; //PLACEHOLDER UNTIL USERNAME PROP CAN BE PASSED IN
  // const root = "http://quickreads-env.eba-nmhvwvfp.us-east-1.elasticbeanstalk.com";
  
  // const submitHandler = (text) => {
  //   setReviews((preText) => {
  //     return [text, ...preText];
  //   });
  // };

  // //Passing an article constent to the submitHandler
  // //adds it to the article holder
  // //below is an example
  // // const pressHandler2 = () => {
  // //   submitHandler({
  // //     title: "article 1",
  // //     content:
  // //       "article 1 content\naaaa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa\naa",
  // //     tags: ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6"],
  // //     key: "1",
  // //   });
  // // };

  // const deleteHandler = () => {
  //   setReviews((preText) => {
  //     return [];
  //   });
  // };

  // async function refreshArticles() {
  //   console.log(root+"/getArticles/"+accessToken)
  //   const articleRequest = await fetch(root+"/getArticles/"+accessToken, {
  //     method: "GET",
  //   })
  //     .then((response) => {
  //       return response.json();
  //     })
  //     .then((responseJSON) => {
  //       console.log(responseJSON);
  //       deleteHandler();
  //       for (var key in responseJSON) {
  //         submitHandler({ // Submit handler receives functions
  //           title: responseJSON[key]["title"],
  //           content: responseJSON[key]["summary"],
  //           tags: responseJSON[key]["category"],
  //           imageURL: responseJSON[key]["imageurl"],
  //           URL: responseJSON[key]["newsurl"],
  //           key: key,
  //         });
  //       }
  //     })
  //     .catch();
  // }

  // useEffect(() => { // refreshes articles wheh opening page.
  //   console.log("refreshing articles")
  //   refreshArticles();
  // }, []);

  // const pressHandler = () => {
  //   navigation.navigate("ReviewDetail");
  // };

  // return (
  //   <View style={globalStyles.container}>
  //     {/* <TouchableOpacity
  //           onPress={refreshArticles}
  //         >
  //           <Text style={globalStyles.homeText}>{"REFRESH"}</Text>
  //     </TouchableOpacity> */}
  //     <FlatList
  //       data={reviews} // we're updating reviews
  //       renderItem={({ item }) => (
  //         <TouchableOpacity
  //           onPress={() => navigation.navigate("ReviewDetail", item)}
  //         >
  //           <Text style={globalStyles.homeText}>{item.title}</Text>
  //         </TouchableOpacity>
  //       )}
  //       ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
  //     />
  //   </View>
  // );
}
