import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://projectmanagementapp-production.up.railway.app/api';
console.log('📡 API Base URL:', baseURL);

const api = axios.create({
    baseURL,
});

api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default api;
