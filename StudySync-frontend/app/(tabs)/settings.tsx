import React, { useEffect, useState } from 'react';
import { View, Text, Switch, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { clearToken } from '../../utils/auth';

export default function Settings() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(false);
  const [vibration, setVibration] = useState(false);
  const [longBreaks, setLongBreaks] = useState(false);
  const [work, setWork] = useState('25');
  const [breakTime, setBreakTime] = useState('5');

  useEffect(() => {
    (async () => {
      setNotifications((await AsyncStorage.getItem('notifications')) === 'true');
      setVibration((await AsyncStorage.getItem('vibration')) === 'true');
      setLongBreaks((await AsyncStorage.getItem('longBreaks')) === 'true');
      setWork((await AsyncStorage.getItem('pomodoro-work')) || '25');
      setBreakTime((await AsyncStorage.getItem('pomodoro-break')) || '5');
    })();
  }, []);

  const saveDurations = async () => {
    await AsyncStorage.setItem('pomodoro-work', work);
    await AsyncStorage.setItem('pomodoro-break', breakTime);
    Alert.alert('Saved', 'Durations updated.');
  };

  const resetAnalytics = async () => {
    await AsyncStorage.setItem('pomodoroSessions', '0');
    Alert.alert('Reset', 'Pomodoro session count reset.');
  };

  const clearAllLocalData = async () => {
    await AsyncStorage.clear();
    Alert.alert('Cleared', 'All local settings and cache cleared.');
    router.replace('/');
  };

  return (
    <ImageBackground source={require('../../assets/settings.png')} style={styles.bg}>
      <View style={styles.overlay}>
        <Text style={styles.heading}>⚙️ Settings</Text>

        {[{ label: 'Push Notifications', state: notifications, setter: setNotifications, key: 'notifications' },
          { label: 'Vibration', state: vibration, setter: setVibration, key: 'vibration' },
          { label: 'Long Breaks', state: longBreaks, setter: setLongBreaks, key: 'longBreaks' }]
          .map(({ label, state, setter, key }) => (
            <View key={key} style={styles.row}>
              <Text style={styles.label}>{label}</Text>
              <Switch
                value={state}
                onValueChange={val => {
                  setter(val);
                  AsyncStorage.setItem(key, val.toString());
                }}
              />
            </View>
          ))
        }

        <Text style={styles.label}>Work Duration (min)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={work}
          onChangeText={setWork}
        />
        <Text style={styles.label}>Break Duration (min)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={breakTime}
          onChangeText={setBreakTime}
        />

        <TouchableOpacity style={styles.saveButton} onPress={saveDurations}>
          <Text style={styles.saveText}>Save</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.resetButton} onPress={resetAnalytics}>
          <Text style={styles.resetText}>Reset Pomodoro Analytics</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.clearButton} onPress={clearAllLocalData}>
          <Text style={styles.clearText}>Clear All Local Data</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={async () => {
          await clearToken();
          router.replace('/');
        }}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  overlay: { flex: 1, padding: 24 },
  heading: { color: '#fff', fontSize: 26, fontWeight: 'bold', marginBottom: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  label: { color: '#fff', fontSize: 16, marginBottom: 4 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#10B981', padding: 12, borderRadius: 10, marginTop: 8,
  },
  saveText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  resetButton: {
    backgroundColor: '#3B82F6', padding: 12, borderRadius: 10, marginTop: 12,
  },
  resetText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  clearButton: {
    backgroundColor: '#F59E0B', padding: 12, borderRadius: 10, marginTop: 12,
  },
  clearText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  logoutButton: {
    backgroundColor: '#EF4444', padding: 12, borderRadius: 10, marginTop: 20,
  },
  logoutText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
});
