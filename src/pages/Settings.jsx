import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { FiUser, FiShield, FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { USER_SERVICE } from "../services/user";
import { useSnackbar } from "../hooks/useSnackbar";

export default function Ajustes() {
  const { user, setUser, logout } = useAuth();
  const { showSnackbar } = useSnackbar();

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setLastName(user.lastName || user.last_name || "");
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: USER_SERVICE.updateProfile,
    onSuccess: (response) => {
      console.log("MUTACIÓN EXITOSA. Datos recibidos:", response);

      const updatedUser = {
        ...user,
        name: response.name,
        lastName: response.lastName,
      };

      showSnackbar({ type: "success", message: "Perfil actualizado" });
      setUser(updatedUser);
      localStorage.setItem("coffeeUser", JSON.stringify(updatedUser));

      console.log("Lógica de onSuccess completada.");
    },
    onError: (error) => {
      console.error("MUTACIÓN FALLIDA/RECHAZADA. Error:", error);
      const message =
        error?.response?.data?.detail?.statusMessage || 
        error?.response?.data?.message || 
        "Error al actualizar el perfil";

      showSnackbar({ type: "error", message });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: USER_SERVICE.changePassword,
    onSuccess: () => {
      console.log("MUTACIÓN EXITOSA.");
      showSnackbar({ type: "success", message: "Contraseña actualizada correctamente" });
      setCurrentPassword("");
      setNewPassword("");
    },
    onError: (error) => {
      console.error("MUTACIÓN FALLIDA/RECHAZADA. Error:", error);
      const message =
        error?.response?.data?.detail?.statusMessage || 
        error?.response?.data?.message || 
        "La contraseña actual es incorrecta";
      showSnackbar({ type: "error", message });
    },
  });

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    if (!user?.userId) {
      showSnackbar({ type: "error", message: "Usuario no autenticado" });
      return;
    }
    const payload = { userId: user.userId, name, lastName };
    console.log("Enviando updateProfile:", payload);
    updateProfileMutation.mutate(payload);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (!user?.userId) {
      showSnackbar({ type: "error", message: "Usuario no autenticado" });
      return;
    }
    
    if (!currentPassword || !newPassword) {
      showSnackbar({ type: "error", message: "Por favor completa todos los campos" });
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    if (!passwordRegex.test(newPassword)) {
      showSnackbar({ 
        type: "error", 
        message: "La contraseña debe tener 8-20 caracteres, incluir mayúscula, minúscula, número y carácter especial (@$!%*?&)" 
      });
      return;
    }

    const payload = { userId: user.userId, currentPassword, newPassword };
    console.log("Enviando changePassword:", payload);
    changePasswordMutation.mutate(payload);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-brown-600 mb-8">
        Ajustes
      </h1>

      <div className="space-y-8 max-w-4xl mx-auto">
        <form
          onSubmit={handleProfileSubmit}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
              <FiUser className="text-brown-400" />
              <span>Perfil de Usuario</span>
            </h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Apellido
                </label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300"
                />
              </div>
            </div>
          </div>
          <div className="p-6 bg-gray-50 text-right">
            <button
              type="submit"
              disabled={updateProfileMutation.isPending}
              className="px-6 py-3 bg-brown-300 text-white font-semibold rounded-lg hover:bg-brown-400 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              {updateProfileMutation.isPending
                ? "Guardando..."
                : "Guardar Cambios"}
            </button>
          </div>
        </form>

        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
              <FiShield className="text-brown-400" />
              <span>Seguridad</span>
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label
                htmlFor="current-password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña Actual
              </label>
              <input
                type="password"
                id="current-password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300"
              />
            </div>
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700"
              >
                Nueva Contraseña
              </label>
              <input
                type="password"
                id="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300"
              />
            </div>
          </div>
          <div className="p-6 bg-gray-50 text-right">
            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="px-6 py-3 bg-brown-300 text-white font-semibold rounded-lg hover:bg-brown-400 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              {changePasswordMutation.isPending
                ? "Actualizando..."
                : "Actualizar Contraseña"}
            </button>
          </div>
        </form>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <FiLogOut className="text-red-500" />
                <span>Cerrar Sesión</span>
              </h2>
            </div>
            <button
              onClick={logout}
              className="mt-4 sm:mt-0 w-full sm:w-auto px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors shadow-sm cursor-pointer"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
