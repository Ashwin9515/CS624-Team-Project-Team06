import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiUrl || 'https://psychic-train-g44vpp77rqr9fv44x-5000.app.github.dev',
});

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
