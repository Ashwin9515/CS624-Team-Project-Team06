import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function Register() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post(`${process.env.EXPO_PUBLIC_API}/auth/register`, {
        username,
        password,
      });
      Alert.alert('Success', 'Account created!');
      router.push('/login');
    } catch (error) {
      Alert.alert('Error', error.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-6 bg-white">
      <Text className="text-3xl font-bold mb-4">Register</Text>
      <TextInput
        className="border p-3 rounded w-full mb-3"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        className="border p-3 rounded w-full mb-3"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity onPress={handleRegister} className="bg-blue-500 px-6 py-3 rounded mt-2">
        <Text className="text-white font-bold">Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/login')} className="mt-4">
        <Text className="text-blue-600">Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
}
