// D:\Proyectos Web\coffeeshop-web\src\components\EditCategoryModal.jsx

import { useState, useEffect, useRef } from "react";
import { useUpdateCategoryMutation } from "../hooks/categories/useUpdateCategoryMutation";

export default function EditCategoryModal({ isOpen, onClose, categoryToEdit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [previewImage, setPreviewImage] = useState(null); // solo para vista previa
  const fileInputRef = useRef(null);
  const { mutate: updateCategory, isPending } = useUpdateCategoryMutation();

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name || "");
      setDescription(categoryToEdit.description || "");
      
      const imageUrl = categoryToEdit.image_url || null;

      if (imageUrl) {
        // Lógica para manejar URL absoluta (ImgBB) o relativa (local)
        if (imageUrl.startsWith('http')) {
          setPreviewImage(imageUrl); // Es ImgBB
        } else {
          // Asumimos que es local y necesita la URL base del API
          // 💡 IMPORTANTE: Asegúrate de que esta URL base sea correcta
          setPreviewImage(`http://localhost:8000${imageUrl}`); 
        }
      } else {
        setPreviewImage(null); // No hay imagen
      }
    }
  }, [categoryToEdit]);

  if (!isOpen || !categoryToEdit) return null;

  // Abrir selector de archivos
  const handleImageUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Cargar imagen seleccionada (solo para preview)
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result); // vista previa base64
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear FormData para enviar al backend
    const formData = new FormData();
    // Siempre enviamos el nombre y la descripción para que Pydantic pueda procesar el formulario
    formData.append("name", name);
    formData.append("description", description);

    // Solo añadir archivo si el usuario seleccionó uno
    if (fileInputRef.current?.files?.[0]) {
      formData.append("image", fileInputRef.current.files[0]);
    }

    updateCategory(
      { id: categoryToEdit.category_id, data: formData },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Editar Categoría
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Imagen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen de Categoría
              </label>
              <div className="flex flex-col items-center justify-center w-full h-40 bg-cream-100 border-2 border-dashed border-brown-100 rounded-lg p-2">
                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Categoría"
                    className="w-24 h-24 object-cover rounded-full mb-2 border-2 border-brown-300"
                  />
                )}
                <button
                  type="button"
                  onClick={handleImageUploadClick}
                  className="flex items-center gap-2 px-4 py-2 bg-brown-300 text-white border border-brown-600 rounded-lg text-sm font-medium hover:bg-brown-400 transition-colors"
                >
                  Cambiar Foto
                </button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Bebidas Calientes"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300"
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Cafés, tés, frappuccinos..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brown-300"
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end items-center gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="text-gray-600 font-medium hover:text-gray-900"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-2 px-5 py-3 bg-brown-300 text-white font-semibold rounded-lg hover:bg-brown-400 transition-colors disabled:opacity-60"
            >
              {isPending ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}