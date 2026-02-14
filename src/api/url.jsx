import axios from "axios";

export const backend_URL = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://echonote-taking-app.onrender.com/api/v1/noteapp",
});