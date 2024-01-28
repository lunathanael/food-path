import React, {useState, useEffect} from 'react';
import { StyleSheet, Dimensions, ScrollView, View, Button } from 'react-native';
import { Block, Text, Input, theme } from 'galio-framework';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
const { height, width } = Dimensions.get('screen');

import * as Location from "expo-location";

//import PathRouting from '../components/PathRouting'

const PathRouting = (db, username) => (
  // let p;
  // get(child(db, `users/${username}/food_plan/path`)).then((snapshot) => {
  //   if (snapshot.exists()) {
  //     return (snapshot.val());
  //   } else {
  //     console.log("No data available");
  //   }
  // }).catch((error) => {
  //   console.error(error);
  // });
  
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
const mapCustomStyle = [ 
  { "elementType": "geometry", "stylers": [ { "color": "#242f3e" } ] }, 
  { "elementType": "elements", "stylers": [ { "color": "#242f3e" } ] }, 
  { "elementType": "labels.text.fill", "stylers": [ { "color": "#746855", "visibility": "off"  } ] }, 
  { "elementType": "labels.text.stroke", "stylers": [ { "color": "#242f3e", "visibility": "off"  } ] }, 
  { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [ { "color": "#d59563", "visibility": "off"  } ] }, 
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [ { "color": "#d59563", "visibility": "off" } ] }, 
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [ { "color": "#263c3f", "visibility": "off" } ] }, 
  { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [ { "color": "#6b9a76", "visibility": "off" } ] }, 
  { "featureType": "poi.school", "elementType": "labels.text.fill", "stylers": [ { "color": "#6b9a76", "visibility": "off" } ] }, 
  { "featureType": "poi.school", "elementType": "geometry", "stylers": [ { "color": "#263c3f", "visibility": "off" } ] }, 
  { "featureType": "road", "elementType": "geometry", "stylers": [ { "color": "#38414e" } ] }, 
  { "featureType": "road", "elementType": "geometry.stroke", "stylers": [ { "color": "#212a37" } ] }, 
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [ { "color": "#9ca5b3" } ] }, 
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [ { "color": "#746855" } ] }, 
  { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [ { "color": "#1f2835" } ] }, 
  { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [ { "color": "#f3d19c" } ] }, 
  { "featureType": "transit", "elementType": "geometry", "stylers": [ { "color": "#2f3948", "visibility": "off"  } ] }, 
  { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [ { "color": "#d59563", "visibility": "off"  } ] }, 
  { "featureType": "water", "elementType": "geometry", "stylers": [ { "color": "#17263c" } ] }, 
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [ { "color": "#515c6d" } ] }, 
  { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [ { "color": "#17263c" } ] } 
];

const Waiting_Driver_Screen = ({db, username}) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [initialRegion, setInitialRegion] = useState(null);

  useEffect(() => {

    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      let routingInfo = PathRouting(db, username);


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


export default Home = ({route}) => {
  const db = route.params.db;
  const username = route.params.username;
  return (
    <Block flex center style={styles.home}>
      <Waiting_Driver_Screen db={db} username={username}/>
    </Block>
  );
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
