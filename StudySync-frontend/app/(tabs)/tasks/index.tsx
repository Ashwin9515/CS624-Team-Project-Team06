import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  RefreshControl,
  Text,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import API from '@/utils/api';
import TaskItem from '@/components/TaskItem';
import moment from 'moment';
import { Ionicons } from '@expo/vector-icons';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { date } = useLocalSearchParams(); // from calendar.tsx
  const router = useRouter();
  const isFocused = useIsFocused(); // NEW

  const fetchTasks = async () => {
    try {
      const res = await API.get('/tasks');
      setTasks(res.data);
      await AsyncStorage.setItem('cachedTasks', JSON.stringify(res.data));
    } catch (err) {
      console.warn('Network issue. Loading cached tasks...');
      const cached = await AsyncStorage.getItem('cachedTasks');
      if (cached) {
        setTasks(JSON.parse(cached));
        Alert.alert('Offline Mode', 'Showing cached tasks.');
      } else {
        Alert.alert('Error', 'Unable to fetch tasks or find cache.');
      }
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchTasks(); // refresh tasks when screen regains focus
    }
  }, [isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  const filteredTasks = date
    ? tasks.filter((task) => moment(task.dueDate).isSame(date as string, 'day'))
    : tasks;

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="p-4 space-y-3">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => <TaskItem key={task._id} task={task} />)
          ) : (
            <Text className="text-center text-gray-500 mt-4">
              {date
                ? `No tasks on ${moment(date as string).format('MMM D, YYYY')}`
                : 'No tasks found.'}
            </Text>
          )}
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-blue-500 p-4 rounded-full shadow-lg"
        onPress={() => router.push('/tasks/add')}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
