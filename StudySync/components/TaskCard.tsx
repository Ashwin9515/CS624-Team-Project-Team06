import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Task } from '../context/TaskContext';

export default function TaskCard({ task }: { task: Task }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{task.title}</Text>
      <Text style={styles.details}>{task.subject} • {task.dueDate} • {task.priority}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  }
});