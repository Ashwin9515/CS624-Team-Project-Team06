import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  ImageBackground,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import API from '../../utils/api';
import moment from 'moment';

type ChatMessage = {
  role: 'user' | 'bot';
  message: string;
  timestamp?: string;
};

export default function Chatbot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await API.get('/chat/history');
      if (Array.isArray(res.data)) {
        setMessages(res.data);
      } else {
        console.error('Invalid chat history:', res.data);
        Alert.alert('Error', 'Invalid chat data received.');
      }
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: false }), 300);
    } catch (err) {
      console.error('Chat history error:', err);
      Alert.alert('Error', 'Failed to load chat history.');
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      message: input,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await API.post('/chat', { prompt: input });
      const botMessage: ChatMessage = {
        role: 'bot',
        message: res.data.response || '⚠️ No response received.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Chatbot Error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'bot',
          message: '⚠️ Failed to get response.',
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const clearChat = async () => {
  Alert.alert('Clear Chat', 'Are you sure you want to delete all messages?', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Clear',
      onPress: async () => {
        try {
          await API.delete('/chat/history');
          setMessages([]);
          await new Promise((r) => setTimeout(r, 200)); // wait briefly
          fetchHistory(); // recheck from backend
        } catch (err) {
          console.error('Clear chat error:', err);
          Alert.alert('Error', 'Could not clear chat.');
        }
      },
      style: 'destructive',
    },
  ]);
};


  const formatTime = (timestamp?: string) =>
    timestamp ? moment(timestamp).format('h:mm A') : '';

  return (
    <ImageBackground
      source={require('../../assets/chatbot-wallpaper.png')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Study Bot 🤖</Text>
        <TouchableOpacity onPress={clearChat}>
          <Ionicons name="trash" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.messages}
        contentContainerStyle={{ paddingBottom: 80 }}
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg, i) => (
          <View
            key={i}
            style={[
              styles.bubble,
              msg.role === 'user' ? styles.userBubble : styles.botBubble,
            ]}
          >
            <Text style={styles.text}>{msg.message}</Text>
            <Text style={styles.timestamp}>{formatTime(msg.timestamp)}</Text>
          </View>
        ))}
        {loading && (
          <View style={styles.botBubble}>
            <ActivityIndicator color="#fff" size="small" />
          </View>
        )}
      </ScrollView>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Ask something..."
          placeholderTextColor="#ccc"
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity onPress={sendMessage} disabled={loading} style={styles.sendBtn}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  messages: { flex: 1, padding: 16 },
  bubble: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 12,
    maxWidth: '80%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#3B82F6',
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#10B981',
  },
  text: {
    color: '#fff',
    fontSize: 14,
  },
  timestamp: {
    color: '#ccc',
    fontSize: 10,
    marginTop: 4,
    textAlign: 'right',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  input: {
    flex: 1,
    color: '#fff',
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    marginRight: 8,
  },
  sendBtn: {
    padding: 8,
  },
});
