// services/user.ts

import { HTTP } from "../config/axios";
import { URL_PATHS } from "../constants/urlPaths";

export type TUpdateProfileSchema = {
  userId: string;
  name: string;
  lastName: string;
};

export type TChangePasswordSchema = {
  userId: string;
  currentPassword: string;
  newPassword: string;
};

const updateProfile = async (data: TUpdateProfileSchema) => {
  const { userId, ...profileData } = data;
  console.log("➡️ Llamando a HTTP.put con:", URL_PATHS.USERS.UPDATE_PROFILE(userId), profileData);
  const response = await HTTP.put(URL_PATHS.USERS.UPDATE_PROFILE(userId), profileData);
  console.log("⬅️ Respuesta backend:", response.data);
  return response.data;
};

const changePassword = async (data: TChangePasswordSchema) => {
  const { userId, ...passwordData } = data;
  console.log("➡️ Llamando a HTTP.post con:", URL_PATHS.USERS.CHANGE_PASSWORD(userId), passwordData);
  const response = await HTTP.post(URL_PATHS.USERS.CHANGE_PASSWORD(userId), passwordData);
  console.log("⬅️ Respuesta backend:", response.data);
  return response.data;
};

export const USER_SERVICE = {
  updateProfile,
  changePassword,
};
