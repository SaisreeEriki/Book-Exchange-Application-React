import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Header, Message } from 'semantic-ui-react';
import api from '../services/api'; // Assuming this is your api call setup

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/userService/login', { email, password });
            const { token, userId } = response.data;
            
            // Save token and userId for future use
            localStorage.setItem('token', token);
            // If userId is returned from the API in future, save that too
            localStorage.setItem('userId', userId);

            // Redirect to the Home page on successful login
            navigate('/home');
        } catch (error) {
            setErrorMessage('Invalid credentials, please try again.');
            console.error('Login Error:', error);
        }
    };

    return (
        <div className="login-container">
            <Header as="h2" textAlign="center">Login</Header>
            <Form onSubmit={onSubmit} className="login-form">
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
                    type="password"
                    label="Password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                />
                {errorMessage && <Message error>{errorMessage}</Message>}
                <Button color="blue" fluid type="submit">Login</Button>
                <Button basic color="blue" fluid onClick={() => navigate('/register')}>
                    Register
                </Button>
            </Form>
            <Button
                color="grey"
                fluid
                onClick={() => navigate('/reset_password')} // Redirect to reset password page
            >
                Forgot Password?
            </Button>
        </div>
    );
}

export default Login;
