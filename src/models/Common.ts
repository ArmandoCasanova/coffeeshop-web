import { Control } from "react-hook-form";

export type ReactHookFormControl = Control<any, object>;

export type TSingleDataResponse<T> = {
  status: number;
  statusMessage: string;
  data: T;
};
export type TNoContentStatusResponse = {
  status: number;
};

export type TLoginTokens = {
  status: string;
  accessToken: string;
  refreshToken: string;
  rol: "ADMIN" | "CUSTOMER" | "STAFF";
};

export type TSignUpToken = {
  user_id: number;
  rol: "ADMIN" | "CUSTOMER" | "STAFF";
  name: string;
  email: string;
  points: number;
  is_verified: boolean;
  createdAt: string;
  updatedAt: string;
};



