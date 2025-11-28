import api from "./api";

export const createMeasurement = async (data: {
  user_id: number;
  measurement_value: number;
  created_at?: string;
  note?: string;
  moment?: string;
}) => {
  return api.post("/GlucoseMeasurements/create", data);
};

export const updateMeasurement = async (data: {
  id: number;
  measurement_value: number;
  created_at?: string;
  note?: string;
  moment?: string;
}) => {
  return api.post("/GlucoseMeasurements/update", data);
};

export const deleteMeasurement = async (id: number) => {
  return api.post("/GlucoseMeasurements/delete", { id });
};

export const getAllMeasurements = async () => {
  return api.post("/GlucoseMeasurements/getglucosemeasurements");
};

export const getMeasurementsByUser = async (user_id: number) => {
  return api.post("/GlucoseMeasurements/getbyuser", { user_id });
};
