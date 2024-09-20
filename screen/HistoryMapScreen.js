import React, {useState, forwardRef} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  SafeAreaView,
} from 'react-native';
import MapView from 'react-native-maps';
import {Color} from '../colors/color';

const initialRegion = {
  latitude: -43.53205162938437,
  longitude: 172.6360443730743,
  latitudeDelta: 0.0362,
  longitudeDelta: 0.0361,
};

const HistoryMapScreen = forwardRef((props, ref) => {
  const [region, setRegion] = useState(initialRegion);

  const zoomIn = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta / 2,
      longitudeDelta: region.longitudeDelta / 2,
    });
  };

  const zoomOut = () => {
    setRegion({
      ...region,
      latitudeDelta: region.latitudeDelta * 1.1,
      longitudeDelta: region.longitudeDelta * 1.1,
    });
  };

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <MapView
          ref={ref}
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={zoomIn}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={zoomOut}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
});

export default HistoryMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: Color.lightGreen + 90,
  },
  map: {
    width: '100%',
    height: '80%', // 80% height for the map
    borderRadius: 24,
  },
  buttonContainer: {
    position: 'absolute',
    // top: 10,
    // right: 10,
    flexDirection: 'column',
    bottom: 10,
    gap: 10,
  },
  button: {
    backgroundColor: Color.gold,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
  },
});
