import React, { useState } from 'react';
import { View, TextInput, Button, Text, ScrollView } from 'react-native';
import axios from 'axios';

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    const userMessage = { role: 'user', content: input };
    const res = await axios.post(`${process.env.EXPO_PUBLIC_API}/chat`, { prompt: input });
    const botMessage = { role: 'bot', content: res.data.response };
    setMessages([...messages, userMessage, botMessage]);
    setInput('');
  };

  return (
    <View className="flex-1 p-4">
      <ScrollView>
        {messages.map((m, i) => (
          <Text key={i} className={m.role === 'bot' ? 'text-left' : 'text-right'}>
            {m.content}
          </Text>
        ))}
      </ScrollView>
      <TextInput value={input} onChangeText={setInput} placeholder="Ask me anything..." />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
}
