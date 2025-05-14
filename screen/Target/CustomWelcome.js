import {ImageBackground, ActivityIndicator} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';

const CustomWelcome = props => {
  
  const navigation = useNavigation();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (props.onWelcomeComplete) {
        props.onWelcomeComplete();
      }
      // navigation.navigate('Drawer');
    }, 5000);
    return () => clearInterval(timer);
  }, [props.onWelcomeComplete]);
  return (
    <ImageBackground
      style={{width: '100%', height: '100%', justifyContent: 'center'}}
      // source={require('../assets/img/bg/bg.jpg')}
      source={require('../../assets/bg/bg.jpg')}>
      <ActivityIndicator color="gold" size="large" />
    </ImageBackground>
  );
};

export default CustomWelcome;
