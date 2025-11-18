import axios from "axios";

// Opción 1: Si tienes .env
const API_BASE_URL = "http://localhost:5050"; // Hardcodea la URL

// Opción 2: Si prefieres hardcodear la URL
// const API_BASE_URL = "http://localhost:5050";

export interface WeeklyPlan {
  Lunes: Record<string, string>;
  Martes: Record<string, string>;
  Miércoles: Record<string, string>;
  Jueves: Record<string, string>;
  Viernes: Record<string, string>;
  Sábado: Record<string, string>;
  Domingo: Record<string, string>;
}

export interface WeeklyPlanResponse {
  level_glucose_id: number;
  glucose_level: string;
  week: WeeklyPlan;
}

export interface WeeklyPlanRequest {
  level_glucose_id: number;
}

export const getWeeklyPlanManual = async (request: WeeklyPlanRequest): Promise<WeeklyPlanResponse> => {
    const token = localStorage.getItem('token'); // ← Obtén el token
  
    const response = await axios.post(`${API_BASE_URL}/api/FoodRecommendation/weekly-plan-manual`, request, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, // ← Envía el token
      },
    });
  
    return response.data;
  };