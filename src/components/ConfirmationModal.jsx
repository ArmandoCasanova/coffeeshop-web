import { FiAlertTriangle } from "react-icons/fi";

/**
 * Modal de Confirmación Genérico
 */
export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message 
}) {
  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    // Fondo: z-[999] para apilamiento, bg-black-40 (tu color transparente), backdrop-blur-sm
    <div 
      onClick={onClose} 
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black-40 backdrop-blur-sm p-4"
    >
      {/* Contenedor del Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-sm p-6 bg-white rounded-xl shadow-2xl transform transition-all duration-300 scale-100"
      >
        <div className="flex flex-col items-center text-center">
          
          {/* Icono de Alerta */}
          <div className="p-3 mb-4 bg-red-100 rounded-full">
            <FiAlertTriangle className="h-6 w-6 text-red-600" />
          </div>

          {/* Contenido */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-6">{message}</p>

          {/* Botones de Acción */}
          <div className="flex w-full justify-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors w-1/2"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors w-1/2"
            >
              Sí, Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}