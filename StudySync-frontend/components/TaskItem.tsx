import { View, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import clsx from 'clsx';
import API from '@/utils/api';

const TaskItem = ({ task }) => {
  const router = useRouter();
  const [loadingAI, setLoadingAI] = useState(false);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  const handleAISuggest = async () => {
    setLoadingAI(true);
    try {
      const prompt = `Improve this task:\nTitle: ${task.title}\nDescription: ${task.description}\nDue Date: ${task.dueDate}\nPriority: ${task.priority}\nStatus: ${task.status}`;
      const res = await API.post('/chat', { prompt, relatedTask: task._id });

      const suggestion = JSON.parse(res.data.response);

      const updatedTask = {
        title: suggestion.title || task.title,
        description: suggestion.description || task.description,
        dueDate: suggestion.dueDate || task.dueDate,
        priority: suggestion.priority || task.priority,
        status: suggestion.status || task.status,
      };

      await API.put(`/tasks/${task._id}`, updatedTask);
      Alert.alert('Updated', 'Task updated with AI suggestion.');
      router.replace('/tasks'); // reload task list
    } catch (err) {
      Alert.alert('AI Error', 'Could not update task with AI suggestion.');
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <Pressable
      onPress={() => router.push(`/tasks/edit?id=${task._id}`)}
      className="bg-white/90 p-4 my-2 rounded-xl shadow"
    >
      <Text className="font-bold text-lg text-black">{task.title}</Text>
      {task.description ? (
        <Text className="text-gray-700 mt-1">{task.description}</Text>
      ) : null}

      <View className="flex-row justify-between items-center mt-2">
        <Text className="text-sm text-gray-500">
          Due: {new Date(task.dueDate).toLocaleDateString()}
        </Text>

        <Text
          className={clsx(
            'text-xs px-2 py-1 rounded-full font-semibold',
            getStatusStyle(task.status)
          )}
        >
          {task.status}
        </Text>
      </View>

      <Pressable
        onPress={handleAISuggest}
        className="mt-3 bg-purple-600 px-4 py-2 rounded-full self-start"
      >
        <Text className="text-white font-medium">
          {loadingAI ? 'Thinking...' : '🤖 Suggest'}
        </Text>
      </Pressable>
    </Pressable>
  );
};

export default TaskItem;
