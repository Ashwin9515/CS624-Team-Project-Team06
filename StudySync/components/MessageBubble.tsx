import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function MessageBubble({ message, sender }: { message: string; sender: 'user' | 'bot' }) {
  return (
    <View style={[styles.bubble, sender === 'user' ? styles.user : styles.bot]}>
      <Text>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    padding: 10,
    marginVertical: 4,
    borderRadius: 8,
    maxWidth: '75%'
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6'
  },
  bot: {
    alignSelf: 'flex-start',
    backgroundColor: '#eee'
  }
});