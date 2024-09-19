import {useState, useEffect, useContext, createContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GameData} from '../data/data';

export const HistoryContext = createContext({});

export const HistoryProvider = ({children}) => {
  const [gameData, setGameData] = useState(GameData);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [userProgress, setUserProgress] = useState({});

  useEffect(() => {
    // Load user progress from AsyncStorage when the component mounts
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem('userProgress');
      if (savedProgress !== null) {
        setUserProgress(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const saveProgress = async (newProgress) => {
    try {
      await AsyncStorage.setItem('userProgress', JSON.stringify(newProgress));
      setUserProgress(newProgress);
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const value = {
    gameData,
    currentLevel,
    setCurrentLevel,
    userProgress,
    saveProgress,
  };

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
};

export const useHistoryContext = () => {
  const historyContext = useContext(HistoryContext);
  if (!historyContext) {
    throw new Error('useHistoryContext must be used within a HistoryProvider');
  }
  return historyContext;
};
