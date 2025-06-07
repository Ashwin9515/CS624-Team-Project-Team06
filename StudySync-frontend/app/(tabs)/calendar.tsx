import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar, DateObject } from 'react-native-calendars';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function TaskCalendar() {
  const router = useRouter();
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    axios
      .get(`${process.env.EXPO_PUBLIC_API}/tasks`)
      .then((res) => {
        const marks: any = {};
        res.data.forEach((task: any) => {
          const dateStr = new Date(task.dueDate).toISOString().split('T')[0];
          marks[dateStr] = {
            marked: true,
            dotColor: task.completed ? '#10B981' : '#F59E0B',
          };
        });
        setMarkedDates(marks);
      })
      .catch((err) => console.error('Failed to load calendar tasks', err));
  }, []);

  const handleDayPress = (day: DateObject) => {
    router.push({ pathname: '/tasks', params: { date: day.dateString } });
  };

  return (
    <View style={styles.container}>
      <Calendar
        markedDates={markedDates}
        onDayPress={handleDayPress}
        theme={{
          todayTextColor: '#2563EB',
          selectedDayBackgroundColor: '#2563EB',
          arrowColor: '#2563EB',
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
});
