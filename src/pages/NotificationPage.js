import React, { useContext, useState } from 'react';
import { NotificationContext } from './NotificationContext';
import axios from 'axios';
import { Container, Header, Button, Message, Segment, Modal, Icon } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const NotificationsPage = () => {
    const { notifications, setNotifications } = useContext(NotificationContext);

    const [open, setOpen] = useState(false); // For modal visibility
    const [selectedNotification, setSelectedNotification] = useState(null); // To hold the notification to be marked as read

    const markAsRead = async (notificationId) => {
        try {
            await axios.put(`http://localhost:3000/api/BookApplication/NotificationService/notifications/${notificationId}/read`);
            setNotifications(prevNotifications =>
                prevNotifications.map(notification =>
                    notification.id === notificationId ? { ...notification, isRead: true } : notification
                )
            );
            setOpen(false); // Close modal after action
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleOpenModal = (notification) => {
        setSelectedNotification(notification);
        setOpen(true);
    };

    const handleCloseModal = () => {
        setOpen(false);
        setSelectedNotification(null);
    };

    return (
        <Container style={{ paddingTop: '20px' }}>
            <Header as="h2" textAlign="center" color="blue">
                Notifications
            </Header>
            {notifications.length === 0 ? (
                <Message info content="You have no new notifications!" />
            ) : (
                <Segment.Group>
                    {notifications.map(notification => (
                        <Segment key={notification.id} raised>
                            <div className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}>
                                <Message
                                    info={!notification.isRead}
                                    success={notification.isRead}
                                    header={notification.isRead ? 'Read' : 'New Notification'}
                                    content={notification.content}
                                />
                                <Button
                                    primary={!notification.isRead}
                                    disabled={notification.isRead}
                                    onClick={() => handleOpenModal(notification)}
                                >
                                    {notification.isRead ? 'Read' : 'Mark as Read'}
                                </Button>
                            </div>
                        </Segment>
                    ))}
                </Segment.Group>
            )}

            {/* Modal for confirmation */}
            {selectedNotification && (
                <Modal
                    open={open}
                    onClose={handleCloseModal}
                    size="tiny"
                    closeIcon
                >
                    <Modal.Header>Mark Notification as Read</Modal.Header>
                    <Modal.Content>
                        <p>Are you sure you want to mark this notification as read?</p>
                        <Message info content={selectedNotification.content} />
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={handleCloseModal} color="red">
                            <Icon name="remove" /> Cancel
                        </Button>
                        <Button
                            onClick={() => markAsRead(selectedNotification.id)}
                            color="green"
                        >
                            <Icon name="checkmark" /> Confirm
                        </Button>
                    </Modal.Actions>
                </Modal>
            )}
        </Container>
    );
};

export default NotificationsPage;
