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
  const [id, setItem] = useState(0);
  const animation = useRef(new Animated.Value(0)).current;

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

  useEffect(() => {
    fadeStart();
    const timeOut = setTimeout(() => {
      navigateToMenu();
    }, 6000);
    return () => clearTimeout(timeOut);
  }, []);

  const fadeStart = () => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => fadeFinish());
  };

  const fadeFinish = () => {
    Animated.timing(animation, {
      toValue: 0,
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      setItem(prevState => prevState + 1);
      fadeStart();
    });
  };
  const navigateToMenu = () => {
    setItem(2);
  };
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
          {id < 2 ? (
            <Stack.Screen name="Welcome" options={{headerShown: false}}>
              {() => (
                <View style={{flex: 1}}>
                  <Animated.Image
                    source={images[id]}
                    style={[
                      {width: '100%', flex: 1},
                      {opacity: animation},
                    ]}></Animated.Image>
                </View>
              )}
            </Stack.Screen>
          ) : (
            <Stack.Screen
              name="HistoryIntroductionScreen"
              component={HistoryIntroductionScreen}
            />
          )}
          {/* <Stack.Screen
            name="HistoryIntroductionScreen"
            component={HistoryIntroductionScreen}
          /> */}
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
