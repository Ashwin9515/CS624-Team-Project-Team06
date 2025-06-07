import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Button, StyleSheet, Dimensions, Alert, Vibration } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle } from 'react-native-svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const size = width * 0.7;
const strokeWidth = 12;
const radius = (size - strokeWidth) / 2;
const circumference = 2 * Math.PI * radius;

export default function Pomodoro() {
  const [seconds, setSeconds] = useState(1500); // default 25 min
  const [workDuration, setWorkDuration] = useState(1500);
  const [breakDuration, setBreakDuration] = useState(300);
  const [longBreakDuration, setLongBreakDuration] = useState(900); // 15 min
  const [sessionCount, setSessionCount] = useState(0);
  const [running, setRunning] = useState(false);
  const [onBreak, setOnBreak] = useState(false);
  const [vibrationEnabled, setVibrationEnabled] = useState(false);
  const [longBreaksEnabled, setLongBreaksEnabled] = useState(false);
  const intervalRef = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    (async () => {
      const work = await AsyncStorage.getItem('pomodoro-work');
      const brk = await AsyncStorage.getItem('pomodoro-break');
      const vibrate = await AsyncStorage.getItem('vibration');
      const longBreaks = await AsyncStorage.getItem('longBreaks');

      const workSec = (work ? parseInt(work) : 25) * 60;
      const breakSec = (brk ? parseInt(brk) : 5) * 60;

      setWorkDuration(workSec);
      setBreakDuration(breakSec);
      setSeconds(workSec);
      setVibrationEnabled(vibrate === 'true');
      setLongBreaksEnabled(longBreaks === 'true');

      const saved = await AsyncStorage.getItem('pomodoroSessions');
      if (saved) setSessionCount(parseInt(saved));
    })();
  }, []);

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      handleSessionComplete();
    }
    return () => clearInterval(intervalRef.current as NodeJS.Timeout);
  }, [running, seconds]);

  const handleSessionComplete = async () => {
    clearInterval(intervalRef.current as NodeJS.Timeout);
    setRunning(false);

    if (vibrationEnabled) {
      Vibration.vibrate();
    }

    if (onBreak) {
      setOnBreak(false);
      setSeconds(workDuration);
      Alert.alert('Break Over', 'Ready for the next focus session!');
    } else {
      const newCount = sessionCount + 1;
      setSessionCount(newCount);
      await AsyncStorage.setItem('pomodoroSessions', newCount.toString());

      setOnBreak(true);
      if (longBreaksEnabled && newCount % 4 === 0) {
        setSeconds(longBreakDuration);
        Alert.alert('🎉 Long Break', 'Take a 15-minute break!');
      } else {
        setSeconds(breakDuration);
        Alert.alert('Session Complete', 'Take a short 5-minute break!');
      }
    }

    setRunning(true);
  };

  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  const totalTime = onBreak
    ? (longBreaksEnabled && sessionCount % 4 === 0 ? longBreakDuration : breakDuration)
    : workDuration;
  const progress = seconds / totalTime;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <LinearGradient colors={['#60A5FA', '#4F46E5']} style={styles.container}>
      <Svg width={size} height={size}>
        <Circle
          stroke="#ffffff30"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke="#fff"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <Text style={styles.timer}>{minutes}:{secs}</Text>
      <Text style={styles.modeText}>{onBreak ? 'Break Time 🧘' : 'Focus Time 🔥'}</Text>
      <View style={styles.buttonWrapper}>
        <Button
          title={running ? 'Pause' : 'Start'}
          onPress={() => setRunning(!running)}
          color="#ffffff"
        />
      </View>
      <Text style={styles.sessionCount}>🧠 Sessions Completed: {sessionCount}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  timer: {
    position: 'absolute',
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  modeText: {
    position: 'absolute',
    bottom: 180,
    fontSize: 18,
    color: '#fff',
  },
  sessionCount: {
    position: 'absolute',
    bottom: 60,
    fontSize: 16,
    color: '#fff',
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 100,
    backgroundColor: '#ffffff30',
    borderRadius: 8,
    overflow: 'hidden',
  },
});
