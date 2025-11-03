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

      // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
      // Usamos camelCase para que coincida con la respuesta de tu API
      const { accessToken, refreshToken, role } = data;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
      // --- FIN DE LA CORRECCIÓN ---

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