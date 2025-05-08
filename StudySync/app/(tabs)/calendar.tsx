import { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTasks } from '../../context/TaskContext';
import TaskCard from '../../components/TaskCard';

export default function CalendarScreen() {
  const { tasks } = useTasks();
  const [selectedDate, setSelectedDate] = useState('');

  const filteredTasks = tasks.filter(task => task.dueDate === selectedDate);

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={{ [selectedDate]: { selected: true, marked: true, selectedColor: '#03A9F4' } }}
        style={styles.calendar}
      />
      <Text style={styles.header}>Tasks on {selectedDate || '...'}</Text>
      {filteredTasks.length === 0 ? (
        <Text style={{ marginTop: 20 }}>No tasks for this date.</Text>
      ) : (
        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TaskCard task={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  calendar: { marginBottom: 20 },
  header: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 }
});