import React, { useState } from 'react';
import { View, Button, FlatList, Text } from 'react-native';
import ModalComponent from './ModalComponent'; // Import your modal component


import { collection, addDoc } from "firebase/firestore"; 

import { getApps, initializeApp } from "firebase/app";
import {app, db} from '../firebase'



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
    try {
      const docRef = await addDoc(collection(db, 'Schedule'), {'Classes': classes});
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
