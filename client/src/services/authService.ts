const API_URL = 'http://localhost:5001/api/auth';

interface User {
    id: string;
    username: string;
}

interface AuthResponse {
    user: User;
    token: string;
}

export const register = async (username: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const data: AuthResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Registration error:', error);
        throw new Error('Registration failed. Please try again.');
    }
};

export const login = async (username: string, password: string): Promise<AuthResponse> => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        const data: AuthResponse = await response.json();

        if (!data.token || !data.user || !data.user.id || !data.user.username) {
            throw new Error('Invalid response from server');
        }

        localStorage.setItem('user', JSON.stringify(data));
        return data;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};

export const logout = (): void => {
    localStorage.removeItem('user');
};

const authService = {
    register,
    login,
    logout,
};

export default authService;
