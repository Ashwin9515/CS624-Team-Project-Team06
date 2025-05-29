import axios from 'axios';
import Constants from 'expo-constants';

const apiUrl = Constants.expoConfig?.extra?.apiUrl;

if (!apiUrl) {
  throw new Error('Missing API URL in app.config.js -> extra.apiUrl');
}

const API = axios.create({
  baseURL: apiUrl,
});

export default API;
