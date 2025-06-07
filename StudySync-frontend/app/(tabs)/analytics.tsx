import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import axios from 'axios';

export default function Analytics() {
  const [stats, setStats] = useState<{ completed: number; weeklyCount: number; totalPomodoro: number } | null>(null);

  useEffect(() => {
    axios.get(`${process.env.EXPO_PUBLIC_API}/analytics`)
      .then(res => setStats(res.data))
      .catch(console.error);
  }, []);

  return (
    <ImageBackground source={require('../../assets/studysync.png')} style={styles.bg}>
      <View style={styles.overlay}>
        <Text style={styles.title}>📊 Study Analytics</Text>
        {stats && (
          <>
            <Text style={styles.stat}>✅ Tasks Completed: {stats.completed}</Text>
            <Text style={styles.stat}>📅 This Week: {stats.weeklyCount}</Text>
            <Text style={styles.stat}>⏱ Total Pomodoro: {stats.totalPomodoro} mins</Text>
          </>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { flex: 1, padding: 24 },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  stat: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 12,
  },
});
