import { useState, useEffect } from "react";
import { FiX, FiChevronDown } from "react-icons/fi";

// 1. Props renombradas: 'orderData' ahora es 'productData'
export default function StockModal({ isOpen, onClose, onSave, productData }) {
  
  // 2. Estado simplificado para los campos del producto
  const [formData, setFormData] = useState({
    name: "",
    stock: 0,
    unidad_medida: "kg",
    price: 0,
    status: "optimo",
  });

  // 3. useEffect para poblar el formulario si estamos editando
  useEffect(() => {
    if (productData) {
      // Modo Edición: Llenar con datos del producto
      setFormData({
        name: productData.name || "",
        stock: productData.stock || 0,
        unidad_medida: productData.unidad_medida || "kg",
        price: productData.price || 0,
        status: productData.status || "optimo",
      });
    } else {
      // Modo Nuevo: Resetear el formulario
      setFormData({
        name: "",
        stock: 0,
        unidad_medida: "kg",
        price: 0,
        status: "optimo",
      });
    }
  }, [productData, isOpen]); // Se activa cuando el modal se abre o productData cambia

  // 4. Handler genérico para cambios en los inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 5. Handler específico para números (asegura que el tipo de dato sea number)
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: Number(value) || 0 }));
  };

  // 6. Handler de guardado simplificado
  const handleSave = () => {
    onSave(formData); // Envía el objeto de producto completo
    onClose();
  };

  if (!isOpen) return null;

  // 7. Estilos del modal (backdrop y caja) MANTENIDOS
  return (
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-lg bg-black/20 z-50 p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        // Se cambió max-w-3xl por max-w-lg (más apropiado para este form)
        className="bg-[#fdfaf6]/95 rounded-2xl shadow-2xl w-full max-w-lg p-8 relative border border-[#c9b49b]/40"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-[#5a4634] hover:text-[#2e2217] transition"
          onClick={onClose}
        >
          <FiX size={26} />
        </button>

        {/* Título actualizado */}
        <h2 className="text-3xl font-bold text-[#3c2a1e] mb-6 text-center">
          {productData ? "Editar Producto" : "Nuevo Producto"}
        </h2>

        {/* 8. Formulario de Producto (reemplaza la lista de items) */}
        <div className="space-y-4">
          
          {/* Campo: Nombre */}
          <div>
            <label className="block mb-1.5 text-sm font-semibold text-[#3c2a1e]">
              Nombre del Producto
            </label>
            <input
              type="text"
              name="name"
              placeholder="Ej: Café en Grano"
              value={formData.name}
              onChange={handleChange}
              // Estilos de input MANTENIDOS
              className="w-full px-4 py-3 border border-[#d6c7b4] rounded-xl focus:ring-2 focus:ring-[#a97c50] outline-none transition bg-white/80"
            />
          </div>

          {/* Grid responsive para los campos restantes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Campo: Cantidad (Stock) */}
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-[#3c2a1e]">
                Cantidad (Stock)
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleNumberChange}
                min="0"
                className="w-full px-4 py-3 border border-[#d6c7b4] rounded-xl focus:ring-2 focus:ring-[#a97c50] outline-none transition bg-white/80"
              />
            </div>

            {/* Campo: Unidad de Medida (Dropdown) */}
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-[#3c2a1e]">
                Unidad
              </label>
              <div className="relative">
                <select
                  name="unidad_medida"
                  value={formData.unidad_medida}
                  onChange={handleChange}
                  // Estilos de select MANTENIDOS
                  className="w-full px-4 py-3 pr-10 border border-[#d6c7b4] rounded-xl focus:ring-2 focus:ring-[#a97c50] outline-none transition bg-white/80 appearance-none"
                >
                  <option value="kg">kg</option>
                  <option value="lt">lt</option>
                  <option value="pzas">pzas</option>
                  <option value="unidad">unidad</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <FiChevronDown className="text-[#5a4634]" />
                </div>
              </div>
            </div>

            {/* Campo: Costo / Precio */}
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-[#3c2a1e]">
                Costo / Unidad
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleNumberChange}
                min="0"
                step="0.01"
                className="w-full px-4 py-3 border border-[#d6c7b4] rounded-xl focus:ring-2 focus:ring-[#a97c50] outline-none transition bg-white/80"
              />
            </div>

            {/* Campo: Estado (Dropdown) */}
            <div>
              <label className="block mb-1.5 text-sm font-semibold text-[#3c2a1e]">
                Estado
              </label>
              <div className="relative">
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-10 border border-[#d6c7b4] rounded-xl focus:ring-2 focus:ring-[#a97c50] outline-none transition bg-white/80 appearance-none"
                >
                  <option value="optimo">Óptimo</option>
                  <option value="bajo">Bajo</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <FiChevronDown className="text-[#5a4634]" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Botón de Guardar (estilo MANTENIDO) */}
          <button
            onClick={handleSave}
            // 9. Se usa el estilo del botón principal de "Guardar Orden"
            className="w-full py-3 bg-[#5a3e2b] text-white font-semibold rounded-xl hover:bg-[#3c291d] transition-all mt-6"
          >
            {productData ? "Guardar Cambios" : "Guardar Producto"}
          </button>
        </div>
      </div>
    </div>
  );
}