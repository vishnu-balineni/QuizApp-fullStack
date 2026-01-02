import axios from 'axios';

const api = axios.create({
    baseURL: "http://localhost:8080/api/quiz", // Back to local
});

export default api;