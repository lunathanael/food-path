import React, { useState } from 'react';
import { View, Button, FlatList, Text } from 'react-native';
import ModalComponent from './ModalComponent'; // Import your modal component

import { collection, addDoc } from "firebase/firestore"; 

// PACKAGES
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get } from "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyCjYzQ8JfadVxf6llSikhjiEfpX-Lbg4iQ",
  authDomain: "food-path-24322.firebaseapp.com",
  databaseURL: "https://food-path-24322-default-rtdb.firebaseio.com",
  projectId: "food-path-24322",
  storageBucket: "food-path-24322.appspot.com",
  messagingSenderId: "1084147699802",
  appId: "1:1084147699802:web:f1e97a8fac6b203d16c863",
  measurementId: "G-8QL9VFEXW9"
};
// PACKAGES



const YourScreen = ({navigation, route}) => {
  const [classes, setClasses] = useState({});
  const [isModalVisible, setModalVisible] = useState(false);

  const username = route.params.username;

  const handleAddClass = (className, classInfo) => {

    setClasses(prevClasses => ({...prevClasses, 'ClassName': classInfo}));


    setModalVisible(false);
  };

  // GET DATA
  const app = initializeApp(firebaseConfig);
  const db = ref(getDatabase(app));
  get(child(db, `users/Aidan/classes/CSE 232`)).then((snapshot) => {
    if (snapshot.exists()) {
      console.log(snapshot.val());
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
  // GET DATA
  // SET DATA
  set(ref(db, 'users/Aidan/classes/CSE 232'), {
    username: "name",
    email: "email",
    profile_picture : "imageUrl"
  });
  // SET DATA
  const handleRenderItem = ({item}) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
      <>
        <Text>{item.name}</Text>
        <Text>Start Time: {item.time.start}, End Time: {item.time.end}</Text>
        <Text>Coordinates: {item.location.long}, {item.location.lat}</Text>
        <View>
        {item.days.map(dayId => (
          <Text>{days[dayId]}</Text>
        ))}
      </View>
      </>
    );
  }

  const handleSaveClasses = async () => {
    set(ref(db, `users/${username}/`), classes);

    navigation.navigate('app', {'username':username, 'db':db});
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={classes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={handleRenderItem}
      />
      <>
        <Button title="Add Class" onPress={() => setModalVisible(true)} />
        <Button title="Save Classes" onPress={handleSaveClasses}></Button>
      </>

      <ModalComponent
        isVisible={isModalVisible}
        onAddClass={handleAddClass}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default YourScreen;
