import React, { useState, useRef } from 'react';
import { FiCamera, FiPlus } from "react-icons/fi";
import { useCreateCategoryMutation } from "../hooks/categories/useCreateCategoryMutation"; // 💡 Importación de hook

export default function NewCategoryModal({ isOpen, onClose }) {
  // 💡 Nuevos estados para los campos del formulario
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  
  // 💡 Uso del hook de mutación
  const { mutate: createCategory, isPending } = useCreateCategoryMutation();

  if (!isOpen) {
    return null;
  }

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Crear FormData para la mutación
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    
    // Solo añade la imagen si fue seleccionada
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
    
    createCategory(formData, {
      onSuccess: () => {
        // Limpiar formulario y cerrar modal
        setName("");
        setDescription("");
        setSelectedImage(null);
        onClose();
      },
      // El onError se maneja dentro del hook de mutación (useCreateCategoryMutation)
    });
  };

  return (
    <div 
      onClick={onClose} 
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black-40 backdrop-blur-sm p-4" 
    >
      {/* Contenedor del Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-lg"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Nueva Categoría
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Sección de Subir Imagen */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imagen de Categoría
              </label>
              <div 
                className="flex items-center justify-center w-full h-40 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg relative overflow-hidden"
              >
                
                {/* Visualización de la Imagen Seleccionada */}
                {selectedImage ? (
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Vista previa de la categoría"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">Sin imagen seleccionada</span>
                )}
                
                {/* Input de Archivo Oculto */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*" // Solo acepta archivos de imagen
                  className="hidden" // Ocultar el input
                />
                
                {/* Botón que Abre el Selector */}
                <button
                  type="button"
                  onClick={handleButtonClick} // Llama a la función para abrir el selector
                  className="absolute bottom-3 right-3 flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-md"
                >
                  <FiCamera />
                  <span>{selectedImage ? 'Cambiar Foto' : 'Subir Foto'}</span>
                </button>
                
              </div>
              {/* Opcional: Mostrar el nombre del archivo seleccionado */}
              {selectedImage && (
                <p className="mt-2 text-xs text-gray-600 truncate">
                  Archivo: **{selectedImage.name}**
                </p>
              )}
            </div>

            {/* Nombre */}
            <div>
              <label
                htmlFor="categoryName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre
              </label>
              <input
                type="text"
                id="categoryName"
                value={name} // 💡 Conectado al estado
                onChange={(e) => setName(e.target.value)} // 💡 Conectado al estado
                placeholder="Ej: Bebidas Calientes"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300"
              />
            </div>

            {/* Descripción */}
            <div>
              <label
                htmlFor="categoryDescription"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Descripción
              </label>
              <textarea
                id="categoryDescription"
                value={description} // 💡 Conectado al estado
                onChange={(e) => setDescription(e.target.value)} // 💡 Conectado al estado
                placeholder="Cafés, tés, frappuccinos..."
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-brown-300"
              />
            </div>
          </div>

          {/* Botones de Acción */}
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
              disabled={isPending} // 💡 Deshabilitar durante la carga
              className="flex items-center gap-2 px-5 py-3 bg-brown-300 text-white font-semibold rounded-lg hover:bg-brown-400 transition-colors disabled:opacity-60"
            >
              {isPending ? (
                <span>Guardando...</span>
              ) : (
                <>
                  <FiPlus />
                  <span>Guardar Categoría</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}