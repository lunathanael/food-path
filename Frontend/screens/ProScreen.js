import React, {useState} from 'react';
import { View, Text, TextInput, StyleSheet, Button, Dimensions, Alert} from 'react-native';

const { height, width } = Dimensions.get('screen');
import { HeaderHeight } from "../constants/utils";
import { signInWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import { app } from "../firebase"

const auth = getAuth(app)

  export default function ProScreen({navigation}) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")

    const handleLogin = async () => {
      try {
        await signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
          if (userCredential.user) {
            setEmail("")
            setPassword("")
            navigation.navigate("app")
          }
        });
      }
      catch (error) {
        if (error instanceof Error) {
          Alert.alert('Error', "Please sign up first or make sure your email and password are correct");
        }
        else {
          Alert.alert('Error', 'An unknown error occurred');
        }
      }
      
    };

    const handleSignUp = () => {
      navigation.navigate("sign-up")
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Sign In Screen</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="email"
            value={email}
            onChangeText={setEmail}
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
          title="Log In"
          onPress={handleLogin}
          color="#3498db"
        />
        <Button
          title="Sign Up"
          onPress={handleSignUp}
          color="#3498db"
        />


      </View>
    );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
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