import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {TabLaout} from '../components/layout';

const HistoryGameScreen = ({navigation}) => {
  return (
    <TabLaout>
      <TouchableOpacity onPress={() => navigation.navigate('HistoryMapScreen')}>
        <Text> Game</Text>
      </TouchableOpacity>
    </TabLaout>
  );
};

export default HistoryGameScreen;

const styles = StyleSheet.create({});
