import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api/BookApplication', // Replace with your backend API URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
