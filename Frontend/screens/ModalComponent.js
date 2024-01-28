import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Button, Modal, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import FormMap from './FormMap';

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
  const [selectedDays, setSelectedDays] = useState([]);


  const convertDateToStr = (d) => {
    return (
        d.toLocaleTimeString('it-IT').substr(0, 2) + d.toLocaleTimeString('it-IT').substr(3, 2)
    );
  }

  const [date, setDate] = useState(new Date(Date.now()));
  const [time, setTime] = useState(convertDateToStr(date));
  const [show, setShow] = useState(false);

  const [date1, setDate1] = useState(new Date(Date.now()));
  const [time1, setTime1] = useState(convertDateToStr(date1));
  const [show1, setShow1] = useState(false);



  const handleSave = () => {
    onAddClass({'className': className, 'startTime': time, 'endTime':time1, 'selectedDays': selectedDays, 'coordinates' : location});

    setClassName('');
    setDate(new Date(Date.now()));
    setTime(convertDateToStr(new Date(Date.now())));
    setDate1(new Date(Date.now()));
    setTime1(convertDateToStr(new Date(Date.now())));
    setSelectedDays([]);
    setLocation([]);
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    setTime(convertDateToStr(currentDate));
};

  const showMode = () => {
    setShow(true);
  };

  const onChange1 = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow1(false);
    setDate1(currentDate);
    setTime1(convertDateToStr(currentDate));
};


  const showMode1 = () => {
    setShow1(true);
  };


  const [location, setLocation] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleAddLocation = (MapLocation) => {
    setLocation(MapLocation);
  };

  return (
    <Modal visible={isVisible} onRequestClose={onClose} animationType="slide">
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TextInput
          placeholder="Class Name"
          value={className}
          onChangeText={setClassName}
        />

        <Text>Start Time: {time}</Text>
        <Button onPress={showMode} title="Select new Start Time" />
        {show && (
        <DateTimePicker
          testID="start-time"
          value={date}
          mode='time'
          is24Hour={true}
          onChange={onChange}
        />
        )}

        <Text>End Time: {time1}</Text>
        <Button onPress={showMode1} title="Select new End Time" />
        {show1 && (
        <DateTimePicker
          testID="end-time"
          value={date1}
          mode='time'
          is24Hour={true}
          onChange={onChange1}
        />
        )}
        <DaySelector selectedDays={selectedDays} setSelectedDays={setSelectedDays}/>


        <Button title="Find Location" onPress={() => setModalVisible(true)} />
        <FormMap
            isVisible={isModalVisible}
            onAddLocation={handleAddLocation}
            onClose={() => setModalVisible(false)}
            setLocation={setLocation}
        />

        <Button title="Add" onPress={handleSave} />
        <Button title="Cancel" onPress={onClose} />
      </View>
    </Modal>
  );
};

export default ModalComponent;
