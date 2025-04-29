import React, {useEffect, useState, useRef} from 'react';
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
import {
  AppState,
  TouchableOpacity,
  Vibration,
  Dimensions,
  Animated,
  View,
} from 'react-native';
import {
  playBackgroundMusic,
  resetPlayer,
} from './components/ui/speaker/setupPlayer';
import SpeakerControl from './components/ui/speaker/SpeakerControl';

const {height} = Dimensions.get('window');

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const images = [
  require('./assets/newLoaders/Loader1.png'),
  require('./assets/newLoaders/Loader2.png'),
];

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
          paddingTop: height > 670 ? 10 : 10,
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
    </Tab.Navigator>
  );
};

function App() {
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
