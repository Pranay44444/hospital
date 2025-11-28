// API Base Configuration
const API_BASE_URL = 'http://localhost:3000/api';

// Helper function to get auth token
const getToken = () => {
    return localStorage.getItem('token');
};

// Helper function to set auth token
const setToken = (token) => {
    localStorage.setItem('token', token);
};

// Helper function to remove auth token
const removeToken = () => {
    localStorage.removeItem('token');
};

// Helper function to get user data
const getUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

// Helper function to set user data
const setUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
};

// Helper function to remove user data
const removeUser = () => {
    localStorage.removeItem('user');
};

// Generic API call function
const apiCall = async (endpoint, options = {}) => {
    const token = getToken();

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
        },
        ...options,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
};

// Authentication API
export const authAPI = {
    // Register a new user
    register: async (userData) => {
        try {
            const data = await apiCall('/auth/register', {
                method: 'POST',
                body: JSON.stringify(userData),
            });

            if (data.success) {
                setToken(data.data.token);
                setUser(data.data.user);
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Login user
    login: async (credentials) => {
        try {
            const data = await apiCall('/auth/login', {
                method: 'POST',
                body: JSON.stringify(credentials),
            });

            if (data.success) {
                setToken(data.data.token);
                setUser(data.data.user);
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Google Login
    googleLogin: async (token) => {
        try {
            const data = await apiCall('/auth/google', {
                method: 'POST',
                body: JSON.stringify({ token }),
            });

            if (data.success) {
                setToken(data.data.token);
                setUser(data.data.user);
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Verify token
    verify: async () => {
        try {
            const data = await apiCall('/auth/verify', {
                method: 'GET',
            });

            if (data.success) {
                setUser(data.data.user);
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Get current user profile
    getProfile: async () => {
        try {
            const data = await apiCall('/auth/me', {
                method: 'GET',
            });

            if (data.success) {
                setUser(data.data.user);
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Logout user
    logout: () => {
        removeToken();
        removeUser();
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        return !!getToken();
    },

    // Get current user
    getCurrentUser: () => {
        return getUser();
    },
};

// Export helper functions for direct use if needed
export const tokenUtils = {
    getToken,
    setToken,
    removeToken,
};

export const userUtils = {
    getUser,
    setUser,
    removeUser,
};

export default authAPI;
