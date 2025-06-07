import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Button,
  ImageBackground,
} from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';

export default function Tasks() {
  const { date } = useLocalSearchParams();
  const [tasks, setTasks] = useState([]);
  const [groupBy, setGroupBy] = useState<'status' | 'date'>('status');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${process.env.EXPO_PUBLIC_API}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    }
  };

  const markComplete = async (taskId: string) => {
    try {
      await axios.patch(`${process.env.EXPO_PUBLIC_API}/tasks/${taskId}`, {
        completed: true,
      });
      fetchTasks();
    } catch (err) {
      Alert.alert('Error', 'Failed to update task.');
    }
  };

  const renderStatusBadge = (task: any) => {
    if (task.completed)
      return <Text style={[styles.badge, styles.completed]}>✅ Completed</Text>;
    if (new Date(task.dueDate) < new Date())
      return <Text style={[styles.badge, styles.overdue]}>⚠️ Overdue</Text>;
    return <Text style={[styles.badge, styles.dueSoon]}>🕒 Due Soon</Text>;
  };

  const filterByDate = (list: any[]) => {
    if (!date) return list;
    return list.filter(
      (t) => new Date(t.dueDate).toISOString().split('T')[0] === date
    );
  };

  const filterBySearch = (list: any[]) => {
    if (!search.trim()) return list;
    return list.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
  };

  const groupByStatus = () => {
    const grouped = { Completed: [], Overdue: [], 'Due Soon': [] } as any;
    for (const task of filterBySearch(filterByDate(tasks))) {
      if (task.completed) grouped.Completed.push(task);
      else if (new Date(task.dueDate) < new Date()) grouped.Overdue.push(task);
      else grouped['Due Soon'].push(task);
    }
    return grouped;
  };

  const groupByDate = () => {
    const grouped = { Today: [], Upcoming: [], Past: [] } as any;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    for (const task of filterBySearch(filterByDate(tasks))) {
      const dueDateStr = new Date(task.dueDate).toISOString().split('T')[0];
      if (dueDateStr === todayStr) grouped.Today.push(task);
      else if (new Date(task.dueDate) > now) grouped.Upcoming.push(task);
      else grouped.Past.push(task);
    }
    return grouped;
  };

  const groupedTasks = groupBy === 'status' ? groupByStatus() : groupByDate();

  const renderGroup = (title: string, items: any[]) => (
    <View key={title} style={styles.group}>
      <Text style={styles.groupTitle}>{title}</Text>
      {items.map((item) => (
        <TouchableOpacity
          key={item._id}
          style={styles.taskItem}
          onPress={() =>
            !item.completed &&
            Alert.alert('Mark as complete?', item.title, [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Mark Complete', onPress: () => markComplete(item._id) },
            ])
          }
        >
          <View style={styles.taskRow}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            {renderStatusBadge(item)}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ImageBackground source={require('../../assets/studysync.png')} style={{ flex: 1 }}>
      <View style={styles.wrapper}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks..."
          placeholderTextColor="#ccc"
          value={search}
          onChangeText={setSearch}
        />

        <View style={styles.filters}>
          <Button
            title="Group by Status"
            onPress={() => setGroupBy('status')}
            color={groupBy === 'status' ? '#2563EB' : '#9CA3AF'}
          />
          <Button
            title="Group by Date"
            onPress={() => setGroupBy('date')}
            color={groupBy === 'date' ? '#2563EB' : '#9CA3AF'}
          />
        </View>

        <FlatList
          data={Object.keys(groupedTasks)}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => renderGroup(item, groupedTasks[item])}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  wrapper: { flex: 1, padding: 16 },
  searchInput: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  list: { paddingBottom: 80 },
  filters: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 12,
  },
  group: { marginBottom: 24 },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  taskItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ffffff30',
  },
  taskRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    color: '#fff',
    marginRight: 10,
  },
  badge: {
    fontSize: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: 'hidden',
    color: '#fff',
  },
  completed: { backgroundColor: '#10B981' },
  overdue: { backgroundColor: '#EF4444' },
  dueSoon: { backgroundColor: '#F59E0B' },
});
