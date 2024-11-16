import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Input, TextArea } from 'semantic-ui-react';
import axios from 'axios';

function CreateBook() {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [description, setDescription] = useState('');
    const [genre, setGenre] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const newBook = {
            title,
            author,
            description,
            genre,
            ownerId: localStorage.getItem('userId'), // Assuming userId is stored in localStorage
        };
    
        try {
            // Check if genre exists
            let genreResponse = await axios.get(`http://localhost:3000/api/BookApplication/BookService/genres?genreName=${genre}`);
            
            // If genre doesn't exist, create it
            if (genreResponse.data.length === 0) {
                await axios.post('http://localhost:3000/api/BookApplication/BookService/genres', { genreName: genre });
            }
    
            // Create book after ensuring the genre exists
            await axios.post('http://localhost:3000/api/BookApplication/BookService/books', newBook);
            navigate('/home'); // Redirect to home page after creating book
        } catch (err) {
            console.error('Error creating book: ', err);
        }
    };
    

    return (
        <div>
            <h1>Create a New Book</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Field>
                    <label>Title</label>
                    <Input
                        type="text"
                        placeholder="Book Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Author</label>
                    <Input
                        type="text"
                        placeholder="Author Name"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Description</label>
                    <TextArea
                        placeholder="Book Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Field>
                <Form.Field>
                    <label>Genre</label>
                    <Input
                        type="text"
                        placeholder="Genre"
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                    />
                </Form.Field>
                <Button primary type="submit">Create Book</Button>
            </Form>
        </div>
    );
}

export default CreateBook;
