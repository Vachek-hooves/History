import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Color} from '../colors/color';

const LevelScren = ({route, navigation}) => {
  const {levelData} = route.params;

  const startQuiz = difficulty => {
    // Navigate to the quiz screen with the selected difficulty
    navigation.navigate('QuizScreen', {levelData, difficulty});
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{levelData.name}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.easyButton]}
          onPress={() => startQuiz('easy')}>
          <Text style={styles.buttonText}>Easy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.hardButton]}
          onPress={() => startQuiz('hard')}>
          <Text style={styles.buttonText}>Hard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LevelScren;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.lightGreen + 90,

  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: Color.darkGreen,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
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
  },
});
