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
    padding: 14,
    backgroundColor: '#FCE4EC',
    borderRadius: 10,
    marginVertical: 6,
    borderLeftWidth: 5,
    borderLeftColor: '#EC407A',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#880E4F'
  },
  details: {
    fontSize: 14,
    color: '#6A1B9A',
    marginTop: 4
  }
});