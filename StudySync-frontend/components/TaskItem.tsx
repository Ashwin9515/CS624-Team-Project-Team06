import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import clsx from 'clsx';

const TaskItem = ({ task }) => {
  const router = useRouter();

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
    </Pressable>
  );
};

export default TaskItem;
