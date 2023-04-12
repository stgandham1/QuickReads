import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { globalStyles } from "../styles/global";
import { articles } from "../articles";

export default function Feed({ navigation }) {
  const [reviews, setReviews] = useState(articles);
  //GET ARTICLES FROM BACKEND

  async function refreshArticles() { 
    let username = 'nat'; //PLACEHOLDER UNTIL USERNAME PROP CAN BE PASSED IN
    let feedRoute = 'http://quickreads-env.eba-nmhvwvfp.us-east-1.elasticbeanstalk.com/getarticles'
    const articleRequest = await fetch(feedRoute+'/'+username, {
      method:'GET',
    }).then(response => {return response.json()})
    .then((responseJSON) => {
        console.log(responseJSON);
        for(var key in responseJSON) {
          articles.unshift({title: responseJSON[key]['title'],
          content: responseJSON[key]['summary'],
          tags: ["tag1", "tag2", "tag3"],
          key: key,})
        }

    }).catch();

  }
  refreshArticles();


  const pressHandler = () => {
    navigation.navigate("ReviewDetail");
  };

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={reviews}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("ReviewDetail", item)}
          >
            <Text style={globalStyles.homeText}>{item.title}</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{height: 30}} />}
      />
    </View>
  );
}
