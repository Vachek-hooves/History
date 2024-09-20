import {Image, StyleSheet, Text, View} from 'react-native';
const CorrectIcon = () => {
  return (
    <Image
      source={require('../../../assets/icon/correct.png')}
      style={{width: 30, height: 30}}
    />
  );
};

export default CorrectIcon;

const styles = StyleSheet.create({});
