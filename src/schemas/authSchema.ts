import * as z from "zod";
import {
  MAX_LENGTH_MESSAGE,
  MIN_LENGTH_MESSAGE,
  REQUIRED_FIELD,
} from "./common";
import { REGEX_PATTERNS } from "../utils/regexPatterns";
import { ERROR_TEXTS } from "../constants/errors/errorTexts";

export const signUpSchema = z.object({
  name: REQUIRED_FIELD.min(4, MIN_LENGTH_MESSAGE(4))
    .max(30, MAX_LENGTH_MESSAGE(30))
    .regex(REGEX_PATTERNS.LETTERS, ERROR_TEXTS.INVALID_LETTERS_FIELD),
  last_name: REQUIRED_FIELD.min(2, MIN_LENGTH_MESSAGE(2))
    .max(30, MAX_LENGTH_MESSAGE(30))
    .regex(REGEX_PATTERNS.LETTERS, ERROR_TEXTS.INVALID_LETTERS_FIELD),
  dd: REQUIRED_FIELD.regex(/^(0?[1-9]|[12][0-9]|3[01])$/, "Día inválido"),
  mm: REQUIRED_FIELD.regex(/^(0?[1-9]|1[0-2])$/, "Mes inválido"),
  yy: REQUIRED_FIELD.regex(/^\d{4}$/, "Año debe tener 4 dígitos"),
  email: REQUIRED_FIELD.regex(
    REGEX_PATTERNS.EMAIL,
    ERROR_TEXTS.INVALID_EMAIL_FIELD,
  ).max(40, MAX_LENGTH_MESSAGE(40)),
  password: REQUIRED_FIELD.regex(
    REGEX_PATTERNS.PASSWORD,
    ERROR_TEXTS.INVALID_PASSWORD_FIELD,
  ),
  confirmPassword: REQUIRED_FIELD.regex(
    REGEX_PATTERNS.PASSWORD,
    ERROR_TEXTS.INVALID_PASSWORD_FIELD,
  ),
})
.refine((data) => data.password === data.confirmPassword, {
  message: ERROR_TEXTS.INVALID_PASSWORDS_MATCH_FIELD,
  path: ["confirmPassword"],
})
.refine((data) => {
  const day = parseInt(data.dd);
  const month = parseInt(data.mm);
  const year = parseInt(data.yy);
  
  const date = new Date(year, month - 1, day);
  return date.getDate() === day && date.getMonth() === month - 1 && date.getFullYear() === year;
}, {
  message: "Fecha de nacimiento inválida",
  path: ["dd"],
})
.refine((data) => {
  const day = parseInt(data.dd);
  const month = parseInt(data.mm);
  const year = parseInt(data.yy);
  
  const today = new Date();
  const age = today.getFullYear() - year;
  const hasHadBirthdayThisYear = today >= new Date(today.getFullYear(), month - 1, day);
  
  return age > 13 || (age === 13 && hasHadBirthdayThisYear);
}, {
  message: "Debes ser mayor de 13 años",
  path: ["dd"],
});

export const signInSchema = z.object({
  email: REQUIRED_FIELD.regex(
    REGEX_PATTERNS.EMAIL,
    ERROR_TEXTS.INVALID_EMAIL_FIELD,
  ).max(40, MAX_LENGTH_MESSAGE(40)),
  password: REQUIRED_FIELD.regex(
    REGEX_PATTERNS.PASSWORD,
    ERROR_TEXTS.INVALID_PASSWORD_FIELD,
  ),
});

export const verificationCodeSchema = z.object({
  code: z
    .string()
    .length(4, ERROR_TEXTS.GENERIC_INVALID_FIELD)
    .regex(/^\d{4}$/, ERROR_TEXTS.GENERIC_INVALID_FIELD),
});

export const requestPasswordResetSchema = z.object({
  email: REQUIRED_FIELD.regex(
    REGEX_PATTERNS.EMAIL,
    ERROR_TEXTS.INVALID_EMAIL_FIELD,
  ).max(40, MAX_LENGTH_MESSAGE(40)),
});

export const connectionCodeSchema = z.object({
  token: z.string(),
  code: z
    .string()
    .length(4, ERROR_TEXTS.GENERIC_INVALID_FIELD)
    .regex(/^\d{4}$/, ERROR_TEXTS.GENERIC_INVALID_FIELD),
});