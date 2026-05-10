import axios from "axios";

// Créer une instance axios pour les appels API
const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
    withCredentials: true,
});

// Créer une instance axios pour CSRF
const csrfClient = axios.create({
    baseURL: "http://127.0.0.1:8000",
    withCredentials: true,
});

// Ajouter le token JWT à chaque requête
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        // Ajouter le token dans l'en-tête Authorization
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Récupérer le token CSRF (nécessaire pour Laravel)
export const getCsrfCookie = () => csrfClient.get("/sanctum/csrf-cookie");

// Exporter l'instance api
export default api;