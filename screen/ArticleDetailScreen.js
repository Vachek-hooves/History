import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import {Color} from '../colors/color';
import {GoBack, GoBackMap} from '../components/ui/uiIcons';

const ArticleDetailScreen = ({route}) => {
  const {article} = route.params;

  return (
    <View style={styles.screen}>
      <View style={styles.imageContainer}>
        <Image source={article.image} style={styles.image} />
        <GoBack />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.content}>{article.content}</Text>
      </ScrollView>
    </View>
  );
};

export default ArticleDetailScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Color.lightGreen,
  },
  imageContainer: {
    position: 'relative',
  },
  container: {
    padding: 20,
    backgroundColor: Color.lightGreen,
  },
  image: {
    width: '100%',
    height: 260,
    borderRadius: 10,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Color.deepBlue,
    marginBottom: 20,
  },
  content: {
    fontSize: 16,
    color: Color.deepBlue,
    lineHeight: 24,
  },
});
