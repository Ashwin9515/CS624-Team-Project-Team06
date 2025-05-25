import { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useTasks } from '../../context/TaskContext';
import { router } from 'expo-router';

export default function AddTaskScreen() {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');

  const handleSave = () => {
    if (!title || !subject || !dueDate || !priority) {
      Alert.alert('Please fill all fields');
      return;
    }
    addTask({ id: Date.now().toString(), title, subject, dueDate, priority });
    Alert.alert('Task Added!');
    router.replace('/tasks');
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={{ marginBottom: 10 }} />
      <TextInput placeholder="Subject" value={subject} onChangeText={setSubject} style={{ marginBottom: 10 }} />
      <TextInput placeholder="Due Date (YYYY-MM-DD)" value={dueDate} onChangeText={setDueDate} style={{ marginBottom: 10 }} />
      <TextInput placeholder="Priority" value={priority} onChangeText={setPriority} style={{ marginBottom: 10 }} />
      <Button title="Save Task" onPress={handleSave} />
    </View>
  );
}