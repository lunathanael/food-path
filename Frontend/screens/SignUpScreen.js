import React, {useState} from 'react';
import { View, Text, TextInput, StyleSheet, Button, Dimensions, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {app} from "../firebase"
import {getAuth, createUserWithEmailAndPassword, updateProfile} from "firebase/auth"
import { HeaderHeight } from "../constants/utils";

const { height, width } = Dimensions.get('screen');
const auth = getAuth(app)

export default function SignUpScreen({navigation}) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isSignedUp, setIsSignedUp] = useState(false)
  const [email, setEmail] = useState("")

  const handleLogin = () => {
    navigation.navigate("sign-in");
  };

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password).then(async(userCredential) => {
        if (userCredential.user) {
          await updateProfile(userCredential.user, {displayName: username})
          setIsSignedUp(true)
          setEmail("")
          setPassword("")
          setUsername("")
          navigation.navigate("sign-in");
        } else {
          Alert.alert("Error")
        }
      })
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      } else {
        Alert.alert('Unknown error')
      }
    }
  };

  return (
    <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={styles.title}>Sign Up Screen</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="black"
              value={username}
              onChangeText={setUsername}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <Button
            title="Sign Up"
            onPress={handleSignUp}
            color="#3498db"
          />
          <Button
            title="Log In"
            onPress={handleLogin}
            color="#3498db"
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
    paddingLeft: 8,
  },
});
