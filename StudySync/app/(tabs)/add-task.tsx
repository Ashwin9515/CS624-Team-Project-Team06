import { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

export default function AddTaskScreen() {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');

  const handleSave = () => {
    console.log({ title, subject, dueDate, priority });
  };

  return (
    <View style={{ padding: 16 }}>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={{ marginBottom: 10 }} />
      <TextInput placeholder="Subject" value={subject} onChangeText={setSubject} style={{ marginBottom: 10 }} />
      <TextInput placeholder="Due Date" value={dueDate} onChangeText={setDueDate} style={{ marginBottom: 10 }} />
      <TextInput placeholder="Priority" value={priority} onChangeText={setPriority} style={{ marginBottom: 10 }} />
      <Button title="Save Task" onPress={handleSave} />
    </View>
  );
}