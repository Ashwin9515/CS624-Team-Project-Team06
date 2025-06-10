import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { clearToken } from '../../utils/auth';
import axios from 'axios';
import { flushOfflineQueue } from '../../utils/appUtils'; // ✅ NEW

export default function Home() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [completed, setCompleted] = useState(0);
  const [pomodoroSessions, setPomodoroSessions] = useState(0);

  useEffect(() => {
    const loadUserData = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      if (storedName) setName(storedName);

      try {
        const res = await axios.get(`${process.env.EXPO_PUBLIC_API}/analytics`);
        setCompleted(res.data.completed || 0);
        setPomodoroSessions(res.data.totalPomodoro || 0);
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      }

      // ✅ Flush offline task queue on load
      await flushOfflineQueue();
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    await clearToken();
    router.replace('/');
  };

  return (
    <ImageBackground
      source={require('../../assets/studysync.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.logo}>📘 StudySync</Text>
        <Text style={styles.greeting}>Hello, {name || 'Learner'} 👋</Text>

        <Text style={styles.stats}>✅ Tasks Completed: {completed}</Text>
        <Text style={styles.stats}>⏱ Pomodoro Minutes: {pomodoroSessions}</Text>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/analytics')}>
          <Text style={styles.buttonText}>📊 Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/tasks')}>
          <Text style={styles.buttonText}>✅ Tasks</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/calendar')}>
          <Text style={styles.buttonText}>📅 Calendar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/pomodoro')}>
          <Text style={styles.buttonText}>⏱ Pomodoro</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/chatbot')}>
          <Text style={styles.buttonText}>🤖 Chat with StudyBot</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/settings')}>
          <Text style={styles.buttonText}>⚙️ Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 12,
  },
  logo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  greeting: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 4,
  },
  stats: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 6,
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    minWidth: 220,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
