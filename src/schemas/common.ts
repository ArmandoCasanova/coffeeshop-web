import { ERROR_TEXTS } from "../constants/errors/errorTexts";
import * as z from "zod";

export const REQUIRED_FIELD = z
  .string() 
  .trim()
  .min(1, { message: ERROR_TEXTS.REQUIRED_FIELD }); 

export const MIN_VALUE_MESSAGE = (min: number) =>
  `El valor mínimo del campo es ${min}`;

export const MIN_LENGTH_MESSAGE = (min: number) =>
  `El campo debe ser mayor a ${min} caracteres`;

export const MAX_LENGTH_MESSAGE = (min: number) =>
  `El campo debe ser menor a ${min} caracteres`;