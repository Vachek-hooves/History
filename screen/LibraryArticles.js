import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import {TabLaout} from '../components/layout';
// import LibraryCard from '../components/LibraryCard';
import {Library} from '../data/Library';
import {Color} from '../colors/color';

const LibraryArticles = ({navigation}) => {
  const handlePress = article => {
    navigation.navigate('ArticleDetail', {article});
  };

  return (
    <TabLaout>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {Library.map((article, index) => (
          <LibraryCard
            key={index}
            article={article}
            onPress={() => handlePress(article)}
          />
        ))}
      </ScrollView>
      <View style={{height: 100}}></View>
    </TabLaout>
  );
};

const LibraryCard = ({article, onPress}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={article.image} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.level}>Level: {article.level}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default LibraryArticles;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 200,
  },
  textContainer: {
    padding: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Color.deepBlue,
    marginBottom: 10,
  },
  level: {
    fontSize: 16,
    color: Color.deepBlue,
  },
});
