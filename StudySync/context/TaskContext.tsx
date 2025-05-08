import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Task = {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  priority: string;
};

type TaskContextType = {
  tasks: Task[];
  addTask: (task: Task) => void;
  deleteTask: (id: string) => void;
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    AsyncStorage.getItem('tasks').then(data => {
      if (data) setTasks(JSON.parse(data));
    });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (task: Task) => setTasks(prev => [...prev, task]);
  const deleteTask = (id: string) => setTasks(prev => prev.filter(task => task.id !== id));

  return (
    <TaskContext.Provider value={{ tasks, addTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error('useTasks must be used within TaskProvider');
  return context;
};