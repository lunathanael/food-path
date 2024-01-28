import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

const screenheight = Dimensions.get('screen').height;
const screenwidth = Dimensions.get('screen').width;
import { HeaderHeight } from '../constants/utils';

export default function ProScreen({navigation}) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    navigation.navigate("app")
  };

  const handleSignUp = () => {
    navigation.navigate("sign-up")
  };

  return (
      <View style={styles.container}>
      <Text style={styles.title}>Log In Screen</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Username"
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
  },
  image: {
    flex: 0.6,
    justifyContent: 'center',
    width: screenwidth,
  },
  info: {
    flex: 0.5,
    alignItems: 'center',
    backgroundColor: '#7954A1',
    width: screenwidth,
    paddingTop: 30,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 3,
    paddingLeft: 10,
    width: 300,
    backgroundColor: '#FFFFFF',
    color: '#000000',
    fontWeight: 0.8,
  },
  button: {
    height: 40,
    width: 120,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 3,
    marginLeft: 10,
    marginRight: 10,
  },
});
