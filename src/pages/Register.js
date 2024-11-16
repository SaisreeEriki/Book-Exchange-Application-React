import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Header, Message } from 'semantic-ui-react';
import api from '../services/api'; // Assuming this is your api call setup

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contactNo, setContactNo] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/userService/users', { name, email, contactNo, password });
            if (response.status === 201) {
                // After successful registration, redirect to the login page
                navigate('/login');
            }
        } catch (error) {
            setErrorMessage('Registration failed. Please try again.');
            console.error('Registration Error:', error);
        }
    };

    return (
        <div className="register-container">
            <Header as="h2" textAlign="center">Register</Header>
            <Form onSubmit={onSubmit} className="register-form">
                <Form.Input
                    label="Name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required
                />
                <Form.Input
                    type="email"
                    label="Email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />
                <Form.Input
                    type="tel"
                    label="Contact No."
                    name="contactNo"
                    value={contactNo}
                    onChange={(e) => setContactNo(e.target.value)}
                    placeholder="Enter your contact number"
                    required
                />
                <Form.Input
                    type="password"
                    label="Password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                />
                {errorMessage && <Message error>{errorMessage}</Message>}
                <Button color="blue" fluid type="submit">Submit</Button>
            </Form>
        </div>
    );
}

export default Register;
