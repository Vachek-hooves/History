import React, { useState, forwardRef } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  SafeAreaView,
  FlatList,
} from 'react-native';
import MapView from 'react-native-maps';
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

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('LevelScreen', { levelData: item })}
    >
      <Text style={styles.cardText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
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
  },
});
