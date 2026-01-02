import axios from 'axios';

const api = axios.create({
    // Root URL only
    baseURL: "https://quizapp-fullstack-n5ct.onrender.com", 
});

export default api;