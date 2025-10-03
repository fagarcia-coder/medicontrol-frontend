import api from "./api";

export const login = async (data: { username: string; password: string }) => {
  // Cambia a /user/login si tu backend lo requiere
  return api.post("/auth/login", data);
};

export const getCurrentUser = async (token: string) => {
  return api.post("/auth/me", {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
