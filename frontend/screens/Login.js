
import { useEffect, useState, createContext} from "react";
import {  
  KeyboardAvoidingView,
  Image,
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
import { Ionicons } from "@expo/vector-icons";



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
  const imagePaths = ['../assets/hero_reader.jpg','../assets/hero_reel.jpg','../assets/hero_stack.jpg']
  console.log("Entering Categories")


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
      <Image style={styles.heroimg} source={require('../assets/hero_stack.jpg')}/>
      <Image style={styles.logo} source={require('../assets/QuickReadsLogo.png')}/>
      <Text style={styles.text}>Your source of bite-sized news</Text>
      
      <View style= {styles.loginSection}>
        <View style={styles.googleButtonContainer}>
          <Ionicons name="logo-google"
            size={30} color = "#134F5C" 
            style={styles.googleG}/>
          <Button
            title="Sign in with Google"
            disabled={!request}
            onPress={() => {promptAsync();}}
            color="#134F5C"
            style={styles.loginButton}
          />
        </View>
        <View>
          <Button 
              title="No Account"
              onPress={() => goHome({email: "NO ACCOUNT"})}
              color="#A2C4C9"
              style={styles.noAccountButton}
            />
        </View>
      </View>
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
    color: "#76A5AF",
    fontWeight: "normal",
    fontStyle: "italic"
  },
  heroimg: {
    width: '100%',
    height: '50%',
    resizeMode: 'cover',
  }, 
  logo: {
    width: '90%',
    height: '15%',
    resizeMode: 'contain',
  },
  googleButtonContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  }, 
  loginSection: { 
    flex: 1,
    backgroundColor: "#E3F3F3",
    alignItems: "center",
    padding: '50',
    width: "90%",
    margin: 10,
    justifyContent: "space-around"
  },
  loginButton: {
    width: '40%'
  }, 
  googleG: {
    marginHorizontal: '10px',
  },
});