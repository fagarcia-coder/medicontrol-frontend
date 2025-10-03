import api from "./api";

export const getUsers = async () => {
  return api.post("/user/getusers");
};

export const createUser = async (data: {
  name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  user_type_id: number;
  user_status_id: number;
  age: number;
  sex: string;
}) => {
  return api.post("/user/create", data);
};

export const deactivateUser = async (data: { id: number }) => {
  return api.post("/user/deactivate", data);
};

export const updateUser = async (data: {
  id: number;
  name: string;
  last_name: string;
  username: string;
  email: string;
  user_type_id: number;
  user_status_id: number;
  age: number;
  sex: string;
  password?: string;
}) => {
  return api.post("/user/update", data);
};

export const updateUserPassword = async (data: {
  id: number;
  old_password: string;
  new_password: string;
}) => {
  return api.post("/user/update_password", data);
};
