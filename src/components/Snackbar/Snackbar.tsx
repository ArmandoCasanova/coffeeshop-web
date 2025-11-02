import React, { createContext, useContext } from "react";
import { toast, Toaster } from "react-hot-toast";
import { SnackbarContextType } from "../../models/Snackbar"; // Asumiendo que tienes este tipo
// Importa los iconos que vas a usar
import { FiCheckCircle, FiAlertTriangle, FiAlertCircle } from "react-icons/fi";

// --- 1. Aquí recreamos tu AlertBox como un componente Web ---
// (No lo exportes, es solo para uso interno del Provider)
const CustomAlert = ({ type, message }) => {
  const ALERT_STYLES = {
    warning: {
      backgroundColor: "bg-[#FFEEE2]",
      border: "border-[#ED7E1C]",
      icon: <FiAlertTriangle className="text-[#ED7E1C] w-6 h-6" />,
    },
    error: {
      backgroundColor: "bg-[#FFE2E2]",
      border: "border-[#ED1C1C]",
      icon: <FiAlertCircle className="text-[#ED1C1C] w-6 h-6" />, // Usamos AlertCircle
    },
    success: {
      backgroundColor: "bg-[#E4FFEB]",
      border: "border-[#1CED3C]",
      icon: <FiCheckCircle className="text-[#1CED3C] w-6 h-6" />,
    },
  };

  const { backgroundColor, border, icon } = ALERT_STYLES[type] || ALERT_STYLES.success;

  return (
    // Usamos <div> en lugar de <View> y <Text>
    <div className="items-center justify-center w-full max-w-md px-6">
      <div
        className={`flex flex-row border ${border} p-3 py-4 items-center justify-start rounded-full ${backgroundColor} w-full shadow-lg`}
      >
        <div className="pl-2">{icon}</div>
        <p className="ml-2 max-w-[306px] flex-shrink-0 font-Urbanist text-sm px-2 text-gray-800">
          {message}
        </p>
      </div>
    </div>
  );
};


// --- 2. Tu Context/Provider ---
export const SnackbarContext = createContext<SnackbarContextType | null>(null);

export const SnackbarProvider = ({ children }) => {
  
  const showSnackbar = ({ type, message }) => {
    // En lugar de toast.success(), llamamos a toast.custom()
    // para usar nuestro propio componente 'CustomAlert'
    toast.custom(
      <CustomAlert type={type} message={message} />,
      {
        duration: 3000, // Tu duración
      }
    );
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {/* El Toaster ahora solo maneja la posición y las animaciones */}
      <Toaster position="bottom-center" />
    </SnackbarContext.Provider>
  );
};

// --- 3. Tu Hook (sigue igual) ---
export const useSnackbar = (): SnackbarContextType => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error("useSnackbar must be used within a SnackbarProvider");
  }
  return context;
};