import React, {useState, forwardRef} from 'react';
import {StyleSheet, View, Dimensions, Button} from 'react-native';
import MapView from 'react-native-maps';

const initialRegion = {
  latitude: -43.53205162938437,
  longitude: 172.6360443730743,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
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
      latitudeDelta: region.latitudeDelta * 2,
      longitudeDelta: region.longitudeDelta * 2,
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={ref}
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
      />
      <View style={styles.buttonContainer}>
        <Button title="+" onPress={zoomIn} />
        <Button title="-" onPress={zoomOut} />
      </View>
    </View>
  );
});

export default HistoryMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  buttonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'column',
  },
});
