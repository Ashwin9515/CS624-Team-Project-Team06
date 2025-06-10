import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

if (!apiUrl) {
  throw new Error('Missing API URL in app.config.js -> extra.apiUrl');
}

const API = axios.create({
  baseURL: apiUrl,
});

// ✅ Attach token to every request
API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
