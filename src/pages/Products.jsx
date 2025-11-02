import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PRODUCT_SERVICE } from "../services/productService";
import { useSnackbar } from "../hooks/useSnackbar";

import ProductRow from "../components/ProductRow";
import FilterDropdown from "../components/FilterDropdown";
import NewProductModal from "../components/NewProductModal";
import ConfirmModal from "../components/ConfirmModal";

const filterOptions = [
  { label: "Todos", value: null },
  { label: "Más vendidos", value: "best-sellers" },
  { label: "Disponibles", value: "available" },
  { label: "No disponibles", value: "unavailable" },
];

export default function Products() {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [filter, setFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const { data, isLoading: isLoadingList } = useQuery({
    queryKey: ["products", filter, searchTerm],
    queryFn: () =>
      PRODUCT_SERVICE.getAllProducts(1, 20, filter?.value, searchTerm),
    enabled: !searchTerm,
  });

  const { data: searchData, isLoading: isSearching } = useQuery({
    queryKey: ["productsSearch", searchTerm],
    queryFn: () => PRODUCT_SERVICE.getAllProducts(1, 20, null, searchTerm),
    enabled: !!searchTerm,
  });

  const isLoading = isLoadingList || isSearching;
  const productData = searchTerm ? searchData : data;

  const deleteMutation = useMutation({
    mutationFn: PRODUCT_SERVICE.deleteProduct,
    onSuccess: () => {
      showSnackbar({ type: "success", message: "Producto eliminado" });
      queryClient.invalidateQueries(["products"]);
    },
    onError: (err) => {
      showSnackbar({
        type: "error",
        message: err.message || "Error al eliminar",
      });
    },
  });

  const createMutation = useMutation({
    mutationFn: PRODUCT_SERVICE.createProduct,
    onSuccess: () => {
      showSnackbar({ type: "success", message: "Producto creado" });
      queryClient.invalidateQueries(["products"]);
      setIsNewModalOpen(false);
    },
    onError: (err) => {
      showSnackbar({ type: "error", message: err.message || "Error al crear" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ productId, data }) =>
      PRODUCT_SERVICE.updateProduct(productId, data),
    onSuccess: () => {
      showSnackbar({ type: "success", message: "Producto actualizado" });
      queryClient.invalidateQueries(["products"]);
      setIsEditModalOpen(false);
      setSelectedProduct(null);
    },
    onError: (err) => {
      showSnackbar({
        type: "error",
        message: err.message || "Error al actualizar",
      });
    },
  });

  const handleFilterSelect = (option) => {
    setSearchTerm("");
    setFilter(option);
  };

  const handleOpenEditModal = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProduct) {
      deleteMutation.mutate(selectedProduct.productId);
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleSaveProduct = (formData) => {
    // La API espera base_price (snake_case)
    const apiData = {
      ...formData,
      basePrice: formData.price, // Asegura el nombre correcto
    };

    if (isEditModalOpen) {
      updateMutation.mutate({
        productId: selectedProduct.productId,
        data: apiData,
      });
    } else {
      createMutation.mutate(apiData);
    }
  };

  // --- ¡AQUÍ ESTÁ LA CORRECCIÓN! ---
  // Mapeamos 'base_price' y 'image_url' (con guion bajo)
  // a 'price' y 'imageUrl' para que 'ProductRow' los entienda.
  const products =
    productData?.products?.map((p) => ({
      id: p.product_id, // <-- Corregido
      name: p.name,
      description: p.category_info_json?.category_name || "Producto",
      price: p.base_price, // <-- Corregido
      available: p.is_available, // <-- Corregido
      imageUrl: p.image_url, // <-- Corregido
      ...p,
    })) || [];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-brown-600">
        Productos
      </h1>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-8 mb-6">
        <div className="relative w-full sm:w-2/5 md:w-2/5 lg:w-1/3">
          <input
            type="text"
            placeholder="Buscar un producto..."
            className="w-full px-4 py-3 border border-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setFilter(null);
            }}
          />
        </div>
        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="flex-grow">
            <FilterDropdown
              options={filterOptions}
              onSelect={handleFilterSelect}
            />
          </div>
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-5 py-3 bg-brown-300 text-white font-semibold rounded-lg hover:bg-brown-400 transition-colors"
          >
            <FiPlus />
            <span className="hidden sm:inline">Añadir Producto</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="w-full">
          <div className="hidden md:block bg-gray-100 p-2 m-4 rounded-xl">
            <div className="grid grid-cols-[minmax(0,_3fr)_1fr_1fr_120px] gap-2">
              <div className="bg-white rounded-lg p-2 font-bold text-gray-600 text-left px-4">
                Producto
              </div>
              <div className="bg-white rounded-lg p-2 font-bold text-gray-600 text-center">
                Precio
              </div>
              <div className="bg-white rounded-lg p-2 font-bold text-gray-600 text-center">
                Disponible
              </div>
              <div className="bg-white rounded-lg p-2 font-bold text-gray-600 text-center">
                Acción
              </div>
            </div>
          </div>

          <div className="space-y-3 md:space-y-0 p-2 sm:p-4">
            {isLoading ? (
              <p className="p-4 text-center">Cargando productos...</p>
            ) : (
              products.map((product) => (
                <ProductRow
                  key={product.id}
                  product={product}
                  onEdit={() => handleOpenEditModal(product)}
                  onDelete={() => handleOpenDeleteModal(product)}
                />
              ))
            )}
            {!isLoading && products.length === 0 && (
              <p className="p-4 text-center text-gray-500">
                No se encontraron productos.
              </p>
            )}
          </div>
        </div>
      </div>

      <NewProductModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSave={handleSaveProduct}
        isLoading={createMutation.isPending}
      />

      <NewProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        productData={selectedProduct} // Aquí se usan los datos con snake_case
        onSave={handleSaveProduct}
        isLoading={updateMutation.isPending}
      />

      {selectedProduct && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          itemName={selectedProduct.name}
          isLoading={deleteMutation.isPending}
        />
      )}
    </div>
  );
}
