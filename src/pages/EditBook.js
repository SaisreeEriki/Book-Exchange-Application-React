import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Form, Button, Input, Message, Dropdown } from 'semantic-ui-react';
import axios from 'axios';

function EditBook() {
    const navigate = useNavigate();
    const { bookId } = useParams(); // Get bookId from the URL
    const [book, setBook] = useState({
        title: '',
        author: '',
        description: '',
        genreId: '',
        status: 'available', // Default status
    });
    const [genres, setGenres] = useState([]); // State to hold genres
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // Fetch book details
        const fetchBookDetails = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:3000/api/BookApplication/BookService/books/${bookId}`
                );
                setBook(response.data);
            } catch (err) {
                console.error('Error fetching book details: ', err);
                setErrorMessage('Failed to load book details.');
            }
        };

        // Fetch all genres
        const fetchGenres = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:3000/api/BookApplication/BookService/genres'
                );
                setGenres(response.data); // Assuming the response is a list of genres
            } catch (err) {
                console.error('Error fetching genres: ', err);
                setErrorMessage('Failed to load genres.');
            }
        };

        fetchBookDetails();
        fetchGenres();
    }, [bookId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBook((prevBook) => ({
            ...prevBook,
            [name]: value,
        }));
    };

    const handleGenreChange = async (e, { value }) => {
        // If a new genre is selected, handle creation or use the existing genre
        setBook((prevBook) => ({
            ...prevBook,
            genreId: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // If genre is a string (new genre), create a new genre
        if (typeof book.genreId === 'string') {
            try {
                const createGenreResponse = await axios.post(
                    'http://localhost:3000/api/BookApplication/BookService/genres',
                    { name: book.genreId } // Send the new genre to be created
                );
                // After genre is created, use the ID of the new genre
                book.genreId = createGenreResponse.data.id;
            } catch (err) {
                console.error('Error creating genre: ', err);
                setErrorMessage('Failed to create new genre.');
                return;
            }
        }

        // Now proceed with the book update
        try {
            const response = await axios.put(
                `http://localhost:3000/api/BookApplication/BookService/books/${bookId}`,
                {
                    ...book, // Send the whole updated book object
                    bookId: bookId, // Ensure bookId is included for update
                }
            );
            if (response.status === 200) {
                navigate('/home'); // Redirect to home page on success
            }
        } catch (err) {
            console.error('Error updating book: ', err);
            setErrorMessage('Failed to update book.');
        }
    };

    // Format genres for dropdown
    const genreOptions = genres.map((genre) => ({
        key: genre.id,
        text: genre.name,
        value: genre.id,
    }));

    // Optionally, handle the case where a user enters a new genre manually
    genreOptions.push({
        key: 'new',
        text: 'Add New Genre',
        value: 'new', // This will allow adding a new genre
    });

    return (
        <div>
            <h1>Edit Book</h1>
            {errorMessage && <Message error>{errorMessage}</Message>}
            <Form onSubmit={handleSubmit}>
                <Form.Field>
                    <label>Title</label>
                    <Input
                        name="title"
                        value={book.title}
                        onChange={handleInputChange}
                        placeholder="Book Title"
                    />
                </Form.Field>
                <Form.Field>
                    <label>Author</label>
                    <Input
                        name="author"
                        value={book.author}
                        onChange={handleInputChange}
                        placeholder="Book Author"
                    />
                </Form.Field>
                <Form.Field>
                    <label>Description</label>
                    <Input
                        name="description"
                        value={book.description}
                        onChange={handleInputChange}
                        placeholder="Book Description"
                    />
                </Form.Field>
                <Form.Field>
                    <label>Genre</label>
                    <Dropdown
                        name="genreId"
                        value={book.genreId}
                        onChange={handleGenreChange}
                        options={genreOptions}
                        selection
                        placeholder="Select or Add Genre"
                    />
                </Form.Field>
                <Form.Field>
                    <label>Status</label>
                    <select
                        name="status"
                        value={book.status}
                        onChange={handleInputChange}
                    >
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                    </select>
                </Form.Field>
                <Button primary type="submit">
                    Save Changes
                </Button>
            </Form>
        </div>
    );
}

export default EditBook;
