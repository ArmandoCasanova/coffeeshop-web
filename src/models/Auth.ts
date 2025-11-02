import {
  signUpSchema,
  signInSchema,
  verificationCodeSchema,
  requestPasswordResetSchema,
  connectionCodeSchema,
} from "../schemas/authSchema";
import * as z from "zod";

export type TSignUp = {
  name: string;
  lastName: string;
  birthDate: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type TSignUpRequest = {
  name: string;
  last_name: string;
  birth_date: string;
  email: string;
  password: string;
  role: string
};

export type TSignIn = {
  email: string;
  password: string;
};

export type TVerificationCode = {
  code: string;
};

export type TRequestPasswordReset = {
  email: string;
};

export type TSignUpSchema = z.infer<typeof signUpSchema>;
export type TSignInSchema = z.infer<typeof signInSchema>;
export type TVerificationCodeSchema = z.infer<typeof verificationCodeSchema>;
export type TRequestPasswordResetSchema = z.infer<
  typeof requestPasswordResetSchema
>;
export type TConnectionCodeSchema = z.infer<typeof connectionCodeSchema>;