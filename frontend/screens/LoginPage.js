import { KeyboardAvoidingView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, {useState, useEffect} from 'react'
import { useNavigation } from '@react-navigation/native'
import { TouchableOpacity } from 'react-native'
import BottomTabNavigator from '../routes/bottomTab'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation();

    useEffect(() => {
        /** if (logged in) 
         * navigation.navigate("Home")
         */ 
        return;
    });

    const goHome = () => {navigation.replace("BottomTabNavigator")};

    const handleSignUp = () =>  {
        console.log("Signing up " + email + " " + password);
        //sendToBackEnd(email,password)

    }
    const handleLogin = () => {
        console.log("Logging in " + email + " " + password);
        //sendToBackEnd(email,password)
    }

  return (
    <KeyboardAvoidingView
        style = {styles.container}
        behavior="padding"
    > 
        <Text>Login and Signup</Text>

        <View style={styles.inputContainer}>
            <TextInput 
                placeholder="Email"
                value = {email}
                onChangeText={input => setEmail(input)}
                style={styles.input}
            />

            <TextInput 
                placeholder="Password"
                value = {password}
                onChangeText={input => setPassword(input)}
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
                style={[styles.button, styles.buttonOutline]}
            >
                <Text style={styles.button}>Signup</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={goHome}
                style={[styles.button, styles.buttonOutline]}
            >
                <Text style={styles.button}>(Override: Go Home)</Text>
            </TouchableOpacity>
        </View>

    </KeyboardAvoidingView>
  )
}

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