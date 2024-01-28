import React, {useState} from 'react';
import { View, Text, TextInput, StyleSheet, Button, Dimensions} from 'react-native';

const { height, width } = Dimensions.get('screen');
import { HeaderHeight } from "../constants/utils";

  export default function FormScreen({navigation}) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleLogin = () => {
      navigation.navigate("app")
    };

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Class Form</Text>

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
          title="Login"
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