import { FiAlertTriangle, FiX } from "react-icons/fi";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirmar acción",
  message = "¿Estás seguro de realizar esta acción?",
  itemName = "",
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  confirmColor = "bg-red-600 hover:bg-red-700",
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 backdrop-filter backdrop-blur-sm bg-opacity-30 z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 sm:p-8 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX size={22} />
          </button>
        </div>

        <div className="flex items-start">
          <FiAlertTriangle
            size={28}
            className="text-red-500 mt-1 flex-shrink-0"
          />
          <div className="ml-4">
            <p className="text-gray-600">{message}</p>
            {itemName && (
              <p className="font-semibold text-gray-800 mt-1 break-words">
                "{itemName}"
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2 text-white font-semibold rounded-lg transition-colors ${confirmColor}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
