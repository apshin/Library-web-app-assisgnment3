import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000', // Ensure this matches your backend server URL
    headers: {
        'Content-Type': 'application/json'
    }
});

export default instance;
