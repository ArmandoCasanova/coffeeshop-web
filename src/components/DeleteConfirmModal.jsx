// components/DeleteConfirmModal.js

import { FiAlertTriangle, FiX } from "react-icons/fi";

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  promotionName,
}) {
  // Si no está abierto, no renderiza nada
  if (!isOpen) return null;

  return (
    // Fondo oscuro (overlay)
    <div
      className="fixed inset-0 backdrop-filter backdrop-blur-sm  bg-opacity-50 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">
            Confirmar Eliminación
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="flex items-start">
          <div className="shrink-0">
            <FiAlertTriangle
              size={24}
              className="text-red-500 mt-1"
            />
          </div>
          <div className="ml-4">
            <p className="text-gray-600">
              ¿Estás seguro de que deseas eliminar la promoción:
            </p>
            <p className="font-semibold text-gray-800 mt-1">
              "{promotionName}"?
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Esta acción no se puede deshacer.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}