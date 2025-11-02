import { ERROR_TEXTS } from "./errorTexts";

type TError = {
  [x: string]: {
    code: string;
    name: string;
    message: ERROR_TEXTS;
  };
};

export const ERRORS: TError = {
  INTERNAL_SERVER_ERROR: {
    code: "E000",
    name: "INTERNAL_SERVER_ERROR",
    message: ERROR_TEXTS.INTERNAL_SERVER_ERROR,
  },
  UNPROCESSABLE_ENTITY: {
    code: "422",
    name: "UNPROCESSABLE_ENTITY",
    message: ERROR_TEXTS.INTERNAL_SERVER_ERROR,
  },
  E003: {
    code: "E003",
    name: "EXISTING_EMAIL",
    message: ERROR_TEXTS.EXISTING_EMAIL,
  },
  E006: {
    code: "E006",
    name: "INVALID_PASSWORDS_MATCH",
    message: ERROR_TEXTS.INVALID_PASSWORDS_MATCH_ALERT,
  },

  E007: {
    code: "E007",
    name: "INVALID_CODE",
    message: ERROR_TEXTS.INVALID_CODE,
  },
  E008: {
    code: "E008",
    name: "ALREADY_USED_CODE",
    message: ERROR_TEXTS.EXISTING_CODE,
  },
  E010: {
    code: "E010",
    name: "USER_DOES_NOT_EXIST",
    message: ERROR_TEXTS.UNEXISTING_USER,
  },
  E011: {
    code: "E011",
    name: "USER_NOT_VERIFIED",
    message: ERROR_TEXTS.USER_NOT_VERIFIED,
  },
  E019: {
    code: "E019", 
    name: "RESEND_CODE_ERROR",
    message: ERROR_TEXTS.RESEND_CODE_ERROR,
  },
};
