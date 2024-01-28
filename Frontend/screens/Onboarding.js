import React from 'react';
import { View, ImageBackground, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';

const { height, width } = Dimensions.get('screen');

import locationData from '../constants/locationData';

import materialTheme from '../constants/Theme';
import Images from '../constants/Images';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

let id = 0;

const DINING_HALLS_LOCATIONS = locationData.DINING_HALLS_LOCATIONS;

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
  

export default class Onboarding extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: 42.7229439975,
        longitude: -84.4792321495,
        latitudeDelta: 0.0422,
        longitudeDelta: 0.0221,
      },
      markers: [],
    };

    for (const hall in DINING_HALLS_LOCATIONS) {
      this.state.markers.push({'key' : hall, 'coordinate': {'latitude': DINING_HALLS_LOCATIONS[hall][0], 'longitude': DINING_HALLS_LOCATIONS[hall][1]}});
    }
    this.onMapPress = this.onMapPress.bind(this);
  }
    
  onMapPress(e) {
    this.setState({
    });
  }
  
  render() {
    const { navigation } = this.props;

    return (
      <Block flex style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Block flex center>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={this.state.region}
            customMapStyle={mapCustomStyle}
            onPress={this.onMapPress}>
              
            {this.state.markers.map((marker) => (
              <Marker
                title={marker.key}
                key={marker.key}
                coordinate={marker.coordinate}
                icon={require('../assets/icons/foodIcon.png')}
                onPress={() => {
                  console.log('callout pressed');
                }}>
              </Marker>
            ))}
          </MapView>
        </Block>
        <Block flex space="between" style={styles.padded}>
          <Block flex space="around" style={{ zIndex: 1 }}>
            <Block>
              <Block>
                <Text color="white" size={60}>Food Path</Text>
              </Block>
            </Block>
            <Block center>
              <Button
                shadowless
                style={styles.button}
                color={materialTheme.COLORS.BUTTON_COLOR}
                onPress={() => navigation.navigate('sign-in')}>
                GET STARTED
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "black",
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE*2,
    marginTop: 100,
    padding: 0,
    // position: 'relative',
    bottom: theme.SIZES.BASE,
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  map: {
    justifyContent: 'center',
    alignItems: 'center',
    height: height,
    width : width,
  },
});
