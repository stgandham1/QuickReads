import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    /** if (logged in)
     * navigation.navigate("Home")
     */
    return;
  });

  const goHome = () => {
    navigation.replace("BottomTabNavigator");
  };

  const signupRoute = 'http://quickreads-env.eba-nmhvwvfp.us-east-1.elasticbeanstalk.com/adduser';
  const loginRoute = 'http://quickreads-env.eba-nmhvwvfp.us-east-1.elasticbeanstalk.com/checkuser';
  async function handleSignUp() {
    if (email.length == 0 || password.length == 0) { 
      console.log("[No Input Detected]");
      return;
    }

    let usernameExists = false;
    const loginRequest = await fetch(loginRoute+'/'+email+'/'+password, {
      method:'GET',
    }).then(response => {return response.json()})
    .then((responseJSON) => {
        if (responseJSON.status) {
          usernameExists = true;
        }
    }).catch();
    if (usernameExists) { 
      console.log("[Username Already Exists]"); 
      return; 
    }
    // ADD USER TO TABLE
    const signupRequest = await fetch(signupRoute+'/'+email+'/'+password, {
      method:'GET', 
    })
    console.log("Signing up " + email + " " + password);
  };

  async function handleLogin() {
    if (email.length == 0 || password.length == 0) { 
      console.log("[No Input Detected]");
      return;
    }
    const loginRequest = await fetch(loginRoute+'/'+email+'/'+password, {
      method:'GET',
    }).then((response) => {return response.json();})
    .then((responseJSON) => {
        if (responseJSON.status) {
          console.log("Logging in " + email + " " + password);
          goHome();
        } else {
          console.log("Could not log in " + email + " " + password);
        }
    })
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        console.log("dismiss keyborad");
        Keyboard.dismiss();
      }}
    >
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={(input) => setEmail(input)}
            style={styles.input}
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={(input) => setPassword(input)}
            style={styles.input}
            secureTextEntry
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleLogin}
            style={[styles.button, styles.buttonOutline]}
          >
            <Text style={styles.button}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSignUp}
            style={[styles.button, styles.buttonEmpty]}
          >
            <Text style={styles.button}>Signup</Text>
          </TouchableOpacity>

          {/* <TouchableOpacity
            onPress={goHome}
            style={[styles.button, styles.buttonEmpty]}
          >
            <Text style={styles.button}>Read Without Account</Text>
          </TouchableOpacity> */}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
  input: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    width: "50%",
    flex: 1,
    alignItems: "center",
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
  buttonEmpty: {
    backgroundColor: "#d6e8ff",
    width: "100%",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderColor: '#bbd8fc',
    borderWidth: 2,
    marginTop:10,
  }
});
