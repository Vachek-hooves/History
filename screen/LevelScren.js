import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Image,
} from 'react-native';
import {Color} from '../colors/color';
// import Icon from 'react-native-vector-icons/FontAwesome'; // Assuming you're using this icon library

const LevelScreen = ({route, navigation}) => {
  const {levelData} = route.params;

  const startQuiz = difficulty => {
    navigation.navigate('QuizScreen', {levelData, difficulty});
  };

  return (
    <ImageBackground
      source={require('../assets/cardBG/church.jpg')}
      blurRadius={4}
      style={styles.background}>
      <View style={styles.container}>
        <Text style={styles.header}>Chronicles of Time</Text>

        <View style={styles.guideContainer}>
          <Image
            source={require('../assets/cardBG/James.png')}
            style={styles.avatar}
          />
          <Text style={styles.guideName}>James Bartlett</Text>
        </View>

        <ScrollView style={styles.storyContainer}>
          <Text style={styles.storyText}>{levelData.story}</Text>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.easyButton]}
            onPress={() => startQuiz('easy')}>
            {/* <Icon name="star-o" size={20} color="white" /> */}
            <Text style={styles.buttonText}>Easy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.hardButton]}
            onPress={() => startQuiz('hard')}>
            {/* <Icon name="star" size={20} color="white" /> */}
            <Text style={styles.buttonText}>Hard</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    padding: 20,
    // backgroundColor: 'rgba(255,255,255,0.7)',
    paddingTop: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Color.darkGreen,
    textAlign: 'center',
    marginBottom: 20,
  },
  guideContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  guideName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.darkGreen,
  },
  storyContainer: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  storyText: {
    fontSize: 16,
    color: Color.darkGreen,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 25,
    width: '45%',
  },
  easyButton: {
    backgroundColor: Color.gold,
  },
  hardButton: {
    backgroundColor: Color.darkGreen,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginLeft: 10,
  },
});

export default LevelScreen;
