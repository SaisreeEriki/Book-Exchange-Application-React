import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
    const { authToken } = useContext(AuthContext);

    return (
        <nav>
            <Link to="/">Home</Link>
            {!authToken ? (
                <>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </>
            ) : null}
        </nav>
    );
}

export default Navbar;
