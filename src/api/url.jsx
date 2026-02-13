
import axios from "axios";

export const backend_URL = axios.create({
    baseURL: process.env.REACT_APP_API_URL || "https://echonote-taking-app.onrender.com",
});