import { View, Text, Button, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📚 StudySync</Text>
      <Image source={require('../../assets/images/study.png')} style={styles.image} />
      <Button title="Go to Tasks" onPress={() => router.push('/tasks')} color="#4CAF50" />
      <Button title="Open Calendar" onPress={() => router.push('/calendar')} color="#03A9F4" />
      <Button title="Chat with StudyBot" onPress={() => router.push('/chatbot')} color="#FF4081" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#D84315',
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 30,
    borderRadius: 10,
  }
});