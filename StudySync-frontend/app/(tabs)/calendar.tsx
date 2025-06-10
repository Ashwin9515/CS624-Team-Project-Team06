import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, Text, Alert } from 'react-native';
import { Calendar, DateObject } from 'react-native-calendars';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type MarkedDate = {
  marked: boolean;
  dots: { color: string }[];
};

export default function TaskCalendar() {
  const router = useRouter();
  const [markedDates, setMarkedDates] = useState<Record<string, MarkedDate>>({});

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${process.env.EXPO_PUBLIC_API}/tasks`);
        await AsyncStorage.setItem('cachedCalendarTasks', JSON.stringify(res.data));
        processTaskMarks(res.data);
      } catch (err) {
        console.warn('⚠️ Network error. Using cached calendar tasks...');
        const cached = await AsyncStorage.getItem('cachedCalendarTasks');
        if (cached) {
          processTaskMarks(JSON.parse(cached));
          Alert.alert('Offline Mode', 'Showing calendar from cached data.');
        } else {
          Alert.alert('Error', 'Could not load tasks from network or cache.');
        }
      }
    };

    const processTaskMarks = (tasks: any[]) => {
      const marks: Record<string, MarkedDate> = {};

      tasks.forEach((task) => {
        const dateStr = new Date(task.dueDate).toISOString().split('T')[0];
        const color = task.completed ? '#10B981' : '#F59E0B';

        if (!marks[dateStr]) {
          marks[dateStr] = { marked: true, dots: [{ color }] };
        } else {
          const existingColors = marks[dateStr].dots.map((dot) => dot.color);
          if (!existingColors.includes(color)) {
            marks[dateStr].dots.push({ color });
          }
        }
      });

      setMarkedDates(marks);
    };

    fetchTasks();
  }, []);

  const handleDayPress = (day: DateObject) => {
    router.push({ pathname: '/tasks', params: { date: day.dateString } });
  };

  return (
    <ImageBackground
      source={require('../../assets/studysync.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.wrapper}>
        <Text style={styles.title}>📅 Study Calendar</Text>
        <Calendar
          markedDates={markedDates}
          markingType="multi-dot"
          onDayPress={handleDayPress}
          theme={{
            backgroundColor: 'transparent',
            calendarBackground: 'transparent',
            todayTextColor: '#2563EB',
            selectedDayBackgroundColor: '#2563EB',
            arrowColor: '#2563EB',
            monthTextColor: '#fff',
            textSectionTitleColor: '#fff',
            dayTextColor: '#fff',
          }}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: 'center',
  },
  wrapper: {
    padding: 20,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingVertical: 6,
    borderRadius: 8,
  },
});
