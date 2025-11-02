import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

// 1. Recibe 'onSave' (la mutación) y 'isLoading'
export default function NewProductModal({
  isOpen,
  onClose,
  productData,
  onSave,
  isLoading,
}) {
  const [name, setName] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);

  const isEditing = Boolean(productData);

  // 2. Rellena el formulario si estamos editando
  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setName(productData.name || "");
        setBasePrice(productData.basePrice || "");
        setImageUrl(productData.imageUrl || "");
        setIsAvailable(productData.isAvailable ?? true);
      } else {
        // Resetea el formulario si es "Nuevo"
        setName("");
        setBasePrice("");
        setImageUrl("");
        setIsAvailable(true);
      }
    }
  }, [isOpen, productData, isEditing]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 3. Formatea los datos para la API
    const formattedData = {
      name,
      basePrice: parseFloat(basePrice),
      imageUrl,
      isAvailable,
      // Dejamos que el backend ponga los JSON por defecto
    };

    // 4. Llama a la mutación que recibimos por 'onSave'
    onSave(formattedData);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs p-4 transition-opacity duration-300 ease-in-out"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center p-4 sm:p-6 pb-2 border-b border-gray-200 shrink-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {isEditing ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors disabled:opacity-50"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* 5. Formulario simplificado */}
        <form onSubmit={handleSubmit} className="grow overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Nombre del producto
              </label>
              <input
                type="text"
                placeholder="Ej: Caramel Frappuccino"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300 text-gray-700"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Precio Base
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                    $
                  </span>
                  <input
                    type="number"
                    placeholder="Ej: 65.00"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    required
                    step="0.01"
                    min="0"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300 text-gray-700"
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Disponibilidad
                </label>
                <select
                  value={isAvailable ? "true" : "false"}
                  onChange={(e) => setIsAvailable(e.target.value === "true")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300 text-gray-700 h-[50px]"
                >
                  <option value="true">Disponible</option>
                  <option value="false">Agotado</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                URL de la Imagen
              </label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300 text-gray-700"
              />
            </div>
          </div>

          <div className="p-4 sm:p-6 pt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 bg-gray-50 border-t border-gray-200 rounded-b-xl shrink-0">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-5 py-2.5 bg-brown-300 text-white font-semibold rounded-lg hover:bg-brown-400 transition-colors shadow-sm disabled:bg-brown-200"
            >
              {isLoading
                ? "Guardando..."
                : isEditing
                ? "Guardar Cambios"
                : "Crear Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
