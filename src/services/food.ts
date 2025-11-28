import api from "./api";

export const createFoodRecommendation = async (data: {
  level_glucose_id: number;
  recommendation: string;
  type_food_id: number;
}) => {
  return api.post("/FoodRecommendation/create_new", data);
};

export const deleteFoodRecommendation = async (recommendation_id: number) => {
  return api.post("/FoodRecommendation/delete_food", { recommendation_id });
};

export const updateFoodRecommendation = async (data: {
  recommendation_id: number;
  level_glucose_id: number;
  recommendation: string;
  type_food_id: number;
}) => {
  return api.post("/FoodRecommendation/update_food", data);
};

export const getFoodByLevel = async (level_glucose_id: number) => {
  return api.get(`/FoodRecommendation/by_level/${level_glucose_id}`);
};

export const getFoodByUser = async (user_id: number) => {
  // Attempt to fetch recommendations assigned to a specific user
  return api.get(`/FoodRecommendation/by_user/${user_id}`);
};
