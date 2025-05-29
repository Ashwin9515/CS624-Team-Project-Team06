import { Agenda } from 'react-native-calendars';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CalendarScreen() {
  const [items, setItems] = useState({});

  useEffect(() => {
    axios.get(`${process.env.EXPO_PUBLIC_API}/tasks`).then(res => {
      const tasks = res.data;
      const grouped = {};
      tasks.forEach(task => {
        const date = task.dueDate.split('T')[0];
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push({ name: task.title });
      });
      setItems(grouped);
    });
  }, []);

  return (
    <Agenda
      items={items}
      renderItem={(item) => <View><Text>{item.name}</Text></View>}
      renderEmptyDate={() => <View />}
    />
  );
}
