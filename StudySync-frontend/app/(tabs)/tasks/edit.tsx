import React, { useEffect, useState } from 'react';
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
import { useLocalSearchParams, router } from 'expo-router';
import API from '../../../utils/api';
import {
  enqueueTask,
  enqueueDelete,
  flushOfflineQueue,
  isOffline,
} from '../../../utils/appUtils';

export default function EditTask() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [priority, setPriority] = useState('Medium');
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    try {
      const res = await API.get(`/tasks`);
      const task = res.data.find((t: any) => t._id === id);
      if (!task) {
        Alert.alert('Error', 'Task not found');
        router.replace('/tasks');
        return;
      }
      setTitle(task.title);
      setDescription(task.description || '');
      setDueDate(new Date(task.dueDate));
      setPriority(task.priority || 'Medium');
      setLoading(false);
    } catch (err) {
      Alert.alert('Error', 'Failed to load task');
      router.replace('/tasks');
    }
  };

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert('Validation', 'Title is required.');
      return;
    }

    const payload = { title, description, dueDate, priority };
    const offline = await isOffline();

    try {
      if (offline) {
        await enqueueTask({ ...payload, _id: id, offlineAction: 'update' });
        Alert.alert('Saved Offline', 'Task will sync when online');
      } else {
        await API.put(`/tasks/${id}`, payload);
        await flushOfflineQueue();
        Alert.alert('Updated', 'Task updated successfully');
      }
      router.replace('/tasks');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.error || 'Failed to update task');
    }
  };

  const handleDelete = async () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this task?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const offline = await isOffline();
            if (offline) {
              await enqueueDelete(id as string);
              Alert.alert('Deleted Offline', 'Task will be removed when online');
            } else {
              await API.delete(`/tasks/${id}`);
              await flushOfflineQueue();
              Alert.alert('Deleted', 'Task deleted');
            }
            router.replace('/tasks');
          } catch {
            Alert.alert('Error', 'Failed to delete task');
          }
        },
      },
    ]);
  };

  if (loading) return null;

  return (
    <ImageBackground source={require('../../../assets/tasks.png')} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.heading}>Edit Task</Text>

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
            onChange={(_, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDueDate(selectedDate);
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

        <TouchableOpacity onPress={handleUpdate} style={styles.button}>
          <Text style={styles.buttonText}>Update Task</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.buttonText}>Delete Task</Text>
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
    marginTop: 16,
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    padding: 14,
    borderRadius: 10,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
