import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ImageBackground,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import API from '../../../utils/api';
import {
  enqueueTask,
  flushOfflineQueue,
} from '../../../utils/appUtils';

export default function AddTask() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priority, setPriority] = useState('Medium');
  const [aiPrompt, setAiPrompt] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  const handleAISuggestion = async () => {
    if (!aiPrompt.trim()) return;

    try {
      setLoadingAI(true);
      const res = await API.post('/chat', { prompt: aiPrompt });

      let parsed;
      try {
        parsed = JSON.parse(res.data.response);
      } catch {
        throw new Error('AI response could not be parsed. Make sure it is valid JSON.');
      }

      setTitle(parsed.title || '');
      setDescription(parsed.description || '');
      if (parsed.dueDate) {
        const parsedDate = new Date(parsed.dueDate);
        if (!isNaN(parsedDate.getTime())) setDueDate(parsedDate);
      }
      if (['Low', 'Medium', 'High'].includes(parsed.priority)) {
        setPriority(parsed.priority);
      }
    } catch (err) {
      Alert.alert('AI Suggestion Error', err.message || 'Failed to fetch suggestions.');
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Title is required.');
      return;
    }

    const task = { title, description, dueDate, priority };

    try {
      await API.post('/tasks', task);
      await flushOfflineQueue();
      Alert.alert('Success', 'Task created');
      router.replace('/tasks');
    } catch (err: any) {
      if (!err.response) {
        await enqueueTask(task);
        Alert.alert('Offline', 'Task saved locally and will sync when online.');
        router.replace('/tasks');
      } else {
        Alert.alert('Error', err.response?.data?.error || 'Failed to add task.');
      }
    }
  };

  return (
    <ImageBackground source={require('../../../assets/tasks.png')} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.heading}>Add New Task</Text>

        <TextInput
          style={styles.input}
          placeholder="Describe task to AI (e.g., 'Submit assignment by Friday')"
          placeholderTextColor="#ccc"
          value={aiPrompt}
          onChangeText={setAiPrompt}
        />
        <TouchableOpacity
          onPress={handleAISuggestion}
          style={[styles.button, loadingAI && { opacity: 0.6 }]}
          disabled={loadingAI}
        >
          <Text style={styles.buttonText}>
            {loadingAI ? 'Generating...' : 'Suggest Task with AI'}
          </Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Title"
          placeholderTextColor="#ccc"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, { height: 80 }]}
          placeholder="Description"
          placeholderTextColor="#ccc"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <Text style={styles.dateText}>Due Date: {dueDate.toDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
          value={dueDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (event?.type === 'set' && selectedDate) {
              setDueDate(selectedDate);
            }
          }}
        />
      )}

        <View style={styles.priorityRow}>
          {['Low', 'Medium', 'High'].map((level) => (
            <TouchableOpacity
              key={level}
              style={[
                styles.priorityButton,
                priority === level && styles.selectedPriority,
              ]}
              onPress={() => setPriority(level)}
            >
              <Text style={styles.priorityText}>{level}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={handleSubmit} style={styles.button}>
          <Text style={styles.buttonText}>Create Task</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center', gap: 12 },
  heading: {
    fontSize: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ffffff30',
  },
  dateText: {
    color: '#fff',
    fontSize: 16,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  priorityRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 8,
  },
  priorityButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedPriority: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  priorityText: {
    color: '#fff',
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#10B981',
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
