// services/user.ts

import { HTTP } from "../config/axios";
import { URL_PATHS } from "../constants/urlPaths";

export type TUpdateProfileSchema = {
  name: string;
  lastName: string;
};

export type TChangePasswordSchema = {
  currentPassword: string;
  newPassword: string;
};

const updateProfile = async (data: TUpdateProfileSchema) => {
  console.log("➡️ Llamando a HTTP.put con:", URL_PATHS.USERS.UPDATE_ME, data);
  const response = await HTTP.put(URL_PATHS.USERS.UPDATE_ME, data);
  console.log("⬅️ Respuesta backend:", response.data);
  return response.data;
};

const changePassword = async (data: TChangePasswordSchema) => {
  console.log("➡️ Llamando a HTTP.put con:", URL_PATHS.USERS.UPDATE_MY_PASSWORD, data);
  const response = await HTTP.put(URL_PATHS.USERS.UPDATE_MY_PASSWORD, data);
  console.log("⬅️ Respuesta backend:", response.data);
  return response.data;
};

export const USER_SERVICE = {
  updateProfile,
  changePassword,
};
