import { useState, useEffect } from "react";
import { FiX, FiChevronDown } from "react-icons/fi";

// Definimos la estructura inicial que coincide con la API
const INITIAL_STATE = {
  name: "",
  stock_current_level: 0,
  stock_optimal_level: 0,
  unit_of_measure: "g", // Cambiado a 'g' como un default más común
};

export default function StockModal({ isOpen, onClose, onSave, productData }) {
  // El estado ahora usa los nombres de la API
  const [formData, setFormData] = useState(INITIAL_STATE);

  useEffect(() => {
    if (productData && isOpen) {
      // Mapeamos los datos del producto (que vienen de la API) al estado del formulario
      setFormData({
        name: productData.name || "",
        stock_current_level: productData.stock_current_level || 0,
        stock_optimal_level: productData.stock_optimal_level || 0,
        unit_of_measure: productData.unit_of_measure || "g",
      });
    } else if (!productData && isOpen) {
      // Reseteamos al estado inicial cuando es un producto nuevo
      setFormData(INITIAL_STATE);
    }
  }, [productData, isOpen]); // Se ejecuta cuando el modal se abre o el producto cambia

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    // Permite que el campo esté vacío temporalmente, pero lo trata como 0 si se guarda así
    setFormData((prev) => ({ ...prev, [name]: value === '' ? '' : Number(value) || 0 }));
  };

  const handleSave = () => {
    // Convertimos los números vacíos a 0 antes de guardar
    const dataToSave = {
      ...formData,
      stock_current_level: Number(formData.stock_current_level) || 0,
      stock_optimal_level: Number(formData.stock_optimal_level) || 0,
    };
    onSave(dataToSave);
    // onClose(); // El componente padre (Stock.js) se encarga de cerrar en onSuccess
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-lg bg-black/20 z-50 p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="bg-[#fdfaf6]/95 rounded-2xl shadow-2xl w-full max-w-lg p-8 relative border border-[#c9b49b]/40"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-[#5a4634] hover:text-[#2e2217] transition"
          onClick={onClose}
        >
          <FiX size={26} />
        </button>

        <h2 className="text-3xl font-bold text-[#3c2a1e] mb-6 text-center">
          {productData ? "Editar Producto" : "Nuevo Producto"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block mb-1.5 text-sm font-semibold text-[#3c2a1e]">
              Nombre del Producto
            </label>
            <input
              type="text"
              name="name" // Coincide con la API
              placeholder="Ej: Café en Grano"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-[#d6c7b4] rounded-xl focus:ring-2 focus:ring-[#a97c50] outline-none transition bg-white/80"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-[#3c2a1e]">
                Cantidad Actual
              </label>
              <input
                type="number"
                name="stock_current_level" // Coincide con la API
                value={formData.stock_current_level}
                onChange={handleNumberChange}
                min="0"
                className="w-full px-4 py-3 border border-[#d6c7b4] rounded-xl focus:ring-2 focus:ring-[#a97c50] outline-none transition bg-white/80"
              />
            </div>

            {/* --- CAMPO AÑADIDO --- */}
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-[#3c2a1e]">
                Cantidad Óptima
              </label>
              <input
                type="number"
                name="stock_optimal_level" // Coincide con la API
                value={formData.stock_optimal_level}
                onChange={handleNumberChange}
                min="1" // La API especifica gt=0 (mayor que 0)
                className="w-full px-4 py-3 border border-[#d6c7b4] rounded-xl focus:ring-2 focus:ring-[#a97c50] outline-none transition bg-white/80"
              />
            </div>
          </div>
          
          {/* --- CAMPO ACTUALIZADO --- */}
          <div>
            <label className="block mb-1.5 text-sm font-semibold text-[#3c2a1e]">
              Unidad de Medida
            </label>
            <div className="relative">
              <select
                name="unit_of_measure" // Coincide con la API
                value={formData.unit_of_measure}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-10 border border-[#d6c7b4] rounded-xl focus:ring-2 focus:ring-[#a97c50] outline-none transition bg-white/80 appearance-none"
              >
                {/* Opciones actualizadas según tu API */}
                <option value="g">g (gramos)</option>
                <option value="ml">ml (mililitros)</option>
                <option value="shot">shot (disparo)</option>
                <option value="unidad">unidad</option>
                <option value="kg">kg (kilogramos)</option>
                <option value="lt">lt (litros)</option>
                <option value="pzas">pzas (piezas)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                <FiChevronDown className="text-[#5a4634]" />
              </div>
            </div>
          </div>

          {/* --- CAMPOS ELIMINADOS (Price y Status) --- */}

          <button
            onClick={handleSave}
            className="w-full py-3 bg-[#5a3e2b] text-white font-semibold rounded-xl hover:bg-[#3c291d] transition-all mt-6"
          >
            {productData ? "Guardar Cambios" : "Guardar Producto"}
          </button>
        </div>
      </div>
    </div>
  );
}
