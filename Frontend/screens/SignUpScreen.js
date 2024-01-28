// import React, {useState} from 'react';
// import { View, Text, TextInput, StyleSheet, Button, Dimensions, Alert} from 'react-native';
// import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
// import { app } from "../firebase"
// const { height, width } = Dimensions.get('screen');
// import { HeaderHeight } from "../constants/utils";

// const auth = getAuth(app)

//   export default function ProScreen({navigation}) {
//     const [username, setUsername] = useState("")
//     const [password, setPassword] = useState("")
//     const [email, setEmail] = useState("")
//     const [isSignedUp, setIsSignedUp] = useState(false);

//     const handleLogin = () => {
//       navigation.navigate("sign-in")
//     };

//     const handleSignUp = async () => {
//       try {
//         await createUserWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
//             if (userCredential.user) {
//                 await updateProfile(userCredential.user, { displayName: username });
//                 setIsSignedUp(true);
//                 setEmail("")
//                 setPassword("")
//                 setUsername("")
//                 navigation.navigate("form")
//             }
//             else {
//                 Alert.alert('Signup Error', 'Unable to find user after signup');
//             }
//         });
//     }
//       catch (error) {
//           if (error instanceof Error) {
//               Alert.alert('Error', error.message);
//           }
//           else {
//               Alert.alert('Error', 'An unknown error occurred');
//           }
//       }
//     };

//     return (
//         <View style={styles.container}>
//         <Text style={styles.title}>Sign Up Screen</Text>

//         <View style={styles.inputContainer}>
//           <TextInput
//             style={styles.input}
//             placeholder="Email"
//             value={email}
//             onChangeText={setEmail}
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


import React, {useState} from 'react';
import { View, Text, TextInput, StyleSheet, Button, Dimensions, Alert, Image, KeyboardAvoidingView, TouchableWithoutFeedback, ScrollView, Keyboard} from 'react-native';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import { app } from "../firebase"

const { height, width } = Dimensions.get('screen');
const screenheight=Dimensions.get('screen').height;
const screenwidth=Dimensions.get('screen').width;

import { HeaderHeight } from "../constants/utils";

const auth = getAuth(app)

  export default function ProScreen({navigation}) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [isSignedUp, setIsSignedUp] = useState(false);

    const handleLogin = async () => {
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

    const handleSignUp = () => {
      navigation.navigate("sign-up")
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
              <View style={styles.button}>
                <Button title="Sign up" onPress={handleSignUp} color="#C55FFC" />
              </View>
              <View style={styles.button}>
                <Button title="Go back" onPress={handleLogin} color="#C55FFC" />
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