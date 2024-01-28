import React, { useState } from 'react';
import { View, Button, FlatList, Text } from 'react-native';
import ModalComponent from './ModalComponent'; // Import your modal component

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
        <Text>{item.className}, {item.timeName}</Text>
        <View>
        {item.selectedDays.map(dayId => (
          <Text>{daysOfWeek[dayId]}</Text>
        ))}
      </View>
      </>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={classes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={handleRenderItem}
      />
      <Button title="Add New Class" onPress={() => setModalVisible(true)} />

      <ModalComponent
        isVisible={isModalVisible}
        onAddClass={handleAddClass}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default YourScreen;
