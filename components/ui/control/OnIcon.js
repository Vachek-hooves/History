import {StyleSheet, Text, View, Image} from 'react-native';
import {Color} from '../../../colors/color';

const OnIcon = () => {
  return (
    <View
      style={{
        // backgroundColor: focused ? Color.deepGreen : Color.lightBlue,
        padding: 12,
        borderRadius: 30,
      }}>
      <Image
        source={require('../../../assets/icon/on.png')}
        style={{
          width: 30,
          height: 30,
          // tintColor: focused ? Color.gold : Color.white,
        }}
      />
    </View>
  );
};

export default OnIcon;

const styles = StyleSheet.create({});
