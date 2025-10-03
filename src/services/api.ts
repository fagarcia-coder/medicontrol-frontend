import axios from "axios";

const api = axios.create({
  // Aquí debemos si o si porner la URL del backend que ha hecho Dennis en Flask
  baseURL: "http://3.129.110.135/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
