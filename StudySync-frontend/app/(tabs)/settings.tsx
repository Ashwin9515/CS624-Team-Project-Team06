import { View, Text, Switch, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { clearToken } from '../../utils/auth';

export default function Settings() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [workDuration, setWorkDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);

  useEffect(() => {
    (async () => {
      const notifs = await AsyncStorage.getItem('notifications');
      const work = await AsyncStorage.getItem('pomodoro-work');
      const brk = await AsyncStorage.getItem('pomodoro-break');
      if (notifs) setNotificationsEnabled(notifs === 'true');
      if (work) setWorkDuration(parseInt(work));
      if (brk) setBreakDuration(parseInt(brk));
    })();
  }, []);

  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    await AsyncStorage.setItem('notifications', newValue.toString());
  };

  const handleLogout = async () => {
    await clearToken();
    router.replace('/');
  };

  return (
    <View className="flex-1 bg-white p-6">
      <Text className="text-2xl font-bold mb-6">Settings</Text>

      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-base font-medium">Push Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
        />
      </View>

      <View className="mb-6">
        <Text className="text-base font-medium mb-1">Pomodoro Work Duration: {workDuration} min</Text>
        <Text className="text-base font-medium">Break Duration: {breakDuration} min</Text>
        <Text className="text-sm text-gray-500 mt-1">Configured via Pomodoro screen</Text>
      </View>

      <TouchableOpacity
        onPress={() => router.push('/analytics')}
        className="bg-gray-100 px-4 py-3 rounded mb-4"
      >
        <Text className="text-center font-medium text-blue-500">View Analytics</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-500 px-4 py-3 rounded"
      >
        <Text className="text-white text-center font-bold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
