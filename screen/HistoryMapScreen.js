import React, {useState, forwardRef, useRef} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
  SafeAreaView,
  FlatList,
  Image,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {Color} from '../colors/color';
import {useHistoryContext} from '../store/storeContext';
import {useNavigation} from '@react-navigation/native';
import {CITY_ICON} from '../data/cityIconData';

const initialRegion = {
  latitude: -43.53205162938437,
  longitude: 172.6360443730743,
  latitudeDelta: 0.0362,
  longitudeDelta: 0.0361,
};

const HistoryMapScreen = forwardRef((props, ref) => {
  const [region, setRegion] = useState(initialRegion);
  const {gameData} = useHistoryContext();
  const navigation = useNavigation();
  const mapRef = useRef(null);

  const getIconForItem = itemId => {
    const iconData = CITY_ICON.find(icon => icon.id === itemId);
    return iconData ? iconData.icon : null;
  };

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

  const navigateToLocation = coordinates => {
    mapRef.current.animateToRegion(
      {
        ...coordinates,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      1000,
    );
  };

  const renderCard = ({item}) => (
    <TouchableOpacity
      style={[styles.card, item.isLocked && styles.lockedCard]}
      onPress={() => !item.isLocked && navigateToLocation(item.coordinates)}
      disabled={item.isLocked}>
      <Text style={styles.cardText}>{item.name}</Text>
      <Text style={styles.coordsText}>
        Lat: {item.coordinates.latitude.toFixed(4)}, Lon:{' '}
        {item.coordinates.longitude.toFixed(4)}
      </Text>
      <TouchableOpacity
        style={styles.levelButton}
        onPress={() =>
          !item.isLocked &&
          navigation.navigate('LevelScreen', {levelData: item})
        }
        disabled={item.isLocked}>
        <Text style={styles.levelButtonText}>
          {item.isLocked ? 'Locked' : 'Start Level'}
        </Text>
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
          language="en"
          mapType="standard"
          onRegionChangeComplete={setRegion}>
          {gameData.map(item => {
            const icon = getIconForItem(item.id);
            return (
              <Marker
                key={item.id}
                coordinate={item.coordinates}
                title={item.name}
                opacity={item.isLocked ? 0.5 : 1}>
                {icon && (
                  <Image
                    source={icon}
                    style={[
                      styles.markerIcon,
                      item.isLocked && styles.lockedMarkerIcon,
                    ]}
                  />
                )}
              </Marker>
            );
          })}
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
          keyExtractor={item => item.id}
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
    // backgroundColor: Color.lightGreen + 90,
    backgroundColor: Color.gold,
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
    // top: 100,
    right: 10,
    flexDirection: 'column',
    gap: 10,
    bottom: '50%',
  },
  button: {
    backgroundColor: Color.lightGreen,
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
    backgroundColor: Color.lightGreen,
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
  markerIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  lockedCard: {
    opacity: 0.5,
  },
  lockedMarkerIcon: {
    opacity: 0.7,
  },
});
