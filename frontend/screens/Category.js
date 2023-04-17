import React, {useState, useEffect } from "react";
import { StyleSheet, View, Text, KeyboardAvoidingView, TextInput, TouchableOpacity } from "react-native";
import { globalStyles } from "../styles/global";

export default function Category() {
  const [keyword, useKeyword] = useState(""); //Keyword to Search. 
  const [catlist, useCatlist] = useState(""); //User's categories
  

  const handleAddKeyword = () => { 
    console.log("Adding "+ keyword + " to user list of Categories"); 
  };
  const getUserCategories = () => {
    catlist = ["Category","Category","Category","Category","Category"];
  };
  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.inputContainer}> 
        <Text style={globalStyles.titleText}>Add a News Category</Text>
        <TextInput
        placeholder="For example: 'National Football League', 'Videogames', 'Clean Energy' "
        value={keyword}
        onChangeText={(input) => useKeyword(input)}
        style={styles.input}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
        style={[styles.button, styles.buttonOutline]}
        onPress={handleAddKeyword}
        >
          <Text style={styles.button}>Add Category</Text>
        </TouchableOpacity>
      </View>
      <View>
        <Text style={globalStyles.titleText}>Your News Categories:</Text>
      </View>
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

