import { HTTP } from "../config/axios";
import { URL_PATHS } from "../constants/urlPaths";
import { TSignInSchema, TSignUpRequest } from "../models/Auth";
import { TLoginTokens } from "../models/Common";

export const AUTH_SERVICE = {
  async loginWeb(data: TSignInSchema): Promise<TLoginTokens> {
    const { data: response } = await HTTP.post<TLoginTokens>(
      URL_PATHS.AUTH.LOGIN_WEB,
      data
    );

    return response;
  },

  async signUp(data: TSignUpRequest) {
    const { data: response } = await HTTP.post(URL_PATHS.AUTH.SIGN_UP, data);
    return response;
  },
};