import { useState } from 'react';
import { View, TextInput, FlatList, TouchableOpacity, Text, StyleSheet } from 'react-native';
import MessageBubble from '../../components/MessageBubble';

function chatbotRules(input: string): string {
  const msg = input.toLowerCase();
  if (msg.includes('study') || msg.includes('start')) {
    return "Try starting with your toughest subject first and use the Pomodoro technique!";
  }
  if (msg.includes('motivation')) {
    return "You're doing great! Remember, consistent small efforts lead to big success.";
  }
  if (msg.includes('task') || msg.includes('add')) {
    return "To add a task, go to the Tasks tab and press the '+' button.";
  }
  if (msg.includes('break') || msg.includes('rest')) {
    return "Short breaks boost productivity. Take 5 minutes every 25 minutes of study.";
  }
  if (msg.includes('exam') || msg.includes('test')) {
    return "Plan early. Break topics into chunks and review them regularly.";
  }
  if (msg.includes('time') || msg.includes('manage')) {
    return "Schedule your day the night before. Block time for studying and breaks.";
  }
  if (msg.includes('reminder')) {
    return "You can add a task with a due date, and use your device's calendar for reminders.";
  }
  return "I'm here to help you stay on track. Ask me about study tips, task planning, or motivation!";
}

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<{ id: string; text: string; sender: 'user' | 'bot' }[]>([]);
  const [userInput, setUserInput] = useState('');

  const handleSend = () => {
    if (!userInput.trim()) return;
    const userMsg = { id: Date.now().toString(), text: userInput, sender: 'user' };
    const botMsg = { id: (Date.now() + 1).toString(), text: chatbotRules(userInput), sender: 'bot' };
    setMessages(prev => [...prev, userMsg, botMsg]);
    setUserInput('');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageBubble message={item.text} sender={item.sender} />}
        contentContainerStyle={{ paddingBottom: 10 }}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Ask StudyBot anything..."
        />
        <TouchableOpacity onPress={handleSend} style={styles.button}>
          <Text style={{ color: '#fff' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  inputRow: { flexDirection: 'row', marginTop: 10 },
  input: { flex: 1, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingHorizontal: 10 },
  button: { marginLeft: 8, backgroundColor: '#007AFF', padding: 10, borderRadius: 5 },
});