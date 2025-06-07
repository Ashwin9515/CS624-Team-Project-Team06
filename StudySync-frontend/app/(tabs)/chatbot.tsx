import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Button,
  ImageBackground,
} from 'react-native';
import axios from 'axios';

export default function Chatbot() {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const res = await axios.post(`${process.env.EXPO_PUBLIC_API}/chat`, { prompt: input });
      const botMessage = { role: 'bot', content: res.data.response };
      setMessages(prev => [...prev, botMessage]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', content: '⚠️ Error connecting to server.' }]);
    }
  };

  return (
    <ImageBackground source={require('../../assets/studysync.png')} style={styles.bg}>
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={styles.messages} contentContainerStyle={{ paddingBottom: 12 }}>
          {messages.map((m, i) => (
            <View
              key={i}
              style={[styles.bubble, m.role === 'user' ? styles.user : styles.bot]}
            >
              <Text style={styles.text}>{m.content}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.inputRow}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Ask anything..."
            placeholderTextColor="#ccc"
            style={styles.input}
          />
          <Button title="Send" onPress={handleSend} />
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  container: { flex: 1, padding: 16 },
  messages: { flex: 1, marginBottom: 12 },
  bubble: {
    padding: 12,
    borderRadius: 12,
    marginVertical: 4,
    maxWidth: '80%',
  },
  user: {
    backgroundColor: '#34D399',
    alignSelf: 'flex-end',
  },
  bot: {
    backgroundColor: '#E5E7EB',
    alignSelf: 'flex-start',
  },
  text: { fontSize: 16, color: '#111827' },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
  },
});
