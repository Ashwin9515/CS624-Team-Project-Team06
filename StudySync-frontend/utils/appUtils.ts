import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import API from './api';
import moment from 'moment';

/**
 * Offline queue manager for pending requests (e.g., adding tasks while offline)
 */
const OFFLINE_QUEUE_KEY = 'offline_task_queue';

export const enqueueTask = async (task) => {
  const existing = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
  const queue = existing ? JSON.parse(existing) : [];
  queue.push(task);
  await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
};

export const flushOfflineQueue = async () => {
  const state = await NetInfo.fetch();
  if (!state.isConnected) return;

  const stored = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
  const queue = stored ? JSON.parse(stored) : [];

  for (const task of queue) {
    try {
      await API.post('/tasks', task);
    } catch (err) {
      console.warn('Failed to flush queued task', task, err);
    }
  }

  await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY);
};

/**
 * Pomodoro preference helpers
 */
export const getPomodoroSettings = async () => {
  const work = await AsyncStorage.getItem('pomodoro-work');
  const breakMins = await AsyncStorage.getItem('pomodoro-break');
  return {
    work: work ? parseInt(work) : 25,
    break: breakMins ? parseInt(breakMins) : 5,
  };
};

export const setPomodoroSettings = async (work, breakMins) => {
  await AsyncStorage.setItem('pomodoro-work', work.toString());
  await AsyncStorage.setItem('pomodoro-break', breakMins.toString());
};

/**
 * Visual task badge generator
 */
export const getTaskBadgeColor = (status) => {
  switch (status) {
    case 'completed': return '#10B981';
    case 'pending': return '#F59E0B';
    case 'overdue': return '#EF4444';
    default: return '#6B7280';
  }
};

/**
 * Group tasks by date
 */
export const groupTasksByDate = (tasks) => {
  const grouped = {};
  for (const task of tasks) {
    const date = moment(task.dueDate).format('YYYY-MM-DD');
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push(task);
  }
  return grouped;
};