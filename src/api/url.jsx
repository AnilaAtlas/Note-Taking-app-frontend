import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://echonote-taking-app.onrender.com/api/v1/noteapp";

export const backend_URL = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

backend_URL.interceptors.request.use(
    (config) => {
        console.log("Making request to:", config.baseURL + config.url);
        return config;
    },
    (error) => Promise.reject(error)
);

console.log("API Base URL:", backend_URL.defaults.baseURL);
