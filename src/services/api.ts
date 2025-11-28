import axios from "axios";

const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const baseURL = isLocalhost ? '/api' : 'http://3.129.110.135/api';

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
  },
});

export default api;
