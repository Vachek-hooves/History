import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {HistoryProvider} from './store/storeContext';
import {
  HistoryIntroductionScreen,
  HistoryMapScreen,
  LevelScren,
} from './screen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return <Tab.Navigator></Tab.Navigator>;
};

function App() {
  return (
    <HistoryProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="HistoryMapScreen" component={HistoryMapScreen} />
          <Stack.Screen
            name="IntroductionScreen"
            component={HistoryIntroductionScreen}
          />
          <Stack.Screen name="TabNavigator" component={TabNavigator} />
          <Stack.Screen name="LevelScreen" component={LevelScren} />
        </Stack.Navigator>
      </NavigationContainer>
    </HistoryProvider>
  );
}

export default App;
