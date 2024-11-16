import React, { useState } from 'react';
import { Form, Button, Message, Header } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api'; // Your API setup

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Add this line to get navigate function

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/userService/requestPasswordReset', { email });
            if (response.status === 200) {
                setMessage('Reset link sent to your email.');
                setTimeout(() => {
                    navigate('/login'); // Redirect to login after success
                }, 2000);
                setErrorMessage(''); // Clear error message if successful
            }
        } catch (error) {
            setErrorMessage('Invalid email. Please try again.');
            setMessage(''); // Clear success message if error occurs
        }
    };

    return (
        <div className="reset-password-container">
            <Header as="h2" textAlign="center">Reset Password</Header>
            {message && <Message success>{message}</Message>}
            {errorMessage && <Message error>{errorMessage}</Message>}
            <Form onSubmit={handleReset}>
                <Form.Input
                    label="Enter your email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                />
                <Button color="blue" fluid type="submit">Send Reset Link</Button>
            </Form>
        </div>
    );
}

export default ResetPassword;
