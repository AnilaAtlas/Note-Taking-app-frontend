import axios from "axios";

export const backend_URL = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:4001/api/v1/noteapp",
});