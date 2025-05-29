import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import axios from 'axios';
import { router } from 'expo-router';
import Constants from 'expo-constants';

const API = Constants.expoConfig?.extra?.apiUrl ?? '';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/auth/login`, { email, password });
      // Store token or session info
      router.replace('/home');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput onChangeText={setEmail} value={email} />
      <Text>Password</Text>
      <TextInput onChangeText={setPassword} value={password} secureTextEntry />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
