import { View, Text, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';

export default function Analytics() {
  const [stats, setStats] = useState<{
    completed: number;
    weeklyCount: number;
    totalPomodoro: number;
  } | null>(null);

  useEffect(() => {
    axios.get(`${process.env.EXPO_PUBLIC_API}/analytics`)
      .then(res => setStats(res.data))
      .catch(err => console.error('Failed to load analytics:', err));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Study Analytics</Text>
      {stats && (
        <>
          <Text style={styles.statText}>✅ Tasks Completed: {stats.completed}</Text>
          <Text style={styles.statText}>📅 Tasks This Week: {stats.weeklyCount}</Text>
          <Text style={styles.statText}>⏱️ Total Pomodoro Time: {stats.totalPomodoro} mins</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statText: {
    fontSize: 16,
    marginBottom: 8,
  },
});
