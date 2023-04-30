import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../styles/global";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const [errorText, setErrorText] = useState("");
  // FOR LOGIN
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const root = 'http://quickreads-env.eba-nmhvwvfp.us-east-1.elasticbeanstalk.com';

  const goHome = () => {
    console.log("GOING" + email);
    navigation.replace("BottomTabNavigator");
  };

  async function testGoogleAuth() {
    const myAuthtoken = "111239336200270088302"
    const myEmail = "zimmeritz64@gmail.com"
    const myName = "Michael Chen"

    let userAuth = { authtoken: myAuthtoken, email: myEmail, name: myName};
    console.log(userAuth);
    const request = await fetch(root+"/auth", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userAuth),
      })
      .catch(error => console.log(error));
      console.log("Signing Up " + (userAuth.name));
  }

  async function handleSignUp() {
    if (email.length == 0 || password.length == 0) {
      setErrorText("[No Input Detected]");
      return;
    }
    let usernameExists = false;
    const request = await fetch(route+'/adduser/'+email,
      {
        method: "GET",
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((responseJSON) => {
        if (
          responseJSON.status ||
          responseJSON.message != "Username does not exist"
        ) {
          usernameExists = true;
        }
      })
      .catch();
    if (usernameExists) {
      setErrorText("Username Already Exists");
      return;
    }
    setErrorText("Registered " + email + "!");
    //ADD USER TO TABLE
    const signupRequest = await fetch(root+'/adduser/'+email+'/'+password,
      {
        method: "GET",
      }
    );
  }

  async function handleLogin() {
    if (email.length == 0 || password.length == 0) {
      setErrorText("[No Input Detected]");
      return;
    }
    const request = await fetch(root+'/checkuser/'+email+'/'+password,
      {
        method: "GET",
      }
    )
      .then((response) => {
        return response.json();
      })
      .then((responseJSON) => {
        if (responseJSON.status) {
          setErrorText("Logging in " + email);
          goHome();
        } else {
          setErrorText("Could not log in " + email);
        }
      });
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(input) => setEmail(input)}
          style={globalStyles.input}
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(input) => setPassword(input)}
          style={globalStyles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={handleLogin}
          style={globalStyles.outlinedButton}
        >
          <Text style={styles.button}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSignUp}
          style={globalStyles.filledButton}
        >
          <Text style={styles.button}>Signup</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={testGoogleAuth}
          style={globalStyles.outlinedButton}
        >
          <Text style={styles.button}>Test Google Auth</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={goHome}
          style={globalStyles.filledButton}
        >
          <Text style={styles.button}>No Account</Text>
        </TouchableOpacity>

        <Text style={styles.error}>{errorText}</Text>
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
  inputContainer: {
    width: "60%",
  },
  buttonContainer: {
    width: "50%",
    flex: 1,
    alignItems: "center",
  },
  error: {
    color: "grey",
    marginTop: 10,
  },
  button: {

  }
});
