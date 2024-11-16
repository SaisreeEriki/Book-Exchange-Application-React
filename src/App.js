import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import UserProfile from './pages/UserProfile';
import UsersList from './pages/UsersList';
import ResetPassword from './pages/ResetPassword';
import CreateBook from './pages/CreateBook';
import EditBook from './pages/EditBook';
import SendExchangeRequestPage from './pages/SendExchangeRequestPage';
import ViewExchangeRequestsPage from './pages/ViewExchangeRequestsPage';
import NotificationPage from './pages/NotificationPage';
import { NotificationProvider } from './pages/NotificationContext';
import NotificationPopup from './pages/NotificationPopup';


function App() {
    return (
        <NotificationProvider>
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/home" element={<Home />} />
                <Route path="/profile" element={<UserProfile />} />
                <Route path="/users" element={<UsersList />} />
                <Route path="/reset_password" element={<ResetPassword />} />
                <Route path="/create-book" element={<CreateBook />} />
                <Route path="/edit-book/:bookId" element={<EditBook />} />
                <Route path="/send-exchange-request" element={<SendExchangeRequestPage />} />
                <Route path="/view-exchange-requests" element={<ViewExchangeRequestsPage />} />
                <Route path="/notifications" element={<NotificationPage />} />
                <Route path="/notifications/polling" element={<NotificationProvider />} />
                <Route path="/notifications/popup" element={<NotificationPopup />} />
            </Routes>
        </Router>
        </NotificationProvider>
    );
}

export default App;
