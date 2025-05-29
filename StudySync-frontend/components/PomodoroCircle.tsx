import { View, Text } from 'react-native';
import { CircularProgress } from 'react-native-circular-progress-indicator';

export default function PomodoroCircle({ timeLeft, total }) {
  const percentage = ((total - timeLeft) / total) * 100;

  return (
    <View className="items-center">
      <CircularProgress
        value={percentage}
        radius={90}
        maxValue={100}
        title={'Pomodoro'}
        progressValueColor={'#111418'}
        activeStrokeColor={'#3d98f4'}
        inActiveStrokeColor={'#f0f2f5'}
        titleColor={'#60758a'}
      />
      <Text className="text-lg font-bold mt-2">{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</Text>
    </View>
  );
}
