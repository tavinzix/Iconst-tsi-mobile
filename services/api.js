import axios from "axios";
import * as SecureStore from 'expo-secure-store';

console.log("API URL:", process.env.EXPO_PUBLIC_API_URL);

const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL,
});

api.interceptors.request.use(async (config) => {
    const token = await SecureStore.getItemAsync("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;