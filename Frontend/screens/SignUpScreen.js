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

export default function ProScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    navigation.navigate('sign-in');
  };

  const handleSignUp = () => {
    navigation.navigate('sign-up');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
        keyboardVerticalOffset={HeaderHeight}
      >
        <Image source={require('../assets/images/proscreen.png')} style={styles.image} />
        <View style={styles.info}>
          <Text h1 style={styles.header}>Sign Up</Text>
          <TextInput
            placeholderTextColor="#7954A1"
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          <TextInput
            placeholderTextColor="#7954A1"
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <View style={styles.button}>
            <Button title="Sign Up" style={styles.button} color="#FFFFFF" onPress={handleLogin} />
          </View>
          <View style={styles.button}>
            <Button title="Go Back" onPress={handleLogin} color="#FFFFFF" style={styles.sign} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 25,
    fontWeight: "bold",
  },
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



// import React, {useState} from 'react';
// import { View, Text, TextInput, StyleSheet, Button, Dimensions} from 'react-native';

// const { height, width } = Dimensions.get('screen');
// import { HeaderHeight } from "../constants/utils";

//   export default function ProScreen({navigation}) {
//     const [username, setUsername] = useState("")
//     const [password, setPassword] = useState("")

//     const handleLogin = () => {
//       navigation.navigate("sign-in")
//     };

//     const handleSignUp = () => {
//       navigation.navigate("form")
//     };

//     return (
//         <View style={styles.container}>
//         <Text style={styles.title}>Sign Up Screen</Text>

//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Username"
//             value={username}
//             onChangeText={setUsername}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Password"
//             secureTextEntry
//             value={password}
//             onChangeText={setPassword}
//           />
//         </View>
//         <Button
//           title="Sign Up"
//           onPress={handleSignUp}
//           color="#3498db"
//         />
//         <Button
//           title="Log In"
//           onPress={handleLogin}
//           color="#3498db"
//         />


//       </View>
//     );
// }
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 16,
//   },
//   inputContainer: {
//     width: '100%',
//     marginBottom: 16,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     borderRadius: 8,
//     marginBottom: 8,
//     paddingLeft: 8,
//   },
// });
