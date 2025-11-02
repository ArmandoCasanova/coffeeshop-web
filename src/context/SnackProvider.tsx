import React, { createContext, useContext } from "react";
import { toast, Toaster } from "react-hot-toast";
import { FiCheckCircle, FiAlertTriangle, FiAlertCircle } from "react-icons/fi";

// Recreamos tu AlertBox como un componente Web
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
      icon: <FiAlertCircle className="text-[#ED1C1C] w-6 h-6" />,
    },
    success: {
      backgroundColor: "bg-[#E4FFEB]",
      border: "border-[#1CED3C]",
      icon: <FiCheckCircle className="text-[#1CED3C] w-6 h-6" />,
    },
  };

  const style = ALERT_STYLES[type] || ALERT_STYLES.success;

  return (
    <div className="items-center justify-center w-full max-w-md px-6">
      <div
        className={`flex flex-row border ${style.border} p-3 py-4 items-center justify-start rounded-full ${style.backgroundColor} w-full shadow-lg`}
      >
        <div className="pl-2">{style.icon}</div>
        <p className="ml-2 max-w-[306px] flex-shrink-0 font-Urbanist text-sm px-2 text-gray-800">
          {message}
        </p>
      </div>
    </div>
  );
};

// TU CONTEXTO (¡AQUÍ ESTÁ EL EXPORT!)
export const SnackbarContext = createContext(null);

export const SnackbarProvider = ({ children }) => {
  const showSnackbar = ({ type, message }) => {
    toast.custom(
      <CustomAlert type={type} message={message} />,
      { duration: 3000 }
    );
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Toaster position="bottom-center" />
    </SnackbarContext.Provider>
  );
};