import React, { useState, useEffect } from "react";
import { Card, Text, List, shadow,} from "react-native-paper";
import { TextInput, StyleSheet, View, SafeAreaView, KeyboardAvoidingView, Button, FlatList } from "react-native";
import { globalStyles } from "../styles/global";

export default function Category() {
  const [keyword, setKeyword] = useState(""); // Keyword to Search.
  const [catlist, setCatlist] = useState([]); // User's categories
  const [objlist, setObjlist] = useState([]); // User's categories
  const [error, setError] = useState(" "); // Error Message
  // const [refresh, setRefresh] = React.useState(false); // Refresh Page
  let accessToken = global.id; // Save global.id as accessToken
  let root ="http://quickreads-env.eba-nmhvwvfp.us-east-1.elasticbeanstalk.com"; 

  // PAGE FUNCTIONS //
  /** Gets user's categories from database and set them as catlist */
  async function getUserCategories() {
    console.log(root+"/getcategory/"+accessToken); 
    const request = await fetch(root+"/getcategory/"+accessToken, {
      method: "GET",
    })
      .then((response) => {
        return response.json();
      })
      .then((responseJSON) => {
        let cats = responseJSON;
        setCatlist((oldArr) => cats);
        setObjlist((oldArr) => cats.map(elem => {return {title: elem, id: elem};}))
      })
      .catch();
    return;
  }
  /** Add Keyword in Input to Database */
  async function handleAddKeyword() {
    // Check if Keyword Empty or Already Exists
    setKeyword(keyword.trim()); 
    if (keyword.length == 0) {
      console.log("Keyword is Empty!");
      setError("Keyword is Empty");
      setKeyword("");
      return; 
    }
    if (catlist.includes(keyword)) {
      console.log(catlist);
      setError("Keyword Already Exists");
      setKeyword(" "); 
      return; 
    }
    // Otherwise, add to database
    let body = {category: keyword, id: accessToken};
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
      setKeyword(" ");
      getUserCategories();
  }
  /** Remove keyword from database
   * @Param removedKeyword is keyword to remove from Database
   */
  async function handleRemoveKeyword(removedKeyword) {
    let body = {category: removedKeyword, id: accessToken};
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
  /** Asynchonously get User Categories */
  useEffect(() => {
    async function wait() {
      getUserCategories();
    }
    wait();
  }, []);

  // RENDER PAGE //
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView style={styles.inputContainer} behavior="padding">
        <Text style={globalStyles.titleText}>Add a News Category</Text>
        <TextInput
          placeholder="Eg: Major League Baseball, Clean Energy"
          value={keyword}
          onChangeText={(input) => {
            setKeyword(input);
            setError(" ");
          }}
          style={styles.catInput}
        />
      </KeyboardAvoidingView>
      <Text style={globalStyles.errorText}>{error}</Text>
      <Button
        title="Add Category"
        onPress={handleAddKeyword}
        style={globalStyles.button}
        width="50%"
        color="#134F5C"
      ></Button>
      <View style={styles.categoryContainer}>
        <Text style={globalStyles.titleText}>Your News Categories</Text>
        <FlatList
          data={objlist}
          renderItem={({item}) => (
            <Card style={{backgroundColor:"#E3F3F3", borderRadius:"0"}} mode="elevated" elevation={3}>
              <Card.Content style={{width:"100%"}}>
                <Text variant="titleLarge">{item.title}</Text>
              </Card.Content>
              <Button
                title="Remove"
                onPress={() => {handleRemoveKeyword(item.title)}}
                style={styles.removeButton}
                color="#76A5AF"
                borderBottomLeftRadius={10}
                borderBottomRightRadius={10}
              />
            </Card>
          )}
          keyExtractor={item => item.title}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          nestedScrollEnabled={true}
        />
      </View>
      <View style={{marginBottom:"5"}}>
        {/* <Button
            color="#134F5C"
            title="Refresh"
            onPress={getUserCategories}
            marginBottom={5}
        ></Button> */}
      </View>
    </View >    
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FAFAFA',
    flex: 1,
    padding:20,
    alignItems:"center"
  },
  categoryContainer: {
    backgroundColor: '#F2F7F7',
    flex: 1,
    padding: 10,
    width: "80%",
    borderColor:"#76A5AF",
    margin:5,
    borderRadius: 5,
  },
  inputContainer: {
    width: "90%",
  },
  removeButton: {
    width:'50%',
    borderRadius:20,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
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
  refreshButton: {
    marginBottom: 10,
    marginTop: 10
  },
  catInput: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    color: "grey",
    borderWidth: 2, 
    borderColor: "grey"
  }
});
