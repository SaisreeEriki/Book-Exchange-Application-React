import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Dropdown, Container, Card, Image, Button, Input, Grid } from 'semantic-ui-react';
import axios from 'axios';

function Home() {
    const navigate = useNavigate();
    const [books, setBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredBooks, setFilteredBooks] = useState([]);

    // Fetch books on page load
    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/BookApplication/BookService/books');
                setBooks(response.data);
                setFilteredBooks(response.data);
            } catch (err) {
                console.error('Error fetching books: ', err);
            }
        };

        fetchBooks();
    }, []);

    // Handle search input change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        filterBooks(e.target.value);
    };

    // Filter books based on search query
    const filterBooks = (query) => {
        if (!query) {
            setFilteredBooks(books);
            return;
        }
        const lowercasedQuery = query.toLowerCase();
        const filtered = books.filter(
            (book) =>
                book.title.toLowerCase().includes(lowercasedQuery) ||
                book.genre?.genreName.toLowerCase().includes(lowercasedQuery)
        );
        setFilteredBooks(filtered);
    };

    const handleDropdownChange = (e, { value }) => {
        if (value === 'profile') {
            navigate('/profile');
        } else if (value === 'users') {
            navigate('/users');
        } else if (value === 'logout') {
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
            navigate('/login');
        } else if (value === 'create-book') {
            navigate('/create-book');
        } else if (value === 'edit-book') {
            navigate('/edit-book/:bookId'); // :bookId will be dynamic when editing a book
        } else if (value === 'send-exchange-request') {
            navigate('/send-exchange-request');
        } else if (value === 'view-exchange-requests') {
            navigate('/view-exchange-requests');
        } else if (value === 'notifications') {
            navigate('/notifications');
        }
    };
    
    const dropdownOptions = [
        { key: 'profile', text: 'User Profile', value: 'profile' },
        { key: 'users', text: 'Users List', value: 'users' },
        { key: 'logout', text: 'Logout', value: 'logout' },
        { key: 'create-book', text: 'Create Book', value: 'create-book' },
        { key: 'edit-book', text: 'Edit Book', value: 'edit-book' },
        { key: 'send-exchange-request', text: 'Send Exchange Request', value: 'send-exchange-request' },
        { key: 'view-exchange-requests', text: 'View Exchange Requests', value: 'view-exchange-requests' },
        { key: 'notifications', text: 'Notifications', value: 'notifications' },
    ];

    // Navigate to Create Book page
    const handleCreateBook = () => {
        navigate('/create-book');
    };

    return (
        <div>
            <Container>
                <h1>HOME</h1>
                <Menu>
                    <Menu.Item header>Book Exchange</Menu.Item>
                    <Dropdown
                        item
                        text="Menu"
                        options={dropdownOptions}
                        onChange={handleDropdownChange}
                        simple
                    />
                </Menu>

                {/* Create Book Button */}
                <Button primary onClick={handleCreateBook} style={{ marginBottom: '20px' }}>
                    Create Book
                </Button>

                {/* Search Bar */}
                <Input
                    icon="search"
                    placeholder="Search by title or genre..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    style={{ marginBottom: '20px' }}
                />

                {/* Book Listings */}
                <Grid>
                    {filteredBooks.length > 0 ? (
                        filteredBooks.map((book) => (
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
                                </Card>
                            </Grid.Column>
                        ))
                    ) : (
                        <p>No books found</p>
                    )}
                </Grid>
            </Container>
        </div>
    );
}

export default Home;
