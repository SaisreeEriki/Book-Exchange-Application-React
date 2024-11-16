import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { authToken } = useContext(AuthContext);

    if (!authToken) {
        // Redirect to login page if not authenticated
        return <Navigate to="/login" />;
    }

    return children;  // Render the child components if authenticated
};

export default ProtectedRoute;
