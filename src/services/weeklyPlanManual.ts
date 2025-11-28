import api from "./api";

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
  // Use shared axios instance so baseURL and Authorization header are consistent
  try {
    console.debug("[weeklyPlanManual] request payload:", request);
    const response = await api.post(`/FoodRecommendation/weekly-plan-manual`, request);
    console.debug("[weeklyPlanManual] response:", response?.data);
    return response.data as WeeklyPlanResponse;
  } catch (err: any) {
    console.debug("[weeklyPlanManual] error:", err?.response?.data || err.message || err);
    // Re-throw to allow caller to inspect the server error message
    throw err;
  }
};