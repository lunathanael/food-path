import React, {useState, useEffect} from 'react';
import { StyleSheet, Dimensions, ScrollView, View, Button } from 'react-native';
import { Block, Text, Input, theme } from 'galio-framework';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
const { height, width } = Dimensions.get('screen');

import * as Location from "expo-location";

//import PathRouting from '../components/PathRouting'

const PathRouting = (user) => (
  {
  'targets':
    [
      {'coordinate': [42.72748896537191, -84.48238172159411], 'name': "wells"},
      {'coordinate': [42.726583250822706, -84.47336646476118], 'name': "bcc"},
      {'coordinate': [42.7249909424121, -84.48131374858022], 'name': 'egr building'}
    ],
  'distance':
    "1.9",
  'time':
    "32",
  }
);

const Waiting_Driver_Screen = ({handleSetLocation, mapCustomStyle, onMapPress}) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);

  useEffect(() => {

    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      let routingInfo = PathRouting(0);


      let location = {'coords': {'latitude': 42.7229439975, 'longitude': -84.4792321495}};
      if (status !== "granted") {
        console.log("Permission to access location was denied");
      }
      else {
          location = await Location.getCurrentPositionAsync({});
      }
      console.log(location);

      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0422,
        longitudeDelta: 0.0221,
      });
    };

    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      {initialRegion && (
          
        <MapView 
        provider={PROVIDER_GOOGLE}
        style={styles.map} 
        initialRegion={initialRegion}
        customMapStyle={mapCustomStyle}
        onPress={onMapPress}>
          {currentLocation && (
            <Marker
              coordinate={{
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
              }}
              title="Your Location"
            />
          )}
        </MapView>
      )}
    </View>
  );
};


export default class Home extends React.Component {

  render() {
    return (
      <Block flex center style={styles.home}>
        <Waiting_Driver_Screen/>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,    
  },
  search: {
    height: 48,
    width: width - 32,
    marginHorizontal: 16,
    borderWidth: 1,
    borderRadius: 3,
  },
  header: {
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    elevation: 4,
    zIndex: 2,
  },
  tabs: {
    marginBottom: 24,
    marginTop: 10,
    elevation: 4,
  },
  tab: {
    backgroundColor: theme.COLORS.TRANSPARENT,
    width: width * 0.50,
    borderRadius: 0,
    borderWidth: 0,
    height: 24,
    elevation: 0,
  },
  tabTitle: {
    lineHeight: 19,
    fontWeight: '300'
  },
  divider: {
    borderRightWidth: 0.3,
    borderRightColor: theme.COLORS.MUTED,
  },
  products: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2,
  },
  map: {
    justifyContent: 'center',
    alignItems: 'center',
    height: height,
    width : width,
  },
});
