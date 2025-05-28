import { Slot } from 'expo-router';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function Layout() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Slot />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
