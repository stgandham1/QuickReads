import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../styles/global";
import { Button, TextInput, Snackbar } from 'react-native-paper';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [errorText, setErrorText] = useState("");
  const [visible, setVisible] = useState(false);
  const root = 'http://quickreads-env.eba-nmhvwvfp.us-east-1.elasticbeanstalk.com'; // BASE ROOT
  
  //OPEN APP
  const goHome = () => {
    console.log("GOING" + username);
    navigation.replace("BottomTabNavigator");
  };
  //SIGN UP FUNCTION
  async function handleSignUp() {
    if (username.length == 0 || password.length == 0) {
      onToggleSnackBar("No Input Detected");
      return;
    }
    let usernameExists = false;
    let signuproute = root+"/adduser/"+username+"/"+password;
    let loginroute = root+"/checkuser/"+username+"/"+password;
    //CHECK IF USER EXISTS//
    const loginRequest = await fetch(loginroute, {method: "GET",})
      .then((response) => {return response.json();})
      .then((responseJSON) => {
        if (
          responseJSON.status ||
          responseJSON.message != "Username does not exist"
        ) {
          usernameExists = true;
        }
      })
      .catch();
    //SIGNUP USER IF THEY EXIST//
    if (usernameExists) {
      onToggleSnackBar("Username Already Exists");
    } else {
      onToggleSnackBar("Registered " + username + "!");
      const signupRequest = await fetch(signuproute,{method: "GET"});
    }
  }
  //LOG IN FUNCTION
  async function handleLogin() {
    if (username.length == 0 || password.length == 0) {
      onToggleSnackBar("No Input Detected");
      return;
    }
    let loginroute = root+"/checkuser/"+username+"/"+password;
    const loginRequest = await fetch(loginroute, {method: "GET"})
      .then((response) => {return response.json();})
      .then((responseJSON) => {
        if (responseJSON.status) {
          onToggleSnackBar("Logging in " + username);
          goHome();
        } else {
          onToggleSnackBar("Could not log in " + username);
        }
      });
  }
  //SNACKBAR FOR ERRORS
  const onToggleSnackBar = (text) => {setErrorText(text); setVisible(true);};
  const onDismissSnackBar = () => setVisible(false);

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={(input) => {onDismissSnackBar(); setUsername(input);}}
          style={globalStyles.paperInput}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(input) => {onDismissSnackBar(); setPassword(input);}}
          style={globalStyles.paperInput}
          secureTextEntry
        />
      </View>
      <Button mode="contained" onPress={handleLogin} style={globalStyles.paperButton}>
        Login
      </Button>
      <Button mode="outlined" onPress={handleSignUp} style={globalStyles.paperButton}>
        Signup
      </Button>
      <Button mode="text " onPress={goHome}>
        No Account
      </Button>
      <Snackbar
        visible={visible}
        onDismiss={onDismissSnackBar}
        action={{
          label: 'X',
          onPress: () => {onDismissSnackBar},
        }}>
        {errorText}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "top",
    alignItems: "center",
  },
  inputContainer: {
    width: "60%",
  }
});
