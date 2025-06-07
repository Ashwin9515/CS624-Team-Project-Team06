import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

export default function Home() {
  return (
    <ImageBackground
      source={require('../../assets/studysync.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>📚 Welcome to StudySync</Text>
        <Text style={styles.subtitle}>Plan. Focus. Succeed.</Text>

        {/* TODO: Add summary tiles, quick access buttons, task preview, etc. */}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#374151',
  },
});
