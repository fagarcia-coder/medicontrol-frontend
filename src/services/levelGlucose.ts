import api from "./api";

export const createLevelGlucose = async (data: {
  description: string;
  min_value: number;
  max_value: number;
}) => {
  return api.post("/LevelGlucose/create_new", data);
};

export const updateLevelGlucose = async (data: {
  level_id: number;
  description: string;
  min_value: number;
  max_value: number;
}) => {
  return api.post("/LevelGlucose/update_levels", data);
};

export const deleteLevelGlucose = async (level_id: number) => {
  return api.post("/LevelGlucose/delete_level", { level_id });
};
