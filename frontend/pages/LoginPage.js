import { KeyboardAvoidingView, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'

const LoginPage = () => {
  return (
    <KeyboardAvoidingView
        style = {styles.container}
        behavior="padding"
    >
        <h1>Login and Signup</h1>

        <View style={styles.inputContainer}>
            <TextInput 
                placeholder="Email"
                style={styles.input}
            />

            <TextInput 
                placeholder="Password"
                style={styles.input}
                secureTextEntry
            />
        </View>

        <View style={styles.buttonContainer}>
            <TouchableOpacity
                onPress={ () => {}}
                style={[styles.button, styles.buttonOutline]}
            >
                <Text style={styles.button}>Login</Text>
            </TouchableOpacity> 

            <TouchableOpacity
                onPress={ () => {}}
                style={[styles.button, styles.buttonOutline]}
            >
                <Text style={styles.button}>Signup</Text>
            </TouchableOpacity>
        </View>

    </KeyboardAvoidingView>
  )
}

export default LoginPage

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