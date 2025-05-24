import axios from 'axios';

const API_URL = 'http://localhost:5002/api/auth';

interface User {
    id: string;
    username: string;
}

interface AuthResponse {
    user: User;
    token: string;
}

// Configure Axios instance
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // For CORS credentials (if needed)
    headers: {
        'Content-Type': 'application/json',
    },
});

// Register
export const register = async (username: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await api.post<AuthResponse>('/register', { username, password });
        // Store the user data just like in login
        localStorage.setItem('user', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Registration error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Registration failed. Please try again.');
        } else {
            console.error('Unexpected error:', error);
            throw new Error('An unexpected error occurred.');
        }
    }
};
// Login
export const login = async (username: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await api.post<AuthResponse>('/login', { username, password });
        const data = response.data;

        // Validate response structure
        if (!data.token || !data.user?.id || !data.user?.username) {
            throw new Error('Invalid server response');
        }

        localStorage.setItem('user', JSON.stringify(data));
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Login error:', error.response?.data || error.message);
            throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
        } else {
            console.error('Unexpected error:', error);
            throw error; // Re-throw non-Axios errors
        }
    }
};

// Logout
export const logout = (): void => {
    localStorage.removeItem('user');
};

// AuthService object
const authService = {
    register,
    login,
    logout,
};

export default authService;