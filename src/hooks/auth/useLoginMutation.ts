import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { AUTH_SERVICE } from "../../services/auth";
import { useSnackbar } from "../useSnackbar";
import { TSignInSchema } from "../../models/Auth";
import { TLoginTokens } from "../../models/Common";
import { useAuth } from "../../context/AuthContext";

export const useLoginMutation = () => {
  const { showSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { login } = useAuth();

  return useMutation<TLoginTokens, unknown, TSignInSchema>({
    mutationFn: AUTH_SERVICE.loginWeb,

    onSuccess: (data) => {
      login(data);
      const { access_token, refresh_token, role } = data;

      if (access_token) {
        localStorage.setItem("accessToken", access_token);
      }
      if (refresh_token) {
        localStorage.setItem("refreshToken", refresh_token);
      }

      if (role === "admin" || role === "staff") {
        navigate("/dashboard", { replace: true });
      }

      showSnackbar({ type: "success", message: "Login exitoso" });
    },

    onError: () => {
      showSnackbar({ type: "error", message: "Correo o contraseña incorrectos" });
    },
  });
};