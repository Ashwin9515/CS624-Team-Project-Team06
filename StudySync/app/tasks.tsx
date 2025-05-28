import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import axios from 'axios';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get(`${process.env.EXPO_PUBLIC_API}/tasks`).then(res => setTasks(res.data));
  }, []);

  const renderStatus = (task) => {
    if (task.completed) return '✅ Completed';
    if (new Date(task.dueDate) < new Date()) return '⚠️ Overdue';
    return '🕒 Due Soon';
  };

  return (
    <FlatList
      data={tasks}
      keyExtractor={item => item._id}
      renderItem={({ item }) => (
        <View className="p-4 border-b">
          <Text className="font-bold">{item.title}</Text>
          <Text>{renderStatus(item)}</Text>
        </View>
      )}
    />
  );
}
