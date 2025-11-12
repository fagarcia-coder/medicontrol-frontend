import axios from "axios";

const api = axios.create({
  // No tocar ya, aquí debemos si o si porner la URL del backend en la instancia que ha levantado Dennis en AWS
  // No olvidar el /api al final
  // No cambiar a localhost ni a nada, debe ser la IP pública que Dennis ha puesto
  // --- IGNORE ---
  // URL PROD baseURL: "http://3.129.110.135/api",
  baseURL: "http://127.0.0.1:5050/api",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${localStorage.getItem("token")}`,
  },
});

export default api;
