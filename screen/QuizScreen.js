import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Animated,
} from 'react-native';
import {useHistoryContext} from '../store/storeContext';
import {Color} from '../colors/color';
import {CorrectIcon, WrongIcon} from '../components/ui/quizIcons';
// import Icon from 'react-native-vector-icons/Ionicons';

const CircularProgress = ({progress}) => {
  const angle = progress * 360;

  return (
    <View style={styles.progressContainer}>
      <View style={styles.progressCircle}>
        {progress > 0 && (
          <View
            style={[
              styles.progressFill,
              {
                transform: [{rotateZ: `-90deg`}, {rotateY: '180deg'}],
                zIndex: 1,
              },
            ]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: Color.gold,
                  transform: [{rotateZ: `${angle}deg`}, {rotateY: '180deg'}],
                },
              ]}
            />
          </View>
        )}
        <View style={styles.progressInner} />
      </View>
      <Text style={styles.progressText}>{`${Math.round(
        progress * 100,
      )}%`}</Text>
    </View>
  );
};

const QuizScreen = ({route, navigation}) => {
  const {levelData, difficulty} = route.params;
  const {userProgress, saveProgress} = useHistoryContext();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [shakeAnimation] = useState(new Animated.Value(0));

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
        [difficulty]: Math.max(
          userProgress[levelData.id]?.[difficulty] || 0,
          score,
        ),
      },
    };
    saveProgress(newProgress);
  };

  const handleOptionPress = option => {
    setSelectedOption(option);
    const correct = option === questions[currentQuestionIndex].correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      // Correct answer logic
      setScore(score + 1);
      setTimeout(() => moveToNextQuestion(), 1000);
    } else {
      // Incorrect answer animation
      Animated.sequence([
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: -10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 10,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnimation, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setTimeout(() => moveToNextQuestion(), 1000);
      });
    }
  };

  const moveToNextQuestion = () => {
    setCurrentQuestionIndex(currentQuestionIndex + 1);
    setSelectedOption(null);
    setIsCorrect(null);
  };

  const renderQuestion = () => {
    if (currentQuestionIndex >= questions.length) {
      return null;
    }

    return (
      <View style={styles.questionContainer}>
        <CircularProgress
          progress={(currentQuestionIndex + 1) / questions.length}
        />
        <Animated.View
          style={[
            styles.questionContainer,
            {transform: [{translateX: shakeAnimation}]},
          ]}>
          <Text style={styles.questionText}>
            {questions[currentQuestionIndex].question}
          </Text>
        </Animated.View>
        <View style={styles.optionsContainer}>
          {questions[currentQuestionIndex].options.map(renderOption)}
        </View>
      </View>
    );
  };

  const renderOption = (option, index) => {
    const isSelected = selectedOption === option;
    const isCorrectOption =
      questions[currentQuestionIndex].correctAnswer === option;

    let optionStyle = styles.option;
    let textStyle = styles.optionText;

    if (isSelected) {
      if (isCorrect === true) {
        optionStyle = [styles.option, styles.correctOption];
        textStyle = [styles.optionText, styles.correctOptionText];
      } else if (isCorrect === false) {
        optionStyle = [styles.option, styles.incorrectOption];
        textStyle = [styles.optionText, styles.incorrectOptionText];
      }
    } else if (isCorrect === false && isCorrectOption) {
      optionStyle = [styles.option, styles.correctOption];
      textStyle = [styles.optionText, styles.correctOptionText];
    }

    return (
      <TouchableOpacity
        key={index}
        style={optionStyle}
        onPress={() => handleOptionPress(option)}
        disabled={selectedOption !== null}>
        <View
          style={[
            styles.optionGradient,
            isSelected ? styles.selectedOption : null,
          ]}>
          <Text style={textStyle}>{option}</Text>
          {isSelected && isCorrect && <CorrectIcon />}
          {isSelected && !isCorrect && <WrongIcon />}
        </View>
      </TouchableOpacity>
    );
  };

  const renderResult = () => (
    <View style={styles.resultContainer}>
      <Text style={styles.resultText}>Quiz Completed!</Text>
      <Text style={styles.scoreText}>
        Your Score: {score}/{questions.length}
      </Text>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>Back to Level</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ImageBackground
      source={require('../assets/cardBG/church.jpg')}
      style={styles.background}
      blurRadius={5}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.headerText}>{levelData.name}</Text>
          <Text style={styles.difficultyText}>Difficulty: {difficulty}</Text>
          {!showResult ? (
              <>
              {/* <Text style={styles.progressText}>
                Question {Math.min(currentQuestionIndex + 1, questions.length)}{' '}
                of {questions.length}
              </Text> */}
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
    padding: 5,
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
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    
  },
  questionText: {
    fontSize: 18,
    color: Color.deepBlue,
    marginBottom: 20,
    textAlign:'center',
    height:100
  },
  option: {
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: Color.lightBlue,
  },
  optionGradient: {
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F0F0F0',
  },
  selectedOption: {
    backgroundColor: '#FFD700',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: Color.deepBlue,
  },
  correctOption: {
    borderColor: Color.deepGreen,
    borderWidth: 2,
  },
  incorrectOption: {
    borderColor: Color.deepRed,
    borderWidth: 2,
  },
  correctOptionText: {
    color: Color.deepGreen,
  },
  incorrectOptionText: {
    color: Color.deepRed,
  },
  icon: {
    marginLeft: 10,
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
  progressCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Color.lightBlue,
    overflow: 'hidden',
  },
  progressFill: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    borderRadius: 50,
  },
  progressInner: {
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
