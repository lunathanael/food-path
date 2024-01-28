import React, { useState } from 'react';
import { View, Button, FlatList, Text, LogBox } from 'react-native';
import ModalComponent from './ModalComponent'; // Import your modal component


import { collection, addDoc } from "firebase/firestore"; 

import { getApps, initializeApp } from "firebase/app";
import {app, db} from '../firebase'

if (!getApps().length) {
  initializeApp(firebaseConfig);
}
LogBox.ignoreLogs([`Setting a timer for a long period`]);


const YourScreen = ({navigation}) => {
  const [classes, setClasses] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleAddClass = (newClassName) => {
    setClasses(prevClasses => [...prevClasses, newClassName]);
    setModalVisible(false);
  };

  const handleRenderItem = ({item}) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    return (
      <>
        <Text>{item.Name}</Text>
        <Text>Start Time: {item.StartTime}, End Time: {item.EndTime}</Text>
        <Text>Coordinates: {item.Longitude}, {item.Latitude}</Text>
        <View>
        {item.DaysOfWeek.map(dayId => (
          <Text>{daysOfWeek[dayId]}</Text>
        ))}
      </View>
      </>
    );
  }

  const handleSaveClasses = async () => {
    try {
      for (const c in classes) {
        const docRef = await addDoc(collection(db, 'classes'), {
          Name:'name',
          Latitude:0.1,
          Longitude:0.2,
          DaysOfWeek:[0,1,2],
          StartTime:"startsnow",
          EndTime:"Cya",
        });
        console.log(docRef.id)
      }
    }
    catch (e) {
      console.error("Error adding document: ", e);
    }

    navigation.navigate('app');
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
