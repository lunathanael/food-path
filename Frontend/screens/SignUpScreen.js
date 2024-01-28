import React, {useState} from 'react';
import { View, Text, TextInput, StyleSheet, Button, Dimensions, Alert, Image, KeyboardAvoidingView, TouchableWithoutFeedback, ScrollView, Keyboard} from 'react-native';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';

import { app } from "../firebase"

const { height, width } = Dimensions.get('screen');
const screenheight=Dimensions.get('screen').height;
const screenwidth=Dimensions.get('screen').width;

import { HeaderHeight } from "../constants/utils";

const auth = getAuth(app)

export default function ProScreen({ navigation, route }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [email, setEmail] = useState("")
  const [isSignedUp, setIsSignedUp] = useState(false);


  const handleLogin = () => {
    navigation.navigate("sign-in")
  };

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
        if (userCredential.user) {
          await updateProfile(userCredential.user, { displayName: username });
          setIsSignedUp(true);
          setEmail("")
          setPassword("")
          setUsername("")
          try {
            await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
              if (userCredential.user) {
                navigation.navigate("form")
              }
            });
          }
          catch (error) {
            console.error("Sign in error, ", error)
            if (error instanceof Error) {
              Alert.alert('Error', "Please sign up first or make sure your email and password are correct");
            }
            else {
              Alert.alert('Error', 'An unknown error occurred');
            }
          }
        }
        else {
          Alert.alert('Signup Error', 'Unable to find user after signup');
        }
      });
    }
    catch (error) {
      console.error("Signup error, ", error)
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      }
      else {
        Alert.alert('Error', 'An unknown error occurred');
      }
    }
  };



    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={HeaderHeight}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Image source={require('../assets/images/proscreen.png')} style={styles.image} />
            <View style={styles.inputContainer}>
              <Text style={styles.title}>Sign up</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor="#7954A1"
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
              />
              <TextInput
                style={styles.input}
                placeholderTextColor="#7954A1"
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TextInput
                style={styles.input}
                placeholderTextColor="#7954A1"
                placeholder="Password"
                value={username}
                onChangeText={setUsername}
              />
              <View style={styles.button}>
                <Button title="Sign up" onPress={handleSignUp} color="#C55FFC" />
              </View>
              <View style={styles.button}>
                <Button title="Log into Existing Account" onPress={handleLogin} color="#C55FFC" />
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContainer: {
      flexGrow: 1,
      justifyContent: 'center',
    },
    image: {
      flex: 0.9,
      width: screenwidth,
      height: 'auto',
      justifyContent: 'top',
    },
    inputContainer: {
      width: '100%',
      flex: 0.6,
      backgroundColor: '#7954A1',
      alignItems: 'center',
    },
    title: {
      flex: 0.2,
      paddingTop: 20,
      fontSize: 30,
      fontWeight: 'bold',
      color: '#000000',
    },
    input: {
      flex: 0.075,
      marginBottom: 10,
      padding: 8,
      height: 40,
      width: '80%',
      alignContent: 'center',
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 8,
      backgroundColor: '#FFFFFF',
      color: '#7954A1',
      fontSize: 20,
    },
    button: {
      flex: 0.08,
      marginBottom: 4,
      width: '60%',
      height: '100%',
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 8,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });