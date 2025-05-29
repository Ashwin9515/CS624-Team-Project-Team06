import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';

export default function Pomodoro() {
  const [seconds, setSeconds] = useState(25 * 60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (running) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [running]);

  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  return (
    <View className="flex-1 justify-center items-center bg-gradient-to-b from-blue-400 to-indigo-600">
      <Text className="text-white text-5xl font-bold">{minutes}:{secs}</Text>
      <Button title={running ? 'Pause' : 'Start'} onPress={() => setRunning(!running)} />
    </View>
  );
}
