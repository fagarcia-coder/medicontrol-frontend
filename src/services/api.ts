import axios from "axios";

const api = axios.create({
  // Aquí debemos si o si porner la URL del backend que ha hecho Dennis en Flask
  baseURL: "http://127.0.0.1:5050/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
