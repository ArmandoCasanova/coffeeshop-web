import { useState, useEffect } from "react";
import { FiPlus, FiX } from "react-icons/fi";

export default function NewProductModal({ isOpen, onClose, productData }) {
  const categoryOptions = [
    "Espresso",
    "Lattes",
    "Frappés",
    "Tés",
    "Postres",
    "Especialidades",
  ];
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState(categoryOptions[0]);
  const [price, setPrice] = useState("");
  const [temperature, setTemperature] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([]);

  const isEditing = Boolean(productData);

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setProductName(productData.name || "");
        setPrice(productData.price || "");
        setCategory(productData.category || "");
        setTemperature(productData.temperature || "");
        setDescription(productData.description || "");
        setIngredients(
          productData.ingredients || [
            { id: Date.now(), name: "", quantity: "", unit: "gr" },
          ]
        );
      } else {
        setProductName("");
        setPrice("");
        setCategory("");
        setTemperature("");
        setDescription("");
        setIngredients([
          { id: 1, name: "Grano de Café", quantity: "25", unit: "gr" },
        ]);
      }
    }
  }, [isOpen, productData, isEditing]);

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

  const handleRemoveIngredient = (id) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter((ing) => ing.id !== id));
    }
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
    const formData = {
      productName,
      price,
      category,
      description,
      ingredients,
      temperature,
    };
    console.log(
      isEditing ? "Producto Actualizado:" : "Nuevo Producto Creado:",
      formData
    );
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
            {isEditing ? "Editar Producto" : "Nuevo Producto"}
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
              <input
                type="text"
                placeholder="Nombre del producto"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300 text-gray-700"
              />
            </div>
            <div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">
                  $
                </span>
                <input
                  type="number"
                  placeholder="Precio"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  step="0.01"
                  min="0"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300 text-gray-700"
                />
              </div>
            </div>
            <div>
              {/* --- AQUÍ ESTÁ LA SECCIÓN CORREGIDA --- */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="flex-1 min-w-[150px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300 text-gray-700 cursor-pointer"
                >
                  {categoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setTemperature("Caliente")}
                  className={`px-3 py-2 text-sm rounded-full whitespace-nowrap cursor-pointer transition-colors ${
                    temperature === "Caliente"
                      ? "bg-brown-300 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Café Caliente
                </button>
                <button
                  type="button"
                  onClick={() => setTemperature("Frío")}
                  className={`px-3 py-2 text-sm rounded-full whitespace-nowrap cursor-pointer transition-colors ${
                    temperature === "Frío"
                      ? "bg-brown-300 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Café Frío
                </button>
              </div>
            </div>
            <div>
              <textarea
                placeholder="Descripción del producto"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
                      <input
                        type="text"
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
                      <input
                        type="number"
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
                      <select
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
                    <button
                      type="button"
                      onClick={() => handleRemoveIngredient(ingredient.id)}
                      disabled={ingredients.length <= 1}
                      className="p-2 text-gray-400 rounded-full hover:bg-red-100 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={handleAddIngredient}
                className="mt-4 flex items-center justify-center gap-2 w-full px-5 py-3 bg-brown-100 text-brown-700 font-semibold rounded-lg hover:bg-brown-200 transition-colors"
              >
                <FiPlus className="w-5 h-5" />
                <span>Agregar Insumo</span>
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
              {isEditing ? "Guardar Cambios" : "Crear Producto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
