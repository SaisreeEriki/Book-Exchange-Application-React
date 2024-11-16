// NotificationContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Create the NotificationContext
export const NotificationContext = createContext();

// NotificationProvider component that fetches and provides notifications
export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const userId = localStorage.getItem('userId'); // Make sure userId is stored in localStorage after login

        const fetchNotifications = async () => {
            try {
                // Make a GET request to fetch notifications for the logged-in user
                const response = await axios.get(`http://localhost:3000/api/BookApplication/NotificationService/notifications/user/${userId}`);
                setNotifications(response.data.data);
                setUnreadCount(response.data.data.filter(notification => !notification.isRead).length);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            }
        };

        // Poll for new notifications every 5 seconds
        const intervalId = setInterval(fetchNotifications, 5000);

        // Fetch notifications once on component mount
        fetchNotifications();

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount }}>
            {children}
        </NotificationContext.Provider>
    );
};
