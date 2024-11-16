import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Form, Button, Dropdown, Message } from 'semantic-ui-react';

const SendExchangeRequestPage = () => {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedBook, setSelectedBook] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [deliveryMethod, setDeliveryMethod] = useState('');
    const [exchangeDuration, setExchangeDuration] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const userId = localStorage.getItem('userId'); // Logged-in user ID

    useEffect(() => {
        // Fetch logged-in user's books
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/BookApplication/BookService/books');
                const userBooks = response.data.filter((book) => book.ownerId === userId);
                setBooks(
                    userBooks.map((book) => ({
                        key: book.bookId,
                        text: book.title,
                        value: book.bookId,
                    }))
                );
            } catch (err) {
                console.error('Error fetching books:', err);
                setError('Failed to load books. Please try again.');
            }
        };

        // Fetch all users excluding the logged-in user
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/BookApplication/UserService/users');
                const filteredUsers = response.data.filter((user) => user.userId !== userId);
                setUsers(
                    filteredUsers.map((user) => ({
                        key: user.userId,
                        text: user.name,
                        value: user.userId,
                    }))
                );
            } catch (err) {
                console.error('Error fetching users:', err);
                setError('Failed to load users. Please try again.');
            }
        };

        fetchBooks();
        fetchUsers();
    }, [userId]);

    const handleSubmit = async () => {
        if (!selectedBook || !selectedUser || !deliveryMethod || !exchangeDuration) {
            setError('Please fill in all fields.');
            return;
        }

        const payload = {
            senderId: userId,
            receiverId: selectedUser,
            bookId: selectedBook,
            deliveryMethod,
            exchangeDuration: parseInt(exchangeDuration, 10), // Ensure it's an integer
            status: 'pending',
        };

        try {
            const response = await axios.post(
                'http://localhost:3000/api/BookApplication/ExchangeService/send',
                payload
            );

            if (response.status === 201) {
                setSuccessMessage('Exchange request sent successfully!');
                // Navigate to the view-exchange-requests page
                navigate('/view-exchange-requests');

                // Optionally send a notification
                await axios.post('http://localhost:3000/api/BookApplication/NotificationService/send', {
                    senderId: userId,
                    receiverId: selectedUser,
                    message: `You have a new book exchange request for book ID: ${selectedBook}`,
                });
            } else {
                setError('Failed to send the exchange request. Please try again.');
            }
        } catch (err) {
            console.error('Error sending exchange request:', err);
            setError('An error occurred while sending the request.');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Send Exchange Request</h2>
            {error && <Message error>{error}</Message>}
            {successMessage && <Message success>{successMessage}</Message>}
            <Form>
                <Form.Field>
                    <label>Select a Book</label>
                    <Dropdown
                        placeholder="Select your book"
                        fluid
                        selection
                        options={books}
                        value={selectedBook}
                        onChange={(e, { value }) => setSelectedBook(value)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Select a User</label>
                    <Dropdown
                        placeholder="Select a user"
                        fluid
                        selection
                        options={users}
                        value={selectedUser}
                        onChange={(e, { value }) => setSelectedUser(value)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Delivery Method</label>
                    <Dropdown
                        placeholder="Select delivery method"
                        fluid
                        selection
                        options={[
                            { key: 'courier', text: 'Courier', value: 'Courier' },
                            { key: 'pickup', text: 'Pickup', value: 'Pickup' },
                        ]}
                        value={deliveryMethod}
                        onChange={(e, { value }) => setDeliveryMethod(value)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Exchange Duration (in days)</label>
                    <input
                        type="number"
                        placeholder="Enter duration"
                        value={exchangeDuration}
                        onChange={(e) => setExchangeDuration(e.target.value)}
                    />
                </Form.Field>
                <Button type="submit" primary onClick={handleSubmit}>
                    Send Request
                </Button>
            </Form>
        </div>
    );
};

export default SendExchangeRequestPage;
