
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// Create axios instance with custom configuration
const api: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Add timeout if needed
    timeout: 10000,
    // Enable sending cookies if your API requires them
    withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Try to get the auth token from localStorage
        try {
            const userData = localStorage.getItem('user');
            if (userData) {
                const { token } = JSON.parse(userData);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
        } catch (error) {
            console.error('Error processing auth token:', error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle common errors here
        if (error.response) {
            // Server responded with error status
            switch (error.response.status) {
                case 401:
                    // Handle unauthorized - maybe redirect to login
                    localStorage.removeItem('user');
                    break;
                case 403:
                    // Handle forbidden
                    break;
                case 404:
                    // Handle not found
                    break;
                default:
                    // Handle other errors
                    break;
            }
        } else if (error.request) {
            // Request made but no response received
            console.error('No response received:', error.request);
        } else {
            // Error in setting up the request
            console.error('Error setting up request:', error.message);
        }
        return Promise.reject(error);
    }
);

export default api;