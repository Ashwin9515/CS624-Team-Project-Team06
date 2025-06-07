import React from 'react';
import { ImageBackground, View, StyleSheet } from 'react-native';

export default function ScreenLayout({ children }: { children: React.ReactNode }) {
  return (
    <ImageBackground
      source={require('../assets/studysync.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {children}
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
});
