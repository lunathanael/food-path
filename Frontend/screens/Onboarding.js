import React from 'react';
import { ImageBackground, StyleSheet, StatusBar, Dimensions } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';

const { height, width } = Dimensions.get('screen');

import materialTheme from '../constants/Theme';
import Images from '../constants/Images';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

let id = 0;

const DINING_HALLS_LOCATIONS = {
  'South Pointe at Case': [42.72453932922057, -84.48844707117367], "Sparty's Market": [42.72867352001793, -84.49440369630766], "The Edge at Akers": [42.72426284934323, -84.46473942700027], "Brody Square": [42.731472990618464, -84.49519192699452], "Holden Dining Hall": [42.721120608388475, -84.48858822885974], "Holmes Dining Hall": [42.72679464281192, -84.4645800270007], "The State Room at Kellogg": [42.73191102029839, -84.49316017118278], "Heritage Commons at Landon": [42.733953903515385, -84.48511974233824], "Thrive at Owen": [42.726750094109065, -84.47062737303804], "The Vista at Shaw": [42.72702766286321, -84.47526964233279], "The Gallery at Snyder Phillips": [42.73019974531501, -84.47278836932867]};

  

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
    console.log(this.state.markers);
    this.onMapPress = this.onMapPress.bind(this);
  }
    
  onMapPress(e) {
    this.setState({
      markers: [
        ...this.state.markers,
        {
          coordinate: e.nativeEvent.coordinate,
          key: `foo${id++}`,
        },
      ],
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
            onPress={this.onMapPress}>
              
            {this.state.markers.map((marker) => (
              <Marker
                title={marker.key}
                key={marker.key}
                coordinate={marker.coordinate}
              />
            ))}
          </MapView>
        </Block>
        <Block flex space="between" style={styles.padded}>
          <Block flex space="around" style={{ zIndex: 2 }}>
            <Block>
              <Block>
                <Text color="black" size={60}>Food Path</Text>
              </Block>
              <Text size={16} color='blue'>
                Automatically optimize your daily routes.
              </Text>
            </Block>
            <Block center>
              <Button
                shadowless
                style={styles.button}
                color={materialTheme.COLORS.BUTTON_COLOR}
                onPress={() => navigation.navigate('App')}>
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
    paddingHorizontal: theme.SIZES.BASE * 2,
    position: 'relative',
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
