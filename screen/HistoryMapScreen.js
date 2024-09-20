import React, { useState, forwardRef, useRef } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  SafeAreaView,
  FlatList,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Color } from '../colors/color';
import { useHistoryContext } from '../store/storeContext';
import { useNavigation } from '@react-navigation/native';

const initialRegion = {
  latitude: -43.53205162938437,
  longitude: 172.6360443730743,
  latitudeDelta: 0.0362,
  longitudeDelta: 0.0361,
};

const HistoryMapScreen = forwardRef((props, ref) => {
  const [region, setRegion] = useState(initialRegion);
  const { gameData } = useHistoryContext();
  const navigation = useNavigation();
  const mapRef = useRef(null);

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

  const navigateToLocation = (coordinates) => {
    mapRef.current.animateToRegion({
      ...coordinates,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000);
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigateToLocation(item.coordinates)}
    >
      <Text style={styles.cardText}>{item.name}</Text>
      <Text style={styles.coordsText}>
        Lat: {item.coordinates.latitude.toFixed(4)}, Lon: {item.coordinates.longitude.toFixed(4)}
      </Text>
      <TouchableOpacity
        style={styles.levelButton}
        onPress={() => navigation.navigate('LevelScreen', { levelData: item })}
      >
        <Text style={styles.levelButtonText}>Start Level</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <MapView
          ref={mapRef}
          style={styles.map}
          region={region}
          onRegionChangeComplete={setRegion}
        >
          {gameData.map((item) => (
            <Marker
              key={item.id}
              coordinate={item.coordinates}
              title={item.name}
            />
          ))}
        </MapView>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={zoomIn}>
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={zoomOut}>
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={gameData}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          style={styles.cardList}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    </View>
  );
});

export default HistoryMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.lightGreen + 90,
  },
  safeArea: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '60%', // Reduced map height to accommodate the vertical list
    borderRadius: 24,
  },
  buttonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'column',
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
  cardList: {
    flex: 1,
    marginTop: 10,
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: Color.gold,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  coordsText: {
    color: 'white',
    fontSize: 12,
    marginBottom: 10,
  },
  levelButton: {
    backgroundColor: Color.darkGreen,
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
  },
  levelButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
