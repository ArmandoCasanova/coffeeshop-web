import { useState, useEffect } from "react";
import { FiX, FiUploadCloud, FiPlus } from "react-icons/fi";
import { URL_PATHS } from "../constants/urlPaths";
import { api } from "../config/axios";
export default function NewProductModal({
  isOpen,
  onClose,
  productData,
  onSave,
  isLoading,
}) {
  const [name, setName] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([{ id: 1, name: "Chico", price: "" }]);

  const isEditing = Boolean(productData);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get(URL_PATHS.GET_CATEGORIES);
        setCategories(res.data || []);
        if (res.data.length > 0) {
          setCategoryId(res.data[0].category_id);
        }
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    if (isOpen) fetchCategories();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        try {
          const base = parseFloat(productData.base_price || 0);
          const existingSizes =
            productData.customization_details_json?.sizes ?? [];

          const fullPriceSizes = existingSizes.map((s, i) => ({
            id: i + 1,
            name: s?.name || `Tamaño ${i + 1}`,
            price: (base + Number(s?.price || 0)).toFixed(2),
          }));

          setName(productData.name || "");
          setIsAvailable(productData.is_available ?? true);
          setImagePreview(productData.image_url || "");
          setCategoryId(
            productData.category_info_json?.category_id ||
              categories[0]?.category_id ||
              ""
          );

          if (fullPriceSizes.length === 0) {
            setSizes([{ id: 1, name: "Default", price: base.toFixed(2) }]);
          } else {
            setSizes(fullPriceSizes);
          }
          setImageFile(null);
        } catch (error) {
          console.error("Error preparando tamaños:", error);
          setSizes([{ id: 1, name: "Default", price: "0.00" }]);
        }
      } else {
        setName("");
        setIsAvailable(true);
        setImagePreview("");
        setImageFile(null);
        setCategoryId(categories[0]?.category_id || "");
        setSizes([{ id: 1, name: "Chico", price: "" }]);
      }
    }
  }, [isOpen, productData, isEditing, categories]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSizeChange = (id, field, value) => {
    setSizes(sizes.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const handleAddSize = () => {
    setSizes([...sizes, { id: Date.now(), name: "", price: "" }]);
  };

  const handleRemoveSize = (id) => {
    if (sizes.length > 1) {
      setSizes(sizes.filter((s) => s.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const basePrice = parseFloat(sizes[0]?.price || 0);
    const formattedSizes = sizes.map((s) => ({
      name: s.name,
      price: parseFloat(s.price || 0) - basePrice,
    }));

    onSave({
      name,
      basePrice,
      isAvailable,
      imageFile,
      existingImageUrl: productData?.image_url,
      categoryId,
      sizes: formattedSizes,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-xs p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 sm:p-6 pb-2 border-b">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
            {isEditing ? "Editar Producto" : "Nuevo Producto"}
          </h2>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grow overflow-y-auto">
          <div className="p-4 sm:p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Nombre
              </label>
              <input
                type="text"
                placeholder="Ej: Caramel Frappuccino"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Categoría
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg h-[50px]"
                >
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Disponibilidad
                </label>
                <select
                  value={isAvailable ? "true" : "false"}
                  onChange={(e) => setIsAvailable(e.target.value === "true")}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg h-[50px]"
                >
                  <option value="true">Disponible</option>
                  <option value="false">Agotado</option>
                </select>
              </div>
            </div>

            {/* 🔽 Precios por tamaño (diseño intacto) */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Precios por Tamaño
              </h3>
              <div className="space-y-3">
                {sizes.map((size, index) => (
                  <div
                    key={size.id}
                    className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3"
                  >
                    <div className="flex-1">
                      <label className="text-xs text-gray-500">Tamaño</label>
                      <select
                        value={
                          ["Chico", "Mediano", "Grande"].includes(size.name)
                            ? size.name
                            : "Otro"
                        }
                        onChange={(e) => {
                          const value = e.target.value;
                          handleSizeChange(
                            size.id,
                            "name",
                            value === "Otro" ? "" : value
                          );
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      >
                        <option value="Chico">Chico</option>
                        <option value="Mediano">Mediano</option>
                        <option value="Grande">Grande</option>
                        <option value="Otro">Otro</option>
                      </select>

                      {!["Chico", "Mediano", "Grande"].includes(size.name) && (
                        <input
                          type="text"
                          placeholder="Escribe un tamaño"
                          value={size.name}
                          onChange={(e) =>
                            handleSizeChange(size.id, "name", e.target.value)
                          }
                          className="w-full px-3 py-2 mt-2 border border-gray-300 rounded-lg text-sm"
                        />
                      )}
                    </div>

                    <div className="w-full sm:w-28">
                      <label className="text-xs text-gray-500">
                        Precio Total ($)
                      </label>
                      <input
                        type="number"
                        placeholder={index === 0 ? "65.00" : "75.00"}
                        value={size.price}
                        step="0.01"
                        min="0"
                        onChange={(e) =>
                          handleSizeChange(size.id, "price", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-center"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveSize(size.id)}
                      disabled={sizes.length <= 1}
                      className="p-2 text-gray-400 rounded-full hover:bg-red-100 hover:text-red-500 disabled:opacity-50 self-end sm:self-center"
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddSize}
                className="mt-4 flex items-center justify-center gap-2 w-full px-5 py-3 bg-brown-100 text-brown-700 font-semibold rounded-lg hover:bg-brown-200"
              >
                <FiPlus className="w-5 h-5" />
                <span>Agregar Tamaño</span>
              </button>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                Imagen
              </label>
              <div className="flex items-center gap-4">
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Previsualización"
                    className="w-20 h-20 rounded-lg object-cover border"
                  />
                )}
                <label className="flex-1 flex flex-col items-center justify-center px-4 py-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                  <FiUploadCloud className="w-8 h-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-600">
                    {imageFile ? imageFile.name : "Seleccionar archivo"}
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    required={!isEditing && !imageFile}
                  />
                </label>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 pt-4 flex gap-3 bg-gray-50 border-t rounded-b-xl">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 text-gray-700 rounded-lg"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-5 py-2.5 bg-brown-300 text-white rounded-lg"
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
