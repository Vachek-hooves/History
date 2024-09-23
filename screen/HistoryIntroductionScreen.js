import React, {useRef, useEffect, useState} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {IntroLayout} from '../components/layout';

const HistoryIntroductionScreen = ({navigation}) => {
  const animation = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => navigation.navigate('TabNavigator'));
  }, [animation]);

  return (
    <IntroLayout>
      <Text>Your exploration begins now!</Text>
    </IntroLayout>
  );
};

export default HistoryIntroductionScreen;

const styles = StyleSheet.create({});
