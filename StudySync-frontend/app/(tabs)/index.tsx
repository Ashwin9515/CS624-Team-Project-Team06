import { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { getToken, saveToken } from '../../utils/auth';

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) router.replace('/home');
      else setLoading(false);
    })();
  }, []);

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${process.env.EXPO_PUBLIC_API}/auth/login`, {
        username,
        password,
      });
      await saveToken(res.data.token);
      router.replace('/home');
    } catch (error) {
      Alert.alert('Login Failed', error.response?.data?.error || 'Invalid credentials');
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center p-6 bg-white">
      <Text className="text-3xl font-bold mb-4">Login</Text>
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
      <TouchableOpacity onPress={handleLogin} className="bg-blue-500 px-6 py-3 rounded mt-2">
        <Text className="text-white font-bold">Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/register')} className="mt-4">
        <Text className="text-blue-600">Don’t have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}
