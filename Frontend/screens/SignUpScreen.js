import React, {useState} from 'react';
import { View, Text, TextInput, StyleSheet, Button, Dimensions, Alert} from 'react-native';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import { app } from "../firebase"
const { height, width } = Dimensions.get('screen');
import { HeaderHeight } from "../constants/utils";

const auth = getAuth(app)

  export default function ProScreen({navigation}) {
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
                navigation.navigate("form")
            }
            else {
                Alert.alert('Signup Error', 'Unable to find user after signup');
            }
        });
    }
      catch (error) {
          if (error instanceof Error) {
              Alert.alert('Error', error.message);
          }
          else {
              Alert.alert('Error', 'An unknown error occurred');
          }
      }
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Sign Up Screen</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
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