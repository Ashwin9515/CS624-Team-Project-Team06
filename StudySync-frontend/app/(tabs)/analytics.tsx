import { View, Text, StyleSheet, ImageBackground } from 'react-native';
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
    axios
      .get(`${process.env.EXPO_PUBLIC_API}/analytics`)
      .then(res => setStats(res.data))
      .catch(err => console.error('Failed to load analytics:', err));
  }, []);

  return (
    <ImageBackground
      source={require('../../assets/studysync-bg.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.title}>📊 Study Analytics</Text>
        {stats ? (
          <>
            <Text style={styles.statText}>✅ Tasks Completed: {stats.completed}</Text>
            <Text style={styles.statText}>📅 Tasks This Week: {stats.weeklyCount}</Text>
            <Text style={styles.statText}>⏱️ Total Pomodoro Time: {stats.totalPomodoro} mins</Text>
          </>
        ) : (
          <Text style={styles.statText}>Loading...</Text>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#1E3A8A',
  },
  statText: {
    fontSize: 18,
    marginBottom: 12,
    color: '#111827',
    textAlign: 'center',
  },
});
