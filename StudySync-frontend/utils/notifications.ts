import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Request permissions and return Expo Push Token
export async function setupNotifications(): Promise<string | null> {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.warn('Notification permissions not granted');
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();
  console.log('Expo Push Token:', tokenData.data);
  return tokenData.data;
}

// Schedule a Pomodoro reminder after 25 minutes
export function schedulePomodoroNotification() {
  Notifications.scheduleNotificationAsync({
    content: {
      title: 'Pomodoro Session Complete ⏰',
      body: 'Time to take a short break! 🎉',
    },
    trigger: { seconds: 1500 }, // 25 minutes
  });
}

// Optional: schedule task reminder at specific time
export function scheduleTaskReminder(time: Date, taskName: string) {
  Notifications.scheduleNotificationAsync({
    content: {
      title: 'Task Reminder',
      body: `Don’t forget: ${taskName}`,
    },
    trigger: time,
  });
}
