import { View, Text, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Analytics() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${process.env.EXPO_PUBLIC_API}/analytics`).then(res => setStats(res.data));
  }, []);

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-2xl font-bold mb-4">Study Analytics</Text>
      {stats && (
        <>
          <Text>✅ Tasks Completed: {stats.completed}</Text>
          <Text>📅 Tasks This Week: {stats.weeklyCount}</Text>
          <Text>⏱️ Total Pomodoro Time: {stats.totalPomodoro} mins</Text>
        </>
      )}
    </View>
  );
}
