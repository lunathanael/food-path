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
          <View style={styles.button}>
            <Button title="Sign Up" style={styles.button} color="#FFFFFF" onPress={handleLogin} />
          </View>
          <View style={styles.button}>
            <Button title="Go Back" onPress={handleLogin} color="#FFFFFF" style={styles.sign} />
          </View>
        </View>

      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
