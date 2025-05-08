import { View, Button, FlatList, Text } from 'react-native';
import { router, useFocusEffect } from 'expo-router';
import { useTasks } from '../../context/TaskContext';
import TaskCard from '../../components/TaskCard';
import { useCallback } from 'react';

export default function TasksScreen() {
  const { tasks } = useTasks();

  // Re-render when screen is focused to reflect latest task state
  useFocusEffect(
    useCallback(() => {
      // No-op, just triggers rerender on focus due to [tasks] dependency
    }, [tasks])
  );

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Button title="Add Task" onPress={() => router.push('/add-task')} />
      {tasks.length === 0 ? (
        <Text style={{ marginTop: 20 }}>No tasks added yet.</Text>
      ) : (
        <FlatList
          data={[...tasks].reverse()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TaskCard task={item} />}
        />
      )}
    </View>
  );
}
