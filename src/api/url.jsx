import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "https://echonote-taking-app.onrender.com/api/v1/noteapp";

// Create axios instance
const backend_URL = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

// Request interceptor for logging
backend_URL.interceptors.request.use(
    (config) => {
        console.log(` Making ${config.method.toUpperCase()} request to:`, config.baseURL + config.url);
        console.log('Request data:', config.data);
        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for logging
backend_URL.interceptors.response.use(
    (response) => {
        console.log('✅ Response received:', response.status, response.data);
        return response;
    },
    (error) => {
        console.error('❌ Response error:', error.response?.status, error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// API Functions
export const getNotes = async () => {
    try {
        const response = await backend_URL.get('/getnotes');
        return response.data;
    } catch (error) {
        console.error('Error in getNotes:', error.response?.data || error.message);
        throw error;
    }
};

export const createNote = async (noteData) => {
    try {
        console.log('Creating note with data:', noteData);
        const response = await backend_URL.post('/createnote', noteData);
        return response.data;
    } catch (error) {
        console.error('Error in createNote:', error.response?.data || error.message);
        throw error;
    }
};

export const updateNote = async (id, noteData) => {
    try {
        console.log(`Updating note ${id} with data:`, noteData);
        const response = await backend_URL.put(`/updatenote/${id}`, noteData);
        return response.data;
    } catch (error) {
        console.error('Error in updateNote:', error.response?.data || error.message);
        throw error;
    }
};

export const deleteNote = async (id) => {
    try {
        console.log(`Deleting note: ${id}`);
        const response = await backend_URL.delete(`/deletenote/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error in deleteNote:', error.response?.data || error.message);
        throw error;
    }
};

export default backend_URL;
