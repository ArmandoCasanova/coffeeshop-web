import { useState, useEffect } from "react";
import { FiX, FiUploadCloud, FiPlus } from "react-icons/fi";
import { HTTP } from "../config/axios";
import { URL_PATHS } from "../constants/urlPaths";
import { useQuery } from "@tanstack/react-query";
import MultiSelectPillInput from "./MultiSelectPillInput"; 
import CustomizationGroupEditor from "./CustomizationGroupEditor"; 
import IngredientEditor from "./ingredientEditor"; 
import { CUSTOMIZATION_GROUP_SERVICE } from "../services/customizationGroupService";

// (Todas las funciones auxiliares de 'getBasePriceFromGroups' y 'fetchOptionsForGroup' se quedan igual)
const getBasePriceFromGroups = (groups) => {
  const sizeGroup = groups.find(g => g.name === "Tamaño" || g.system_name === "size");
  return parseFloat(sizeGroup?.options[0]?.price || 0) || 0;
};
const fetchOptionsForGroup = async (groupId) => {
  console.warn(`Simulando carga de opciones para ${groupId}. No hay API real.`);
  return [{ id: `new-${Date.now()}`, name: "Nueva Opción", extra_cost: 0 }];
};


export default function NewProductModal({
  isOpen,
  onClose,
  productData,
  onSave,
  isLoading,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isAvailable, setIsAvailable] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  
  const [selectedCategories, setSelectedCategories] = useState([]); 
  const [editedGroups, setEditedGroups] = useState([]); 
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [groupToAdd, setGroupToAdd] = useState(""); 

  const isEditing = Boolean(productData);

  // --- Carga de Datos (React Query) ---
  const { data: allCategories = [] } = useQuery({
    queryKey: ["allCategories"],
    queryFn: async () => {
      const res = await HTTP.get(URL_PATHS.GET_CATEGORIES); 
      return res.data.categories || res.data || [];
    },
    enabled: isOpen,
  });

  const { data: allCustomGroups = [] } = useQuery({
    queryKey: ["allCustomGroups"],
    queryFn: CUSTOMIZATION_GROUP_SERVICE.getAllGroups,
    enabled: isOpen,
  });

  // --- Carga y reseteo de datos del producto (useEffect) ---
  // (Esta lógica está bien, no se toca)
  useEffect(() => {
    if (!isOpen) return;

    if (isEditing && productData) {
      // --- MODO EDICIÓN ---
      setName(productData.name || "");
      setDescription(productData.description || "");
      setIsAvailable(productData.is_available ?? true);
      setImageFile(null);
      setImagePreview(productData.image_url || ""); 

      // 1. Cargar Categorías
      const catInfo = productData.category_info_json || {};
      const categoryIds = catInfo.category_ids || (catInfo.category_id ? [catInfo.category_id] : []);
      setSelectedCategories(categoryIds);

      // 2. Cargar Ingredientes
      const ingredients = productData.ingredients_json?.ingredients || [];
      setSelectedIngredients(ingredients); // <-- Aquí se cargan {id, quantity, unit}

      // 3. Cargar Personalizaciones
      const details = productData.customization_details_json || {};
      const loadedGroups = [];
      const basePrice = parseFloat(productData.base_price || 0);

      for (const key in details) {
        const group = details[key];
        const isSizeGroup = group.system_name === 'size';
        
        const options = group.options.map((opt, i) => ({
          id: opt.option_id || `opt-${i}`,
          name: opt.name || opt.details,
          price: isSizeGroup 
            ? (basePrice + parseFloat(opt.extra_cost || 0)).toFixed(2)
            : parseFloat(opt.extra_cost || 0).toFixed(2)
        }));
        
        loadedGroups.push({
          id: group.group_id, 
          name: group.display_name,
          system_name: group.system_name,
          type: isSizeGroup ? 'radio' : 'checkbox',
          is_required: true,
          options: options,
        });
      }
      setEditedGroups(loadedGroups);

    } else {
      // --- MODO CREACIÓN (Reset) ---
      setName("");
      setDescription("");
      setIsAvailable(true);
      setImagePreview("");
      setImageFile(null);
      setSelectedCategories([]);
      setSelectedIngredients([]);
      
      const sizeGroup = allCustomGroups.find(g => g.system_name === 'size');
      if (sizeGroup) {
        setEditedGroups([{
          id: sizeGroup.group_id,
          name: sizeGroup.display_name,
          system_name: sizeGroup.system_name,
          type: 'radio',
          is_required: true,
          options: [{ id: Date.now(), name: "Chico", price: "" }] 
        }]);
      } else {
         setEditedGroups([{ id: "default-size", name: "Tamaño", system_name: "size", type: "radio", is_required: true, options: [{ id: "default-opt", name: "Chico", price: "" }] }]);
      }
    }
  }, [isOpen, productData, isEditing, allCustomGroups]);


  // --- LÓGICA NUEVA PARA AÑADIR GRUPOS DINÁMICAMENTE ---
  // (Esta lógica está bien, no se toca)
  const handleAddCustomizationGroup = async () => {
    if (!groupToAdd) return;
    
    const groupTemplate = allCustomGroups.find(g => g.group_id === groupToAdd);
    if (!groupTemplate) return;

    const options = await fetchOptionsForGroup(groupTemplate.group_id);

    setEditedGroups([
      ...editedGroups,
      { 
        id: groupTemplate.group_id, 
        name: groupTemplate.display_name, 
        system_name: groupTemplate.system_name,
        type: "checkbox",
        is_required: false, 
        options: options.length > 0 ? options.map(opt => ({
          id: opt.option_id,
          name: opt.name,
          price: opt.extra_cost.toFixed(2)
        })) : [{ id: Date.now(), name: "Opción 1", price: "0" }]
      }
    ]);
    
    setGroupToAdd(""); 
  };
  
  const handleRemoveCustomizationGroup = (id) => {
    setEditedGroups(editedGroups.filter(g => g.id !== id));
  };
  
  const handleUpdateCustomizationGroup = (updatedGroup) => {
    setEditedGroups(
      editedGroups.map(g => g.id === updatedGroup.id ? updatedGroup : g)
    );
  };
  
  const availableGroupsToAdd = allCustomGroups.filter(
    g => g.system_name !== 'size' && !editedGroups.some(eg => eg.id === g.group_id)
  );

  // --- LÓGICA CLAVE DE ENVÍO ---
  // (Esta lógica está bien, no se toca)
  const handleSubmit = (e) => {
    e.preventDefault();

    const basePrice = getBasePriceFromGroups(editedGroups);
    if (basePrice <= 0) {
      alert("El precio de la primera opción de Tamaño debe ser mayor a 0 y será el precio base.");
      return;
    }

    // 1. Construir el JSON de Personalización
    const customizationPayload = {};
    editedGroups.forEach(group => {
      const systemName = group.system_name || group.name.toLowerCase().replace(/\s+/g, '_');
      const isSizeGroup = systemName === 'size';
      
      customizationPayload[systemName] = {
        group_id: group.id,
        system_name: systemName,
        display_name: group.name,
        options: group.options.map(opt => ({
          option_id: (typeof opt.id === 'string' && opt.id.includes('-')) ? opt.id : null,
          name: opt.name,
          details: opt.name, 
          extra_cost: isSizeGroup
            ? parseFloat(((parseFloat(opt.price || 0) - basePrice).toFixed(2)))
            : parseFloat(opt.price || 0)
        }))
      };
    });

    // 2. Construir el JSON de Ingredientes
    const ingredientsPayload = {
      // 💡 Solo guardamos ID, cantidad y unidad. El 'name' se buscará al cargar.
      ingredients: selectedIngredients.map(ing => ({
        ingredientId: ing.ingredientId,
        quantity: ing.quantity,
        unit: ing.unit,
      }))
    };
    
    // 3. Construir el JSON de Categoría
    const selectedCatId = selectedCategories[0] || null;
    const selectedCatName = allCategories.find(c => c.category_id === selectedCatId)?.name || null;
    const categoryPayload = {
        category_id: selectedCatId,
        category_name: selectedCatName,
        category_ids: selectedCategories 
    };

    // 4. LLAMAR AL onSave (en Products.jsx)
    onSave({
      name,
      description,
      basePrice: basePrice,
      isAvailable,
      imageFile: imageFile, 
      existingImageUrl: productData?.image_url, 
      category_info_json: categoryPayload,
      customization_details_json: customizationPayload,
      ingredients_json: ingredientsPayload,
      id: productData?.product_id,
    });
  };
  
  // (handleOverlayClick y handleFileChange se quedan igual)
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 pb-2 border-b">
          <h2 className="text-2xl sm:text-3xl font-bold text-brown-600">
            {isEditing ? "Editar Producto" : "Añade un nuevo producto"}
          </h2>
          <button onClick={onClose} disabled={isLoading} className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* 💡 --- ARREGLO 2: BOTONES OCULTOS --- 💡 */}
        {/*
          1. El 'form' ahora es 'flex-col' y 'overflow-hidden'.
             Ocupará el espacio restante (grow) pero no hará scroll él mismo.
        */}
        <form onSubmit={handleSubmit} className="grow flex flex-col overflow-hidden">
          
          {/*
            2. Este 'div' interno es el que ahora tiene el scroll ('overflow-y-auto').
               Contiene *solo* el contenido, pero no los botones.
          */}
          <div className="grow overflow-y-auto p-4 sm:p-6 space-y-6">
            
            {/* --- Info General --- */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Nombre</label>
                  <input type="text" placeholder="Ej: Caramel Frappuccino" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Descripción</label>
                  <textarea placeholder="Ej: Bebida a base de café, hielo y leche..." value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm" />
                </div>
              </div>
              <div className="w-full sm:w-56 space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Imagen</label>
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-brown-300 border-dashed rounded-lg cursor-pointer hover:bg-brown-50">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <div className="text-center">
                        <FiUploadCloud className="w-8 h-8 text-brown-500 mx-auto" />
                        <span className="mt-1 text-xs text-brown-500">Click para subir</span>
                      </div>
                    )}
                    <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleFileChange} required={!isEditing && !productData?.image_url} />
                  </label>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Disponibilidad</label>
                  <select value={isAvailable ? "true" : "false"} onChange={(e) => setIsAvailable(e.target.value === "true")} className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm">
                    <option value="true">Disponible</option>
                    <option value="false">Agotado</option>
                  </select>
                </div>
              </div>
            </div>

            {/* --- Categorías --- */}
            <MultiSelectPillInput
              label="Categorías"
              placeholder="+ Selecciona una categoría"
              options={allCategories}
              selectedIds={selectedCategories}
              onChange={setSelectedCategories}
              idKey="category_id"
              nameKey="name"
            />

            {/* --- Editor de Personalización (Dinámico) --- */}
            <div className="space-y-4">
              {editedGroups.map((group, index) => (
                <CustomizationGroupEditor
                  key={group.id}
                  group={group}
                  onUpdate={handleUpdateCustomizationGroup}
                  onRemove={() => handleRemoveCustomizationGroup(group.id)}
                  isBaseGroup={group.system_name === 'size'} 
                  basePrice={group.system_name !== 'size' ? getBasePriceFromGroups(editedGroups) : null}
                />
              ))}
              
              <div className="flex gap-2">
                <select
                  value={groupToAdd}
                  onChange={(e) => setGroupToAdd(e.target.value)}
                  className="flex-1 w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"
                >
                  <option value="" disabled>Selecciona un grupo para añadir</option>
                  {availableGroupsToAdd.map(g => (
                    <option key={g.group_id} value={g.group_id}>{g.display_name}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddCustomizationGroup}
                  disabled={!groupToAdd}
                  className="px-4 py-3 bg-brown-500 text-white font-semibold rounded-lg hover:bg-brown-600 disabled:bg-brown-300"
                >
                  <FiPlus />
                </button>
              </div>
            </div>
            
            {/* --- Editor de Ingredientes --- */}
            <IngredientEditor
              value={selectedIngredients}
              onChange={setSelectedIngredients}
            />

          </div> {/* 💡 Fin del div con scroll */}

          {/*
            3. El 'Footer' ahora es hermano del 'div' con scroll.
               Al estar en un 'flex-col', se posicionará automáticamente
               debajo del contenido, y no se ocultará con el scroll.
          */}
          <div className="p-4 sm:p-6 pt-4 flex justify-end gap-3 bg-gray-50 border-t rounded-b-xl">
            <button type="button" onClick={onClose} disabled={isLoading} className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
              Cancelar
            </button>
            <button type="submit" disabled={isLoading} className="px-5 py-2.5 bg-brown-500 text-white rounded-lg hover:bg-brown-600 disabled:bg-brown-300">
              {isLoading ? "Guardando..." : (isEditing ? "Guardar Cambios" : "Crear Producto")}
            </button>
          </div>
          {/* 💡 --- FIN DEL ARREGLO 2 --- 💡 */}

        </form>
      </div>
    </div>
  );
}