import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

export async function setupNotifications() {
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  if (status !== 'granted') {
    await Permissions.askAsync(Permissions.NOTIFICATIONS);
  }

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  return token;
}

export function schedulePomodoroNotification() {
  Notifications.scheduleNotificationAsync({
    content: {
      title: "Pomodoro Break!",
      body: "Time to take a short break 🎉",
    },
    trigger: { seconds: 1500 }, // 25 min
  });
}
