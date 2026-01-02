import axios from 'axios';

const api = axios.create({
    baseURL: "https://quizapp-fullstack-n5ct.onrender.com/api/quiz",
});

export default api;