
import { useEffect, useState, createContext} from "react";
import {  
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Keyboard,
  TouchableOpacity,Button } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useNavigation } from "@react-navigation/native";
import { globalStyles } from "../styles/global";


WebBrowser.maybeCompleteAuthSession();

export default function LoginPage() {
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const navigation = useNavigation();
  const root = "http://quickreads-env.eba-nmhvwvfp.us-east-1.elasticbeanstalk.com"; 
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: "872073890696-78hvopdpiup20e0c0jmpe28ocpum9iq1.apps.googleusercontent.com",
    webClientId: "872073890696-o39iuubklkdqprs44b2qthk31uab2dsv.apps.googleusercontent.com",
    androidClientId: "872073890696-e96q462alifn6hemd1rtb3us5bfng5a4.apps.googleusercontent.com"
  });


  const goHome = (userObj) => {
    if (userObj.email == "NO ACCOUNT"){ // DEFAULT USER: {email: "NO ACCOUNT"}
      userObj = {email: "ilikesomensalad@gmail.com", given_name: "Kai W", id: "109514402886947340000", locale: "en", name: "Kai W", picture: "https://lh3.googleusercontent.com/a/AGNmyxZcrle_Ah-6rioWIXRN_0eZEbTfoFWcaPEs9zeaSg=s96-c", verified_email: true};
    }
    global.id = userObj.id;
    global.name = userObj.name;
    navigation.replace("BottomTabNavigator", {userInfo: userObj});
  };

  useEffect(() => {
    if (response?.type === "success") {
      setToken(response.authentication.accessToken);
      getUserInfo();
    }
  }, [response, token]);

  // sending user info to the back end
  async function serverAuth(userAuth) {
    console.log("Calling SeverAuth"); 
    const response = await fetch(root+"/Auth", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userAuth),
    }).then(response => {
      if (!response.ok) { 
        throw new Error(`Request failed with status ${response.status}`);
      }
      else {
        const responseData = response.json();
        const { user, message } = responseData;
        console.log(message, user);
        console.log("Server Authentication Succeeded");
        goHome(userAuth);
      }
    }).catch(error => {
      console.log("Server Authentication Failed");
      console.error('Error occurred:', error.message);
    });
  }

  const getUserInfo = async () => {
    console.log("Calling getUserInfo"); 
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      setUserInfo(user);
      console.log(user);
      serverAuth(user);
    } catch (error) {
      console.log("Error occured getting user info: " + error);
    }
  };


  return (
    <View style={styles.container}>
        <Button
          title="Sign in with Google"
          disabled={!request}
          onPress={() => {promptAsync();}}
          color="#2776d9"
        />
      
      {/* <View >
      {'error' in userInfo ? (
        <Button
          title="Sign in with Google"
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
        />
      ) : (
        goHome(userInfo)
      )}
      </View> */}
      
      <Button title="No Account" onPress={() => goHome({email: "NO ACCOUNT"})} color="#2776d9"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

// import {
//   KeyboardAvoidingView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
//   Keyboard,
//   TouchableOpacity,
// } from "react-native";
// import React, { useState, useEffect } from "react";
// import { useNavigation } from "@react-navigation/native";
// import { globalStyles } from "../styles/global";

// import * as WebBrowser from "expo-web-browser";
// import * as Google from "expo-auth-session/providers/google";


// export default function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigation = useNavigation();
//   const [errorText, setErrorText] = useState("");
//   // FOR LOGIN
//   const [token, setToken] = useState("");
//   const [userInfo, setUserInfo] = useState(null);
//   const root = 'http://quickreads-env.eba-nmhvwvfp.us-east-1.elasticbeanstalk.com';

//   const goHome = () => {
//     console.log("GOING" + email);
//     navigation.replace("BottomTabNavigator");
//   };

//   async function testGoogleAuth() {
//     const myAuthtoken = "111239336200270088302"
//     const myEmail = "zimmeritz64@gmail.com"
//     const myName = "Michael Chen"

//     let userAuth = { authtoken: myAuthtoken, email: myEmail, name: myName};
//     console.log(userAuth);
//     const request = await fetch(root+"/auth", {
//       method: "POST",
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(userAuth),
//       })
//       .then(response => console.log(response))
//       .catch(error => console.log(error));
//       console.log("Signing Up " + (userAuth.name));
//   }

//   async function handleSignUp() {
//     if (email.length == 0 || password.length == 0) {
//       setErrorText("[No Input Detected]");
//       return;
//     }
//     let usernameExists = false;
//     const request = await fetch(root+'/adduser/'+email,
//       {
//         method: "GET",
//       }
//     )
//       .then((response) => {
//         return response.json();
//       })
//       .then((responseJSON) => {
//         if (
//           responseJSON.status ||
//           responseJSON.message != "Username does not exist"
//         ) {
//           usernameExists = true;
//         }
//       })
//       .catch();
//     if (usernameExists) {
//       setErrorText("Username Already Exists");
//       return;
//     }
//     setErrorText("Registered " + email + "!");
//     //ADD USER TO TABLE
//     const signupRequest = await fetch(root+'/adduser/'+email+'/'+password,
//       {
//         method: "GET",
//       }
//     );
//   }

//   async function handleLogin() {
//     if (email.length == 0 || password.length == 0) {
//       setErrorText("[No Input Detected]");
//       return;
//     }
//     const request = await fetch(root+'/checkuser/'+email+'/'+password,
//       {
//         method: "GET",
//       }
//     )
//       .then((response) => {
//         return response.json();
//       })
//       .then((responseJSON) => {
//         if (responseJSON.status) {
//           setErrorText("Logging in " + email);
//           goHome();
//         } else {
//           setErrorText("Could not log in " + email);
//         }
//       });
//   }

//   return (
//     <KeyboardAvoidingView style={styles.container} behavior="padding">
//       <View style={styles.inputContainer}>
//         <TextInput
//           placeholder="Email"
//           value={email}
//           onChangeText={(input) => setEmail(input)}
//           style={globalStyles.input}
//         />

//         <TextInput
//           placeholder="Password"
//           value={password}
//           onChangeText={(input) => setPassword(input)}
//           style={globalStyles.input}
//           secureTextEntry
//         />
//       </View>

//       <View style={styles.buttonContainer}>
//         <TouchableOpacity
//           onPress={handleLogin}
//           style={globalStyles.outlinedButton}
//         >
//           <Text style={styles.button}>Login</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={handleSignUp}
//           style={globalStyles.filledButton}
//         >
//           <Text style={styles.button}>Signup</Text>
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={testGoogleAuth}
//           style={globalStyles.outlinedButton}
//         >
//           <Text style={styles.button}>Test Google Auth</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={goHome}
//           style={globalStyles.filledButton}
//         >
//           <Text style={styles.button}>No Account</Text>
//         </TouchableOpacity>

//         <Text style={styles.error}>{errorText}</Text>
//       </View>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   inputContainer: {
//     width: "60%",
//   },
//   buttonContainer: {
//     width: "50%",
//     flex: 1,
//     alignItems: "center",
//   },
//   error: {
//     color: "grey",
//     marginTop: 10,
//   },
//   button: {

//   }
// });
