import { StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { Collapsible } from '@/components/Collapsible';
import React from 'react';

export default function ExploreScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="book.circle.fill"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome to StudySync</ThemedText>
      </ThemedView>
      <ThemedText>Explore the features that help optimize your study sessions.</ThemedText>

      <Collapsible title="📅 Calendar">
        <ThemedText>
          View all your tasks by date. Colored dots under dates indicate scheduled tasks —
          green for completed and yellow for pending ones.
        </ThemedText>
      </Collapsible>

      <Collapsible title="✅ Task Management">
        <ThemedText>
          Create, update, search, and mark tasks as complete. Tasks are grouped by status or date,
          with visual badges and filtering options.
        </ThemedText>
      </Collapsible>

      <Collapsible title="⏱ Pomodoro Timer">
        <ThemedText>
          Focus using a circular countdown timer. Customize durations, enable vibration,
          and enjoy auto-managed short and long breaks with session tracking.
        </ThemedText>
      </Collapsible>

      <Collapsible title="💬 Chatbot">
        <ThemedText>
          Ask study-related questions with our AI assistant powered by Phi-2 via Ollama.
          Chats are saved per user with timestamps, and you can clear history anytime.
        </ThemedText>
      </Collapsible>

      <Collapsible title="📊 Analytics">
        <ThemedText>
          Track tasks completed, weekly study performance, and total Pomodoro minutes — all
          updated in real-time based on your usage.
        </ThemedText>
      </Collapsible>

      <Collapsible title="⚙️ Settings">
        <ThemedText>
          Adjust Pomodoro durations, enable/disable vibration, toggle long breaks, and manage
          notification preferences — all personalized via AsyncStorage.
        </ThemedText>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
