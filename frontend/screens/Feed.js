import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Button,
  Linking
} from "react-native";
import { Avatar, Card, Text, List } from "react-native-paper";
import { globalStyles } from "../styles/global";
import { articles } from "../articles";
import { FontAwesome } from "@expo/vector-icons";
import { AccessTokenRequest } from "expo-auth-session";
import SelectDropdown from "react-native-select-dropdown";

export default function Feed({ navigation }) {
  const [reviews, setReviews] = useState([]);
  const [refresh, setRefresh] = React.useState(false);
  const [selectedBookmark, setselectedBookmark] = useState([]);
  const root =
    "http://quickreads-env.eba-nmhvwvfp.us-east-1.elasticbeanstalk.com";
  let accessToken = global.id;
  let userLength = "longsummary";
  const [catlist, setCatlist] = useState([]);
  async function getUserCategories() {
    console.log(root + "/getcategory/" + accessToken);
    const request = await fetch(root + "/getcategory/" + accessToken, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJSON) => {
        let cats = responseJSON;
        setCatlist((oldArr) => [...cats, "-All Categories-"]);
      })
      .catch();
    return catlist;
  }

  async function getLength() {
    console.log(root + "/getsummarylength/" + accessToken);
    const request = await fetch(root + "/getsummarylength/" + accessToken, {
      method: "GET",
    })
      .then((response) => {
        //console.log(response);
        return response.text();
      })
      .then((responseJSON) => {
        console.log(responseJSON);
        if (responseJSON == "medium") {
          console.log("set length to mediun");
          userLength = "mediumsummary";
        } else if (responseJSON == "long") {
          console.log("set length to long");
          userLength = "longsummary";
        } else {
          console.log("set length to short");
          userLength = "shortsummary";
        }
      })
      .catch();
  }
  console.log(accessToken);
  const addToBookmark = (url) => {
    setselectedBookmark((preText) => {
      return [url, ...preText];
    });
  };
  const changeBookmark = () => {
    reviews.forEach((element) => {
      selectedBookmark.forEach((bookmark) => {
        if (bookmark == element.newsurl) {
          element.isSelected = true;
        }
      });
    });
  };
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
          addToBookmark(responseJSON[key]["url"]);
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
    setselectedBookmark((bookmark) => {
      return bookmark.filter((mark) => mark != item.newsurl);
    });
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
    async function wait() {
      getLength();
      setRefresh(!refresh);
      refreshArticles();
      refreshBookmark();
      getUserCategories();
      setRefresh(!refresh);
    }
    wait();
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
          submitHandler({
            title: responseJSON[key]["title"],
            summary: responseJSON[key][userLength],
            tags: responseJSON[key]["category"],
            key: key,
            imgURL: responseJSON[key]["imageurl"],
            newsurl: responseJSON[key]["newsurl"],
            shouldShow: false,
            isSelected: false,
          });
        }
      })
      .catch();
  }

  async function refreshCategoryArticles(cat) {
    if (cat == "-All Categories-") {
      //RETURN IF SEE ALL IS SELECTED
      refreshArticles();
      return;
    }
    console.log(root + "/getarticlesbycategory/" + cat);
    const articleRequest = await fetch(root + "/getarticlesbycategory/" + cat, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJSON) => {
        //console.log(responseJSON);
        deleteHandler();
        for (var key in responseJSON) {
          submitHandler({
            title: responseJSON[key]["title"],
            summary: responseJSON[key][userLength],
            tags: responseJSON[key]["category"],
            key: key,
            imgURL: responseJSON[key]["imageurl"],
            newsurl: responseJSON[key]["newsurl"],
            shouldShow: false,
            isSelected: false,
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
      <Text>Sort by:</Text>
      <SelectDropdown
        data={catlist}
        defaultValueByIndex={2}
        defaultValue={"-All Categories-"}
        onSelect={(selectedItem, index) => {
          console.log(selectedItem, index);
          refreshCategoryArticles(selectedItem);
          //then tell backend languange changing
        }}
        defaultButtonText={"-All Categories-"}
        buttonTextAfterSelection={(selectedItem, index) => {
          return selectedItem;
        }}
        rowTextForSelection={(item, index) => {
          return item;
        }}
        buttonStyle={globalStyles.dropdown1BtnStyle}
        buttonTextStyle={globalStyles.dropdown1BtnTxtStyle}
        renderDropdownIcon={(isOpened) => {
          return (
            <FontAwesome
              name={isOpened ? "chevron-up" : "chevron-down"}
              color={"#444"}
              size={18}
            />
          );
        }}
        dropdownIconPosition={"right"}
        dropdownStyle={globalStyles.dropdown1DropdownStyle}
        rowStyle={globalStyles.dropdown1RowStyle}
        rowTextStyle={globalStyles.dropdown1RowTxtStyle}
      />

      <FlatList
        data={reviews}
        renderItem={({ item }) => (
          <Card style={globalStyles.newsCard}>
            <Card.Content>
              <Text variant="titleLarge" style={globalStyles.homeText}>
                {item.title}
              </Text>
            </Card.Content>
            <TouchableOpacity
              //onPress={() => navigation.navigate("ReviewDetail", item)}
              onPress={() => {
                //console.log(item.imgURL);
                changeBookmark();
                item.shouldShow = !item.shouldShow;
                setRefresh(!refresh);
              }}
            >
              <Card.Cover borderRadius={0} source={{ uri: item.imgURL }} />
            </TouchableOpacity>
            <Card.Content>
              {item.shouldShow ? (
                <View>
                  <Text variant="titleLarge">{item.summary}</Text>

                  {/* <a target="_blank" href={item.newsurl}>{item.newsurl}</a> */}
                  <Card.Actions>
                    <FlatList
                      horizontal={false}
                      numColumns={10}
                      data={[item.tags]}
                      keyExtractor={(item, index) => index.toString()}
                      //contentContainerStyle={globalStyles.scrollTags}
                      renderItem={({ item }) => (
                        <TouchableOpacity style={{ padding: 5 }}>
                          <Text style={globalStyles.tagText}>{item}</Text>
                        </TouchableOpacity>
                      )}
                    />
                    <FontAwesome
                        name="link"
                        size={45}
                        color="#134F5C"
                        backgroundColor="transparent"
                        borderRadius={10}
                        suppressHighlighting={false}
                        onPress={() => {Linking.openURL(item.newsurl)}}
                      />
                    <TouchableOpacity
                      style={{ flexDirection: "row", justifyContent: "flex-end" }}
                    >
                      {!item.isSelected ? (
                        <FontAwesome
                          name="bookmark-o"
                          size={45}
                          color="#134F5C"
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
                          size={45}
                          color="#134F5C"
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
                  </Card.Actions>
                </View>
                
              ) : null}   
            </Card.Content>
          </Card>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 30 }} />}
      />
    </View>
  );
}
