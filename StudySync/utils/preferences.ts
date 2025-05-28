import AsyncStorage from '@react-native-async-storage/async-storage';

export const setPomodoroSettings = async (work: number, breakMins: number) => {
  await AsyncStorage.setItem('pomodoro-work', work.toString());
  await AsyncStorage.setItem('pomodoro-break', breakMins.toString());
};

export const getPomodoroSettings = async (): Promise<{ work: number; break: number }> => {
  const work = await AsyncStorage.getItem('pomodoro-work');
  const breakMins = await AsyncStorage.getItem('pomodoro-break');
  return {
    work: work ? parseInt(work) : 25,
    break: breakMins ? parseInt(breakMins) : 5,
  };
};
