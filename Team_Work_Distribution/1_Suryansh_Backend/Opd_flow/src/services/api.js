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
            if (response.status === 401) {
                // Token is invalid or expired
                removeToken();
                removeUser();
                // Optional: Redirect to login if not already there
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
            }
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

    // Update user profile
    updateProfile: async (profileData) => {
        try {
            const data = await apiCall('/auth/update-profile', {
                method: 'PUT',
                body: JSON.stringify(profileData),
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

// Doctor API
export const doctorAPI = {
    // Register as doctor
    registerDoctor: async (doctorData) => {
        try {
            const data = await apiCall('/doctor/register', {
                method: 'POST',
                body: JSON.stringify(doctorData),
            });

            if (data.success) {
                // Update user data to reflect isDoctor status
                const currentUser = getUser();
                if (currentUser) {
                    currentUser.isDoctor = true;
                    currentUser.doctorId = data.data.doctor._id;
                    setUser(currentUser);
                }
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Get all doctors
    getDoctors: async (filters = {}) => {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const endpoint = queryParams ? `/doctor/list?${queryParams}` : '/doctor/list';

            const data = await apiCall(endpoint, {
                method: 'GET',
            });

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Get doctor profile by ID
    getDoctorProfile: async (id) => {
        try {
            const data = await apiCall(`/doctor/profile/${id}`, {
                method: 'GET',
            });

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Get my doctor profile
    getMyDoctorProfile: async () => {
        try {
            const data = await apiCall('/doctor/my-profile', {
                method: 'GET',
            });

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Update doctor profile
    updateDoctor: async (doctorData) => {
        try {
            const data = await apiCall('/doctor/update', {
                method: 'PUT',
                body: JSON.stringify(doctorData),
            });

            return data;
        } catch (error) {
            throw error;
        }
    },

    // Update timings
    updateTimings: async (timings) => {
        try {
            const data = await apiCall('/doctor/timings', {
                method: 'POST',
                body: JSON.stringify({ timings }),
            });

            return data;
        } catch (error) {
            throw error;
        }
    },
};

// Appointment API
export const appointmentAPI = {
    createAppointment: async (appointmentData) => {
        try {
            const data = await apiCall('/appointments/create', {
                method: 'POST',
                body: JSON.stringify(appointmentData),
            });
            return data;
        } catch (error) {
            throw error;
        }
    },

    getPatientAppointments: async () => {
        try {
            const data = await apiCall('/appointments/patient', {
                method: 'GET',
            });
            return data;
        } catch (error) {
            throw error;
        }
    },

    getDoctorAppointments: async () => {
        try {
            const data = await apiCall('/appointments/doctor', {
                method: 'GET',
            });
            return data;
        } catch (error) {
            throw error;
        }
    },

    updateAppointmentStatus: async (appointmentId, status) => {
        try {
            const data = await apiCall(`/appointments/${appointmentId}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status }),
            });
            return data;
        } catch (error) {
            throw error;
        }
    },

    getPatientStats: async () => {
        try {
            const data = await apiCall('/appointments/stats/patient', {
                method: 'GET',
            });
            return data;
        } catch (error) {
            throw error;
        }
    },

    getDoctorStats: async () => {
        try {
            const data = await apiCall('/appointments/stats/doctor', {
                method: 'GET',
            });
            return data;
        } catch (error) {
            throw error;
        }
    },
};

// Payment API
export const paymentAPI = {
    createOrder: async (amount) => {
        try {
            const data = await apiCall('/payment/create-order', {
                method: 'POST',
                body: JSON.stringify({ amount }),
            });
            return data;
        } catch (error) {
            throw error;
        }
    },

    verifyPayment: async (paymentData) => {
        try {
            const data = await apiCall('/payment/verify', {
                method: 'POST',
                body: JSON.stringify(paymentData),
            });
            return data;
        } catch (error) {
            throw error;
        }
    },
};

export default authAPI;
