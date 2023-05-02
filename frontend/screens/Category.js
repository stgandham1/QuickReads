import React, { useState, useEffect } from "react";
import { Card, Text, List } from "react-native-paper";
import { TextInput, StyleSheet, View, KeyboardAvoidingView, Button, TouchableOpacity } from "react-native";
import { globalStyles } from "../styles/global";

export default function Category() {
  const [keyword, setKeyword] = useState(""); //Keyword to Search.
  const [catlist, setCatlist] = useState([]); //User's categories
  let accessToken = "baz"; //PLACEHOLDER UNTIL USERNAME PROP CAN BE PASSED IN
  let root ="http://quickreads-env.eba-nmhvwvfp.us-east-1.elasticbeanstalk.com"; // SHOULD BE SAME ON ALL PAGES: MAKE GLOBAL?

  async function getUserCategories() {
    const request = await fetch(root + "/getcategory/" + accessToken, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJSON) => {
        let cats = responseJSON;
        setCatlist((oldArr) => cats);
      })
      .catch();
    return;
  }
  async function handleAddKeyword() {

    
    setKeyword(keyword.trim()); 
    if (keyword.length == 0) {
      console.log("Keyword is Empty!");
      return; 
    }
    let body = {category: keyword, username: accessToken};
    console.log(body);
    const request = await fetch(root+"/addcategorypost", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      })
      .then((response) => {
        console.log(response.json());
      })
      .catch((error) => {console.log(error);});
      console.log("Adding " + keyword + " to user list of Categories");
      getUserCategories();
  }
  async function handleRemoveKeyword(removedKeyword) {
    let body = {category: removedKeyword, username: accessToken};
    console.log(body);
    const request = await fetch(root+"/removecategorypost", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      })
      .catch();
      console.log("Removing " + removedKeyword + " from user list of Categories");
      getUserCategories();
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.inputContainer}>
        <Text style={globalStyles.titleText}>Add a News Category</Text>
        <TextInput
          placeholder="Eg: Major League Baseball, Clean Energy"
          value={keyword}
          onChangeText={(input) => {
            setKeyword(input);
          }}
          style={globalStyles.input}
        />
      </View>

      <Button
        title="Add Category"
        onPress={handleAddKeyword}
        style={globalStyles.button}
      ></Button>
      <View>
        <Text style={globalStyles.titleText}>Your News Categories:</Text>
        {catlist.map((elem) => {
          return (
            <Card key={elem+"_card"}>
              <Card.Content>
                <Text variant="titleLarge">{elem}</Text>
              </Card.Content>
              <TouchableOpacity
              onPress={() => {handleRemoveKeyword(elem)}}
              style={globalStyles.outlinedButton}
              >
              <Text style={styles.button}>Remove</Text>
              </TouchableOpacity>
            </Card>
          );
        })}
      </View>
      <Button
        title="Refresh"
        onPress={getUserCategories}
        style={globalStyles.button}
      ></Button>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    width: "60%",
  },
  button: {
    borderRadius: 5,
  },
  buttonOutline: {
    backgroundColor: "white",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: "grey",
    borderWidth: 1,
    marginTop: 10,
  },
  buttonContainer: {
    width: "50%",
    flex: 1,
    alignItems: "center",
  },
});
