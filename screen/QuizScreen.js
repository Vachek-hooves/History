import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { useHistoryContext } from '../store/storeContext';
import { Color } from '../colors/color';

const CircularProgress = ({ progress }) => {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [progress]);

  const rotation = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressBackground} />
      <Animated.View
        style={[
          styles.progressFill,
          {
            transform: [{ rotate: rotation }],
          },
        ]}
      />
      <View style={styles.progressCenter} />
      <Text style={styles.progressText}>{`${Math.round(progress * 100)}%`}</Text>
    </View>
  );
};

const QuizScreen = ({ route, navigation }) => {
  const { levelData, difficulty } = route.params;
  const { userProgress, saveProgress } = useHistoryContext();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const questions = difficulty === 'easy' ? levelData.easy : levelData.hard;

  useEffect(() => {
    if (currentQuestionIndex >= questions.length) {
      setShowResult(true);
      updateProgress();
    }
  }, [currentQuestionIndex]);

  const updateProgress = () => {
    const newProgress = {
      ...userProgress,
      [levelData.id]: {
        ...userProgress[levelData.id],
        [difficulty]: Math.max(userProgress[levelData.id]?.[difficulty] || 0, score),
      },
    };
    saveProgress(newProgress);
  };

  const handleAnswer = (answer) => {
    setSelectedAnswer(answer);
    setTimeout(() => {
      const isCorrect = difficulty === 'easy' 
        ? answer === questions[currentQuestionIndex].correctAnswer
        : answer === questions[currentQuestionIndex].correctAnswer;
      
      if (isCorrect) setScore(score + 1);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    }, 1000);
  };

  const renderQuestion = () => (
    <View style={styles.questionContainer}>
      <CircularProgress progress={(currentQuestionIndex + 1) / questions.length} />
      <Text style={styles.questionText}>{questions[currentQuestionIndex].question}</Text>
      {difficulty === 'easy' ? (
        questions[currentQuestionIndex].options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionButton,
              selectedAnswer === option && styles.selectedOption,
            ]}
            onPress={() => handleAnswer(option)}
            disabled={selectedAnswer !== null}
          >
            <Text style={styles.optionText}>{option}</Text>
          </TouchableOpacity>
        ))
      ) : (
        <View style={styles.trueFalseContainer}>
          <TouchableOpacity
            style={[
              styles.trueFalseButton,
              selectedAnswer === true && styles.selectedOption,
            ]}
            onPress={() => handleAnswer(true)}
            disabled={selectedAnswer !== null}
          >
            <Text style={styles.trueFalseText}>True</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.trueFalseButton,
              selectedAnswer === false && styles.selectedOption,
            ]}
            onPress={() => handleAnswer(false)}
            disabled={selectedAnswer !== null}
          >
            <Text style={styles.trueFalseText}>False</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderResult = () => (
    <View style={styles.resultContainer}>
      <Text style={styles.resultText}>Quiz Completed!</Text>
      <Text style={styles.scoreText}>Your Score: {score}/{questions.length}</Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Back to Level</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
      source={require('../assets/cardBG/church.jpg')}
      style={styles.background}
      blurRadius={5}
    >
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.headerText}>{levelData.name}</Text>
          <Text style={styles.difficultyText}>Difficulty: {difficulty}</Text>
          {!showResult ? (
            <>
              <Text style={styles.progressText}>
                Question {currentQuestionIndex + 1} of {questions.length}
              </Text>
              {renderQuestion()}
            </>
          ) : (
            renderResult()
          )}
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    padding:5
  },
  container: {
    flex: 1,
    padding: 20,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Color.deepBlue,
    textAlign: 'center',
    marginBottom: 10,
  },
  difficultyText: {
    fontSize: 18,
    color: Color.deepBlue,
    textAlign: 'center',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    color: Color.deepBlue,
    textAlign: 'center',
    marginBottom: 20,
  },
  questionContainer: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    color: Color.deepBlue,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: Color.lightBlue,
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: Color.gold,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  trueFalseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  trueFalseButton: {
    backgroundColor: Color.lightBlue,
    padding: 15,
    borderRadius: 10,
    width: '45%',
  },
  trueFalseText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  resultContainer: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Color.deepBlue,
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 20,
    color: Color.deepBlue,
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: Color.deepBlue,
    padding: 15,
    borderRadius: 10,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  progressContainer: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  progressBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 10,
    borderColor: Color.lightBlue,
    position: 'absolute',
  },
  progressFill: {
    width: 50,
    height: 100,
    borderRadius: 50,
    borderRightWidth: 10,
    borderRightColor: Color.gold,
    position: 'absolute',
    transform: [{ translateX: 50 }],
  },
  progressCenter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    position: 'absolute',
    top: 10,
    left: 10,
  },
  progressText: {
    position: 'absolute',
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.deepBlue,
    top: 38,
    left: 30,
  },
});

export default QuizScreen;
