import { View, Text, Switch, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { clearToken } from '../../utils/auth';
import React from 'react';

export default function Settings() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [vibrationEnabled, setVibrationEnabled] = useState(false);
  const [longBreaksEnabled, setLongBreaksEnabled] = useState(false);
  const [workDuration, setWorkDuration] = useState('25');
  const [breakDuration, setBreakDuration] = useState('5');

  useEffect(() => {
    (async () => {
      const notifs = await AsyncStorage.getItem('notifications');
      const vibrate = await AsyncStorage.getItem('vibration');
      const longBreaks = await AsyncStorage.getItem('longBreaks');
      const work = await AsyncStorage.getItem('pomodoro-work');
      const brk = await AsyncStorage.getItem('pomodoro-break');

      if (notifs) setNotificationsEnabled(notifs === 'true');
      if (vibrate) setVibrationEnabled(vibrate === 'true');
      if (longBreaks) setLongBreaksEnabled(longBreaks === 'true');
      if (work) setWorkDuration(work);
      if (brk) setBreakDuration(brk);
    })();
  }, []);

  const toggle = async (key: string, value: boolean, setter: Function) => {
    setter(value);
    await AsyncStorage.setItem(key, value.toString());
  };

  const saveDurations = async () => {
    await AsyncStorage.setItem('pomodoro-work', workDuration);
    await AsyncStorage.setItem('pomodoro-break', breakDuration);
    Alert.alert('Saved', 'Pomodoro durations updated.');
  };

  const resetSessions = async () => {
    await AsyncStorage.setItem('pomodoroSessions', '0');
    Alert.alert('Reset', 'Pomodoro session count reset.');
  };

  const resetAnalytics = async () => {
    // Optional: implement additional keys here
    Alert.alert('Reset', 'Analytics reset placeholder.');
  };

  const handleLogout = async () => {
    await clearToken();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Settings</Text>

      {/* Notifications Toggle */}
      <View style={styles.row}>
        <Text style={styles.label}>Push Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={val => toggle('notifications', val, setNotificationsEnabled)}
        />
      </View>

      {/* Vibration Toggle */}
      <View style={styles.row}>
        <Text style={styles.label}>Vibrate on Completion</Text>
        <Switch
          value={vibrationEnabled}
          onValueChange={val => toggle('vibration', val, setVibrationEnabled)}
        />
      </View>

      {/* Long Breaks Toggle */}
      <View style={styles.row}>
        <Text style={styles.label}>Enable Long Breaks</Text>
        <Switch
          value={longBreaksEnabled}
          onValueChange={val => toggle('longBreaks', val, setLongBreaksEnabled)}
        />
      </View>

      {/* Pomodoro Durations */}
      <View style={styles.section}>
        <Text style={styles.label}>Pomodoro Durations</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={workDuration}
          onChangeText={setWorkDuration}
          placeholder="Work (min)"
        />
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={breakDuration}
          onChangeText={setBreakDuration}
          placeholder="Break (min)"
        />
        <TouchableOpacity style={styles.saveButton} onPress={saveDurations}>
          <Text style={styles.saveText}>Save Durations</Text>
        </TouchableOpacity>
      </View>

      {/* Navigation & Reset */}
      <TouchableOpacity
        style={[styles.button, styles.analyticsButton]}
        onPress={() => router.push('/analytics')}
      >
        <Text style={styles.analyticsText}>View Analytics</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetButton} onPress={resetSessions}>
        <Text style={styles.resetText}>Reset Pomodoro Sessions</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetButton} onPress={resetAnalytics}>
        <Text style={styles.resetText}>Reset Analytics</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24 },
  heading: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16,
  },
  label: { fontSize: 16, fontWeight: '500' },
  section: { marginTop: 20, marginBottom: 24 },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8,
    marginBottom: 10, fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#3B82F6', padding: 12, borderRadius: 8,
  },
  saveText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  analyticsButton: { backgroundColor: '#F3F4F6', marginBottom: 12, padding: 12, borderRadius: 8 },
  analyticsText: { textAlign: 'center', color: '#3B82F6', fontWeight: '500' },
  resetButton: { backgroundColor: '#E5E7EB', padding: 12, borderRadius: 8, marginBottom: 10 },
  resetText: { textAlign: 'center', color: '#374151', fontWeight: '500' },
  button: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8 },
  logoutButton: { backgroundColor: '#EF4444', marginTop: 12 },
  logoutText: { textAlign: 'center', color: '#fff', fontWeight: 'bold' },
});
