import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ImageBackground, Text } from 'react-native';
import { Calendar, DateObject } from 'react-native-calendars';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function TaskCalendar() {
  const router = useRouter();
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${process.env.EXPO_PUBLIC_API}/tasks`);
        const marks: any = {};

        res.data.forEach((task: any) => {
          const dateStr = new Date(task.dueDate).toISOString().split('T')[0];
          const color = task.completed ? '#10B981' : '#F59E0B';

          if (!marks[dateStr]) {
            marks[dateStr] = {
              marked: true,
              dots: [{ color }],
            };
          } else {
            const existingDots = marks[dateStr].dots.map((d: any) => d.color);
            if (!existingDots.includes(color)) {
              marks[dateStr].dots.push({ color });
            }
          }
        });

        // Convert to react-native-calendars format
        const finalMarks = Object.fromEntries(
          Object.entries(marks).map(([date, { dots }]) => [
            date,
            {
              marked: true,
              dots,
            },
          ])
        );

        setMarkedDates(finalMarks);
      } catch (err) {
        console.error('Failed to load calendar tasks', err);
      }
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
          markingType={'multi-dot'}
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
