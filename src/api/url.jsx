
import axios from "axios";

export const backend_URL = axios.create({
    baseURL: "http://localhost:4001/api/v1/noteapp/"
});