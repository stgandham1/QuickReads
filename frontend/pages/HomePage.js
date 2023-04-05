import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const HomePage = () => {
  navigation = useNavigation();

  const handleSignout = () => { //SIGNOUT BUTTON
    //Signout
  };

  const goToLogin = () => { //GO TO LOGIN
    navigation.replace("Login")
  }

  return (
    <View style = {styles.container}>
      <h1>HomePage</h1>
      <Text>Email: {/**currentEmail*/}</Text>
      <TouchableOpacity
      onPress={goToLogin}
      style = {[styles.button, styles.buttonOutline]}
      >
        <Text style = {styles.button}>Sign Out</Text>
      </TouchableOpacity>

    </View>
  )
}

export default HomePage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputContainer: {
      width: '60%',
  },
  input: {
      backgroundColor:'white',
      paddingVertical:10,
      paddingHorizontal:15,
      borderRadius: 10,
      marginTop:10,
      marginBottom:10, 
  },
  buttonContainer: { 
      width: '50%',
      flex:1,
      alignItems:'center',
  },
  button: { 
      backgroundColor:'white',
      borderRadius:5,
  },
  buttonOutline: { 
      width:'20%',
      paddingHorizontal:10,
      paddingVertical:5,
      borderColor: 'grey',
      borderWidth:1,
      marginTop:10,
  },
})