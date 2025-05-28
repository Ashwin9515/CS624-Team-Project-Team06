import { View, Text } from 'react-native';

export default function TaskItem({ task }) {
  const getStatusColor = () => {
    if (task.completed) return 'bg-green-500';
    if (new Date(task.dueDate) < new Date()) return 'bg-red-500';
    return 'bg-yellow-400';
  };

  return (
    <View className="flex-row items-center space-x-3 p-4 border-b">
      <View className={`h-4 w-4 rounded-full ${getStatusColor()}`} />
      <Text>{task.title}</Text>
    </View>
  );
}
