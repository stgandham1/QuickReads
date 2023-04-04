import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const HomePage = () => {
  navigation = useNavigation();

  const handleSignout = () => {
    navigation.replace("Login")
  };

  const goToLogin = () => {

  }

  return (
    <View style = {styles.container}>
      <h1>HomePage</h1>
      <Text>Email: {/**currentEmail*/}</Text>
      <TouchableOpacity
      onPress={handleSignout}
      style = {styles.button}
      >
        <Text style = {styles.buttonOutline}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  )
}

export default HomePage

const styles = StyleSheet.create({

})