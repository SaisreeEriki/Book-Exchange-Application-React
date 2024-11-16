import React, { useContext } from 'react';
import { NotificationContext } from './NotificationContext';

const NotificationPopup = () => {
    const { newNotification, setNewNotification, notifications } = useContext(NotificationContext);

    const handleClose = () => {
        setNewNotification(false); // Close the popup
    };

    if (!newNotification) return null; // Don't show the popup if there are no new notifications

    const latestNotification = notifications[notifications.length - 1]; // Get the latest notification

    return (
        <div className="notification-popup">
            <div className="popup-content">
                <h4>New Notification</h4>
                <p>{latestNotification.message}</p>
                <button onClick={handleClose}>Close</button>
            </div>
        </div>
    );
};

export default NotificationPopup;
