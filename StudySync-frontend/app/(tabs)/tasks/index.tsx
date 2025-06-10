import React, { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl, Text, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '@/utils/api';
import TaskItem from '@/components/TaskItem';
import moment from 'moment';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { date } = useLocalSearchParams(); // from calendar.tsx

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
    fetchTasks();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  const filteredTasks = date
    ? tasks.filter((task) =>
        moment(task.dueDate).isSame(date as string, 'day')
      )
    : tasks;

  return (
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
            {date ? `No tasks on ${moment(date as string).format('MMM D, YYYY')}` : 'No tasks found.'}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
