import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Header, Image, Button, Message, Form, Grid, Card } from 'semantic-ui-react';
import axios from 'axios';
import api from '../services/api'; // Assuming this is your API call setup

function UserProfile() {
    const [user, setUser] = useState({});
    const [profilePic, setProfilePic] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [userBooks, setUserBooks] = useState([]); // For books created by the logged-in user
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId'); // Get the userId from localStorage

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNo, setContactNo] = useState('');

    // Fetch user details
    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const response = await api.get(`/UserService/users/${userId}`);
                setUser(response.data);
                setName(response.data.name);
                setEmail(response.data.email);
                setContactNo(response.data.contactInfo);

                const picResponse = await api.get(`/UserService/users/${userId}/profilePic`);
                setProfilePic(picResponse.data || null);
            } catch (error) {
                console.error('Error fetching user profile:', error);
            }
        };

        const fetchUserBooks = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/BookApplication/BookService/books');
                const booksByUser = response.data.filter((book) => book.ownerId === userId);
                setUserBooks(booksByUser);
            } catch (err) {
                console.error('Error fetching user books:', err);
            }
        };

        fetchUserDetails();
        fetchUserBooks();
    }, [userId]);

    const handleSave = async () => {
        try {
            const updatedData = { name, email, contactNo };
            const response = await api.put(`/UserService/users/${userId}`, updatedData);
            setUser(response.data);
            setEditMode(false);
        } catch (error) {
            setErrorMessage('Error saving profile. Please try again.');
            console.error('Error saving profile:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await api.delete(`/UserService/users/${userId}`);
            localStorage.removeItem('userId');
            localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            setErrorMessage('Error deleting account. Please try again.');
            console.error('Error deleting account:', error);
        }
    };

    const handleEditBook = (bookId) => {
        if (bookId) {
            navigate(`/edit-book/${bookId}`);
        } else {
            console.error('Book ID not found for the selected book');
        }
    };

    const handleDeleteBook = async (bookId) => {
        if (!bookId) {
            console.error('Book ID not found for the selected book');
            return;
        }

        try {
            await axios.delete(`http://localhost:3000/api/BookApplication/BookService/books/${bookId}`);
            const updatedBooks = userBooks.filter((book) => book.bookId !== bookId);
            setUserBooks(updatedBooks);
        } catch (err) {
            console.error('Error deleting book: ', err);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Header as="h2" textAlign="center">User Profile</Header>
            {errorMessage && <Message error>{errorMessage}</Message>}
            <Table celled>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell><strong>Name</strong></Table.Cell>
                        <Table.Cell>
                            {editMode ? (
                                <Form.Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                />
                            ) : (
                                user.name
                            )}
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell><strong>Email</strong></Table.Cell>
                        <Table.Cell>
                            {editMode ? (
                                <Form.Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                />
                            ) : (
                                user.email
                            )}
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell><strong>Contact No.</strong></Table.Cell>
                        <Table.Cell>
                            {editMode ? (
                                <Form.Input
                                    type="tel"
                                    value={contactNo}
                                    onChange={(e) => setContactNo(e.target.value)}
                                    placeholder="Enter your contact number"
                                />
                            ) : (
                                user.contactInfo
                            )}
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>

            <div style={{ textAlign: 'center' }}>
                <Header as="h3">Profile Picture</Header>
                <Image
                    src={profilePic || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&s=200'}
                    size="small"
                    circular
                />
            </div>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                {editMode ? (
                    <>
                        <Button color="blue" onClick={handleSave}>Save</Button>
                        <Button color="grey" onClick={() => setEditMode(false)}>Cancel</Button>
                    </>
                ) : (
                    <Button color="blue" onClick={() => setEditMode(true)}>Edit Profile</Button>
                )}
                <Button color="red" onClick={handleDelete}>Delete Account</Button>
            </div>

            {/* User's Books */}
            <div style={{ marginTop: '40px' }}>
                <Header as="h3">Your Books</Header>
                <Grid>
                    {userBooks.length > 0 ? (
                        userBooks.map((book) => (
                            <Grid.Column key={book.bookId} width={4}>
                                <Card>
                                    <Image 
                                        src="https://images.wallpaperscraft.com/image/single/book_cup_saucer_80512_1280x720.jpg" 
                                        wrapped 
                                        ui={false} 
                                    />
                                    <Card.Content>
                                        <Card.Header>{book.title}</Card.Header>
                                        <Card.Meta>{book.author}</Card.Meta>
                                        <Card.Description>{book.description}</Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <Button
                                            primary
                                            onClick={() => handleEditBook(book.bookId)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            color="red"
                                            onClick={() => handleDeleteBook(book.bookId)}
                                        >
                                            Delete
                                        </Button>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                        ))
                    ) : (
                        <p>No books created by you</p>
                    )}
                </Grid>
            </div>
        </div>
    );
}

export default UserProfile;
