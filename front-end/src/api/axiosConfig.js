// src/api/axiosConfig.js
import axios from 'axios';

// Configuration de l'instance Axios
const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Remplacez par l'URL de votre serveur si nécessaire
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;
