import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Initialize authToken and userId with values from localStorage or null if not set
    const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
    const [userId, setUserId] = useState(localStorage.getItem('userId'));

    // Effect hook to ensure userId is set on load from localStorage if available
    useEffect(() => {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    // Handle login, setting token and userId in both context and localStorage
    const handleLogin = async (credentials) => {
        try {
            const response = await api.post('/login', credentials);
            console.log('Login Response:', response.data); // Debugging
            const { token, user } = response.data;
            setAuthToken(token);
            setUserId(user.id);
            localStorage.setItem('token', token);
            localStorage.setItem('userId', user.id);
        } catch (error) {
            console.error('Error logging in:', error.message);
            throw error;
        }
    };

    // Handle logout, clearing token and userId from context and localStorage
    const handleLogout = () => {
        setAuthToken(null);
        setUserId(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    };

    return (
        <AuthContext.Provider value={{ authToken, userId, handleLogin, handleLogout }}>
            {children}
        </AuthContext.Provider>
    );
};
