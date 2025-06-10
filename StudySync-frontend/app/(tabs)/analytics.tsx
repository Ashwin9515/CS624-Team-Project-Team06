import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, ActivityIndicator, Alert } from 'react-native';
import API from '../../utils/api';

export default function Analytics() {
  const [stats, setStats] = useState<{
    completed: number;
    weeklyCount: number;
    totalPomodoro: number;
    messagesExchanged?: number;
    recentPrompt?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/analytics')
      .then(res => setStats(res.data))
      .catch(err => {
        console.error(err);
        Alert.alert('Error', 'Failed to load analytics.');
      })
      .finally(() => setLoading(false));
  }, []);

  const formatPomodoroTime = (total: number) => {
    const hrs = Math.floor(total / 60);
    const mins = total % 60;
    return `${hrs > 0 ? `${hrs}h ` : ''}${mins}m`;
  };

  return (
    <ImageBackground source={require('../../assets/studysync.png')} style={styles.bg}>
      <View style={styles.overlay}>
        <Text style={styles.title}>📊 Study Analytics</Text>

        {loading && <ActivityIndicator size="large" color="#fff" />}
        {!loading && stats && (
          <>
            <Text style={styles.stat}>✅ Tasks Completed: {stats.completed}</Text>
            <Text style={styles.stat}>📅 This Week: {stats.weeklyCount}</Text>
            <Text style={styles.stat}>⏱ Total Pomodoro: {formatPomodoroTime(stats.totalPomodoro)}</Text>
            {stats.messagesExchanged !== undefined && (
              <Text style={styles.stat}>💬 Chat Messages: {stats.messagesExchanged}</Text>
            )}
            {stats.recentPrompt && (
              <Text style={styles.recent}>
                🧠 Last Prompt: “{stats.recentPrompt.length > 40
                  ? stats.recentPrompt.slice(0, 40) + '...'
                  : stats.recentPrompt}”
              </Text>
            )}
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
  recent: {
    color: '#ccc',
    fontStyle: 'italic',
    fontSize: 14,
    marginTop: 8,
  },
});
