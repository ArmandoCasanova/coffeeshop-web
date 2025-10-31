import { useState } from "react";
import { FiPlus, FiX } from "react-icons/fi";

export default function NewProductModal({ isOpen, onClose }) {
  const [ingredients, setIngredients] = useState([
    { id: 1, name: "Grano de Café", quantity: "25", unit: "gr" },
    { id: 2, name: "Leche", quantity: "100", unit: "ml" },
    { id: 3, name: "Salsa de Caramelo", quantity: "15", unit: "ml" },
  ]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleAddIngredient = () => {
    setIngredients([
      ...ingredients,
      { id: Date.now(), name: "", quantity: "", unit: "gr" },
    ]);
  };

  const handleIngredientChange = (id, field, value) => {
    setIngredients(
      ingredients.map((ing) =>
        ing.id === id ? { ...ing, [field]: value } : ing
      )
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Nuevo Producto Creado:", {
      productName: e.target.productName.value,
      price: e.target.price.value,
      category: e.target.category.value,
      description: e.target.description.value,
      ingredients,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs p-4 transition-opacity duration-300 ease-in-out"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col transform transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-center p-4 sm:p-6 pb-2 border-b border-gray-200 shrink-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Nuevo Producto
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="grow overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-4">
            <div>
              <label htmlFor="productName" className="sr-only">
                Nombre del producto
              </label>
              <input
                type="text"
                id="productName"
                name="productName"
                placeholder="Nombre del producto"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300 text-gray-700"
              />
            </div>
            <div>
              <label htmlFor="price" className="sr-only">
                Precio
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                  $
                </span>
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Precio"
                  required
                  step="0.01"
                  min="0"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300 text-gray-700"
                />
              </div>
            </div>
            <div>
              <label htmlFor="category" className="sr-only">
                Categoría
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  id="category"
                  name="category"
                  placeholder="Categoría"
                  className="flex-1 min-w-[150px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300 text-gray-700"
                />
                <span className="px-3 py-2 bg-gray-200 text-gray-700 text-sm rounded-full whitespace-nowrap cursor-pointer hover:bg-gray-300">
                  Café Caliente
                </span>
                <span className="px-3 py-2 bg-brown-300 text-white text-sm rounded-full whitespace-nowrap cursor-pointer hover:bg-brown-400">
                  Café Frío
                </span>
              </div>
            </div>
            <div>
              <label htmlFor="description" className="sr-only">
                Descripción del producto
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Descripción del producto"
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300 text-gray-700 resize-none"
              ></textarea>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Insumos / Receta
              </h3>
              <div className="space-y-3">
                {ingredients.map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3"
                  >
                    <div className="flex-1">
                      <label
                        htmlFor={`ing-name-${ingredient.id}`}
                        className="sr-only"
                      >
                        Insumo
                      </label>
                      <input
                        type="text"
                        id={`ing-name-${ingredient.id}`}
                        placeholder="Insumo"
                        value={ingredient.name}
                        onChange={(e) =>
                          handleIngredientChange(
                            ingredient.id,
                            "name",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brown-300"
                      />
                    </div>
                    <div className="w-full sm:w-24">
                      <label
                        htmlFor={`ing-qty-${ingredient.id}`}
                        className="sr-only"
                      >
                        Cantidad
                      </label>
                      <input
                        type="number"
                        id={`ing-qty-${ingredient.id}`}
                        placeholder="Cantidad"
                        value={ingredient.quantity}
                        onChange={(e) =>
                          handleIngredientChange(
                            ingredient.id,
                            "quantity",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-center focus:outline-none focus:ring-1 focus:ring-brown-300"
                      />
                    </div>
                    <div className="w-full sm:w-20">
                      <label
                        htmlFor={`ing-unit-${ingredient.id}`}
                        className="sr-only"
                      >
                        Unidad
                      </label>
                      <select
                        id={`ing-unit-${ingredient.id}`}
                        value={ingredient.unit}
                        onChange={(e) =>
                          handleIngredientChange(
                            ingredient.id,
                            "unit",
                            e.target.value
                          )
                        }
                        className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brown-300"
                      >
                        <option value="gr">gr</option>
                        <option value="ml">ml</option>
                        <option value="un">un</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="mt-4 flex items-center justify-center gap-2 w-full px-5 py-3 bg-brown-100 text-brown-700 font-semibold rounded-lg hover:bg-brown-200 transition-colors"
              >
                <FiPlus className="w-5 h-5" />
                <span>Agegar Insumo</span>
              </button>
            </div>
          </div>
          <div className="p-4 sm:p-6 pt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 bg-gray-50 border-t border-gray-200 rounded-b-xl shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-brown-300 text-white font-semibold rounded-lg hover:bg-brown-400 transition-colors shadow-sm"
            >
              Crear Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
