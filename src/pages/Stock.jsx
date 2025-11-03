import { useState } from "react";
import { FiPlus } from "react-icons/fi";
// NUEVO: Imports de React Query y Snackbar
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "../hooks/useSnackbar"; // Asumo que este hook está disponible
import { INGREDIENT_SERVICE } from "../services/ingredient"; // Asumo un servicio similar al de Orders

// Componentes
import FilterDropdown from "../components/FilterDropdown";
import ConfirmModal from "../components/ConfirmModal";
import StockRow from "../components/StockRow";
import StockModal from "../components/StockModal";

// NUEVO: Opciones de filtro basadas en el estado del stock (bajo/óptimo)
const filterOptions = [
  { label: "Todos", value: null },
  { label: "Stock Bajo", value: "low" },
  { label: "Stock Óptimo", value: "optimal" },
];

export default function Stock() {  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [stockStatusFilter, setStockStatusFilter] = useState(null);

  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const { data, isLoading } = useQuery({
    queryKey: ["ingredients", stockStatusFilter],
    queryFn: () =>
      INGREDIENT_SERVICE.getAllIngredients(1, 100, stockStatusFilter, searchTerm),
  });

  const deleteMutation = useMutation({
    mutationFn: INGREDIENT_SERVICE.deleteIngredient,
    onSuccess: () => {
      showSnackbar({ type: "success", message: "Producto eliminado" });
      queryClient.invalidateQueries(["ingredients"]);
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    },
    onError: (err) => {
      showSnackbar({
        type: "error",
        message: err.message || "Error al eliminar",
      });
    },
  });

  // NUEVO: Mutación para crear un ingrediente
  const createMutation = useMutation({
    mutationFn: INGREDIENT_SERVICE.createIngredient,
    onSuccess: () => {
      showSnackbar({ type: "success", message: "Producto creado" });
      queryClient.invalidateQueries(["ingredients"]);
      setIsProductModalOpen(false);
    },
    onError: (err) => {
      showSnackbar({
        type: "error",
        message: err.message || "Error al crear",
      });
    },
  });

  // NUEVO: Mutación para actualizar un ingrediente
  const updateMutation = useMutation({
    mutationFn: INGREDIENT_SERVICE.updateIngredient, // Espera { ingredientId, ...data }
    onSuccess: () => {
      showSnackbar({ type: "success", message: "Producto actualizado" });
      queryClient.invalidateQueries(["ingredients"]);
      setIsProductModalOpen(false);
      setSelectedProduct(null);
    },
    onError: (err) => {
      showSnackbar({
        type: "error",
        message: err.message || "Error al actualizar",
      });
    },
  });

  // --- Handlers (Manejo de eventos) ---

  const handleFilterSelect = (option) => {
    setStockStatusFilter(option.value); // Actualiza el estado del filtro
  };

  const handleOpenNewProductModal = () => {
    setSelectedProduct(null); // Asegura que no haya producto seleccionado (modo creación)
    setIsProductModalOpen(true);
  };

  const handleOpenEditProductModal = (product) => {
    setSelectedProduct(product); // Guarda el producto a editar
    setIsProductModalOpen(true);
  };

  const handleOpenDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {

    if (selectedProduct) {
      deleteMutation.mutate(selectedProduct.ingredient_id);
    }
  };

  // NUEVO: Manejador para guardar (decide si crear o actualizar)
  const handleSaveProduct = (productData) => {
    if (selectedProduct) {
      // Modo Edición
      updateMutation.mutate({
        ingredientId: selectedProduct.ingredient_id,
        ...productData,
      });
    } else {
      // Modo Creación
      createMutation.mutate(productData);
    }
  };

  // --- Lógica de Renderizado ---

  // NUEVO: Mapeo y filtro de los datos de la API
  const formattedIngredients =
    data?.ingredients
      ?.filter((ingredient) => {
        // Filtro local por nombre (si la API no lo hace)
        const search = searchTerm.toLowerCase();
        if (search === "") return true;
        return ingredient.name.toLowerCase().includes(search);
      })
      .map((ingredient) => {
        // Derivamos el estado "bajo" u "optimo"
        const status =
          ingredient.stock_current_level < ingredient.stock_optimal_level
            ? "bajo"
            : "optimo";

        // Mapeamos los datos de la API a los props que espera StockRow
        return {
          id: ingredient.ingredient_id,
          name: ingredient.name,
          stock: ingredient.stock_current_level,
          unidad_medida: ingredient.unit_of_measure,
          status: status,
          // Pasamos el resto de los datos originales por si StockModal los necesita
          ...ingredient,
        };
      }) || [];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-brown-600">Stock</h1>
      <p className="text-gray-500 mt-1">Revisa el stock disponible</p>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-8 mb-6">
        <div className="relative w-full sm:w-2/5 md:w-2/5 lg:w-1/3">
          <input
            type="text"
            placeholder="Buscar un producto..."
            className="w-full px-4 py-3 border border-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300"
            // NUEVO: Conectado al estado
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="grow">
            <FilterDropdown
              options={filterOptions} // Opciones de filtro actualizadas
              onSelect={handleFilterSelect}
            />
          </div>
          <button
            onClick={handleOpenNewProductModal}
            className="grow sm:grow-0 flex items-center justify-center gap-2 px-5 py-3 bg-brown-300 text-white font-semibold rounded-lg hover:bg-brown-400 transition-colors"
          >
            <FiPlus />
            <span className="hidden sm:inline">Añadir Producto</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="w-full">
          <div className="hidden md:block bg-gray-100 p-2 m-4 rounded-xl">
            <div className="grid grid-cols-[minmax(0,3fr)_1fr_1fr_1fr_100px] gap-2">
              <div className="bg-white rounded-lg p-2 font-bold text-gray-600 text-left px-4">
                Nombre
              </div>
              <div className="bg-white rounded-lg p-2 font-bold text-gray-600 text-center">
                Cantidad actual
              </div>
              <div className="bg-white rounded-lg p-2 font-bold text-gray-600 text-center">
                Unidad
              </div>
              <div className="bg-white rounded-lg p-2 font-bold text-gray-600 text-center">
                Estado
              </div>
              <div className="bg-white rounded-lg p-2 font-bold text-gray-600 text-center">
                Acciones
              </div>
            </div>
          </div>

          <div className="space-y-3 md:space-y-0 p-2 sm:p-4">
            {/* NUEVO: Lógica de carga y renderizado de lista */}
            {isLoading ? (
              <p className="text-center p-4">Cargando inventario...</p>
            ) : (
              formattedIngredients.map((product) => (
                <StockRow
                  key={product.id}
                  product={product} // Pasa el producto formateado
                  onEdit={() => handleOpenEditProductModal(product)}
                  onDelete={() => handleOpenDeleteModal(product)}
                />
              ))
            )}
            {!isLoading && formattedIngredients.length === 0 && (
              <p className="text-center p-4 text-gray-500">
                No se encontraron productos
                {stockStatusFilter ? ` con filtro "${stockStatusFilter}"` : ""}
                {searchTerm ? ` para "${searchTerm}"` : ""}.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* El modal de producto ahora es controlado por las mutaciones */}
      <StockModal
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
        productData={selectedProduct} // Pasa el producto original de la API para edición
        onSave={handleSaveProduct} // Este handler llamará a create/updateMutation
      />

      {/* El modal de confirmación ahora usa deleteMutation */}
      {selectedProduct && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Confirmar eliminación"
          message="¿Estás seguro de que deseas eliminar este producto?"
          itemName={selectedProduct.name}
          confirmText="Eliminar"
          cancelText="Cancelar"
          confirmColor="bg-red-600 hover:bg-red-700"
          // NUEVO: Deshabilita el botón mientras se elimina
          isConfirmLoading={deleteMutation.isLoading}
        />
      )}
    </div>
  );
}