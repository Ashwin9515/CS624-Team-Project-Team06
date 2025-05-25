import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <ImageBackground
      source={require('../../assets/images/study.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <Text style={styles.logo}>📅 StudySync</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/calendar')}>
          <Text style={styles.buttonText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/tasks')}>
          <Text style={styles.buttonText}>Tasks</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.chatButton]} onPress={() => router.push('/chatbot')}>
          <Text style={styles.buttonText}>Chat with StudyBot</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 60,
  },
  logo: {
    position: 'absolute',
    top: 60,
    fontSize: 30,
    fontWeight: '900',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  buttonGroup: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '80%',
    backgroundColor: '#4DB6AC',
    paddingVertical: 14,
    borderRadius: 30,
    marginVertical: 10,
    alignItems: 'center',
  },
  chatButton: {
    backgroundColor: '#9575CD',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});