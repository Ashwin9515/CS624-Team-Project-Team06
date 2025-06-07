import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  Text,
} from 'react-native';
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
    <ImageBackground
      source={require('../../assets/studysync-bg.png')}
      style={styles.bg}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.header}>📅 Task Calendar</Text>
        <Calendar
          markedDates={markedDates}
          onDayPress={handleDayPress}
          style={styles.calendar}
          theme={{
            todayTextColor: '#2563EB',
            selectedDayBackgroundColor: '#2563EB',
            arrowColor: '#2563EB',
            textDayFontWeight: '500',
            textMonthFontWeight: 'bold',
            textDayHeaderFontWeight: '600',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: 24,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1E3A8A',
    marginBottom: 16,
  },
  calendar: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
  },
});
