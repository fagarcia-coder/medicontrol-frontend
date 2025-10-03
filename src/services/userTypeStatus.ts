import api from "./api";

export const getUserTypes = async () => {
  return api.post("/usertype/getusertype");
};

export const createUserType = async (description: string) => {
  return api.post("/usertype/create", { description });
};

export const getUserStatus = async () => {
  return api.post("/userstatus/getuserstatus");
};

export const createUserStatus = async (description: string) => {
  return api.post("/userstatus/create", { description });
};
