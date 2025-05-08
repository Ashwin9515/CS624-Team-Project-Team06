import { Slot } from 'expo-router';
import { TaskProvider } from '../context/TaskContext';

export default function RootLayout() {
  return (
    <TaskProvider>
      <Slot />
    </TaskProvider>
  );
}
