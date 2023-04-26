import React, {useState, useEffect } from "react";
import {Card, Text , List} from 'react-native-paper';
import { StyleSheet, View, KeyboardAvoidingView } from "react-native";
import { Button, TextInput, Snackbar } from 'react-native-paper';
import { globalStyles } from "../styles/global";

export default function Category() {
  const [keyword, setKeyword] = useState(""); //Keyword to Search. 
  const [catlist, setCatlist] = useState([]); //User's categories
  let accessToken = "nat"; //PLACEHOLDER UNTIL USERNAME PROP CAN BE PASSED IN
  let root = "http://quickreads-env.eba-nmhvwvfp.us-east-1.elasticbeanstalk.com"; // SHOULD BE SAME ON ALL PAGES: MAKE GLOBAL?
  
  const handleAddKeyword = () => { 
    console.log("Adding "+ keyword + " to user list of Categories"); 
  };
  const getUserCategories = () => {
    let callback = (response) => {
      let cats = response["rows"][0]["category"];
      setCatlist(oldArr => cats);
    }
    getRequestHelper(root, "getCategory", accessToken, callback);
  };

  async function getRequestHelper(_root, _table, _accessToken, callback) { //RETURNS WHATEVER THE REQUEST RETURNS
    let returned = {};
    const request = await fetch(_root + "/" + _table + "/" + _accessToken, {
      method: "GET",
    })
    .then((response) => { return response.json();})
    .then((responseJSON) => {returned = responseJSON; return;})
    .catch();
    callback(returned);
    return returned; 
  }
  async function postRequestHelper(_root, _table, _accessToken, callback) { //RETURNS WHATEVER THE REQUEST RETURNS
    let returned = {};
    const request = await fetch(_root + "/" + _table + "/" + _accessToken, {
      method: "GET",
    })
    .then((response) => { return response.json();})
    .then((responseJSON) => {returned = responseJSON; return;})
    .catch();
    callback(returned);
    return returned; 
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">

      <View style={styles.inputContainer}> 
        <Text style={globalStyles.titleText}>Add a News Category</Text>
        <TextInput
        placeholder="For example: 'National Football League', 'Videogames', 'Clean Energy' "
        value={keyword}
        onChangeText={(input) => {setKeyword(input);}}
        style={globalStyles.paperInput}
        />
      </View>

      <Button mode="contained" onPress={handleAddKeyword} style={globalStyles.paperButton}>
        Add Category
      </Button>
      <View>
        <Text style={globalStyles.titleText}>Your News Categories:</Text>
        {catlist.map(elem => {
          return <Card>
          <Card.Content>
            <Text variant="titleLarge">{elem}</Text>
          </Card.Content>
          </Card>;
        })
        }
      </View>
      <Button mode="contained" onPress={getUserCategories} style={globalStyles.paperButton}>
        Refresh
      </Button>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({ 
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    color: 'grey'
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

