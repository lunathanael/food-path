import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, Modal, StyleSheet } from 'react-native';

const DaySelector = ({selectedDays, setSelectedDays}) => {
    const daysofWeekId = [0, 1, 2, 3, 4, 5, 6];
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  
    const toggleDay = (dayId) => {
      if (selectedDays.includes(dayId)) {
        setSelectedDays(selectedDays.filter(d => d !== dayId));
      } else {
        setSelectedDays([...selectedDays, dayId]);
      }
    };
  
    return (
      <View style={styles.container}>
        {daysofWeekId.map(dayId => (
          <TouchableOpacity
            key={dayId}
            style={[
              styles.dayButton,
              selectedDays.includes(dayId) && styles.selectedDay
            ]}
            onPress={() => toggleDay(dayId)}
          >
            <Text style={styles.dayText}>{daysOfWeek[dayId]}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
    },
    dayButton: {
      padding: 10,
      margin: 5,
      borderWidth: 1,
      borderColor: 'gray',
      borderRadius: 5,
    },
    selectedDay: {
      backgroundColor: 'lightblue',
    },
    dayText: {
      color: 'black',
    },
  });

const ModalComponent = ({ isVisible, onAddClass, onClose }) => {
  const [className, setClassName] = useState('');
  const [timeName, setTimeName] = useState('');
  const [selectedDays, setSelectedDays] = useState([]);

  const handleSave = () => {
    console.log(selectedDays);
    onAddClass({'className': className, 'timeName': timeName});
    setClassName('');
    setTimeName('');
    setSelectedDays([]);
  };


  return (
    <Modal visible={isVisible} onRequestClose={onClose} animationType="slide">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TextInput
          placeholder="Class Name"
          value={className}
          onChangeText={setClassName}
        />
        <TextInput
          placeholder="Time Name"
          value={timeName}
          onChangeText={setTimeName}
        />
        <DaySelector selectedDays={selectedDays} setSelectedDays={setSelectedDays}/>
        <Button title="Add" onPress={handleSave} />
        <Button title="Cancel" onPress={onClose} />
      </View>
    </Modal>
  );
};

export default ModalComponent;
