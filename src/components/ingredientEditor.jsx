import { useState, useMemo } from "react"; // 💡 Añadido useMemo
import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { INGREDIENT_SERVICE } from "../services/ingredientService";

export default function IngredientEditor({ value = [], onChange }) {
  const [selectedIngredientId, setSelectedIngredientId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { data: allIngredients = [], isLoading } = useQuery({
    queryKey: ["allIngredients"],
    queryFn: INGREDIENT_SERVICE.getAllIngredients,
    staleTime: 1000 * 60 * 5,
  });

  // 💡 --- ARREGLO 1: NOMBRES DE INGREDIENTES ---
  // Creamos un 'Map' para buscar nombres por ID de forma ultra-rápida.
  // Usamos useMemo para que esto no se recalcule en cada render.
  const ingredientNameMap = useMemo(() => {
    return new Map(allIngredients.map(ing => [ing.ingredient_id, ing.name]));
  }, [allIngredients]);
  // 💡 --- FIN DEL ARREGLO 1 ---

  const selectedIds = new Set(value.map(v => v.ingredientId));
  const availableIngredients = allIngredients.filter(
    (ing) => !selectedIds.has(ing.ingredient_id)
  );

  const handleAddIngredient = () => {
    if (!selectedIngredientId) return;

    const ingredient = allIngredients.find(
      (ing) => ing.ingredient_id === selectedIngredientId
    );
    if (!ingredient) return;

    const newItem = {
      ingredientId: ingredient.ingredient_id,
      name: ingredient.name,
      quantity: parseFloat(quantity) || 1, 
      unit: ingredient.unit_of_measure,
    };

    onChange([...value, newItem]);
    setSelectedIngredientId("");
    setQuantity(1);
  };

  const handleRemoveIngredient = (idToRemove) => {
    onChange(value.filter((item) => item.ingredientId !== idToRemove));
  };

  return (
    <div className="bg-brown-50 p-4 rounded-lg border border-brown-200 space-y-4">
      <h3 className="text-lg font-bold text-brown-800">
        Ingredientes Requeridos
      </h3>
      
      <div className="space-y-2">
        {value.length === 0 && (
            <p className="text-sm text-gray-500">Aún no se han añadido ingredientes.</p>
        )}
        {value.map((item, index) => ( 
          <div key={item.ingredientId || index} className="flex items-center gap-2 p-2 bg-white rounded-lg border">
            <span className="flex-1 font-medium text-gray-700">
              {/* 💡 ARREGLO 1 (aplicado):
                  Si 'item.name' existe (recién añadido), lo usa.
                  Si no (cargado de DB), busca el nombre en el 'ingredientNameMap'.
              */}
              {item.name || ingredientNameMap.get(item.ingredientId) || "Cargando..."}
            </span>
            <span className="w-20 px-2 py-1 text-center bg-gray-100 rounded">
              {item.quantity}
            </span>
            <span className="w-16 text-sm text-gray-500">{item.unit}</span>
            <button
              type="button"
              onClick={() => handleRemoveIngredient(item.ingredientId)}
              className="p-1 text-red-500 rounded-full hover:bg-red-100"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <hr />

      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Ingrediente</label>
          <select
            value={selectedIngredientId}
            onChange={(e) => setSelectedIngredientId(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"
            disabled={isLoading}
          >
            <option value="" disabled>
              {isLoading ? "Cargando..." : "Selecciona un ingrediente"}
            </option>
            {availableIngredients.map((ing) => (
              <option key={ing.ingredient_id} value={ing.ingredient_id}>
                {ing.name} ({ing.unit_of_measure})
              </option>
            ))}
          </select>
        </div>
        
        <div className="w-24">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Cantidad</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="0.1"
            step="0.1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm"
          />
        </div>
        
        <button
          type="button"
          onClick={handleAddIngredient}
          disabled={!selectedIngredientId}
          className="px-4 py-3 bg-brown-500 text-white font-semibold rounded-lg hover:bg-brown-600 disabled:bg-brown-300 transition-colors"
        >
          <FiPlus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}