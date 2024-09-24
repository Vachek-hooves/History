import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HistoryProvider} from './store/storeContext';
import {
  ArticleDetailScreen,
  HistoryGameScreen,
  HistoryIntroductionScreen,
  HistoryMapScreen,
  LevelScren,
  LibraryArticles,
  QuizScreen,
} from './screen';
import CityHaractersScreen from './screen/CityHaractersScreen';
import {ArticleIcon, QuizIcon, UserIcon} from './components/ui/tabBtn';
import {Color} from './colors/color';
import {AppState, TouchableOpacity, Vibration, Dimensions} from 'react-native';
import {
  playBackgroundMusic,
  resetPlayer,
} from './components/ui/speaker/setupPlayer';
import SpeakerControl from './components/ui/speaker/SpeakerControl';

const {height} = Dimensions.get('window');

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        title: '',
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 10,
          left: 10,
          right: 10,
          elevation: 0,
          borderRadius: 40,
          height: 80,
          paddingTop: height > 670 ? 35 : 10,
          backgroundColor: Color.deepBlue,
          overflow: 'hidden', // This is important for the BlurView
          borderTopWidth: 0,
        },
      }}>
      <Tab.Screen
        name="HistoryGameScreen"
        component={HistoryGameScreen}
        options={{tabBarIcon: ({focused}) => <QuizIcon focused={focused} />}}
      />
      <Tab.Screen
        name="userScreen"
        component={CityHaractersScreen}
        options={{tabBarIcon: ({focused}) => <UserIcon focused={focused} />}}
      />
      <Tab.Screen
        name="libraryArticles"
        component={LibraryArticles}
        options={{tabBarIcon: ({focused}) => <ArticleIcon focused={focused} />}}
      />
      <Tab.Screen
        name="Speaker"
        component={SpeakerControl}
        options={{
          tabBarIcon: () => <SpeakerControl />,
          tabBarButton: props => (
            <TouchableOpacity {...props} onPress={() => {}} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

function App() {
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  useEffect(() => {
    const initializePlayer = async () => {
      try {
        await playBackgroundMusic();
        setIsPlayerReady(true);
      } catch (error) {
        console.error('Error initializing player:', error);
        setIsPlayerReady(true); // Set to true even if there's an error, so the app can render
      }
    };

    initializePlayer();

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        resetPlayer();
      } else if (nextAppState === 'active') {
        playBackgroundMusic();
      }
    });

    return () => {
      subscription.remove();
      resetPlayer();
    };
  }, []);

  if (!isPlayerReady) {
    // You might want to show a loading screen here
    return null;
  }

  return (
    <HistoryProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'simple_push',
            animationDuration: 1000,
          }}>
          <Stack.Screen
            name="HistoryIntroductionScreen"
            component={HistoryIntroductionScreen}
          />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen name="HistoryMapScreen" component={HistoryMapScreen} />
          <Stack.Screen name="LevelScreen" component={LevelScren} />
          <Stack.Screen name="QuizScreen" component={QuizScreen} />
          <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </HistoryProvider>
  );
}

export default App;
