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

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

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
  });

  const createMutation = useMutation({
    mutationFn: PRODUCT_SERVICE.createProduct,
    onSuccess: () => {
      showSnackbar({ type: "success", message: "Producto creado" });
      queryClient.invalidateQueries(["products"]);
      setIsNewModalOpen(false);
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
  });

  const handleFilterSelect = (option) => {
    setSearchTerm("");
    setFilter(option);
  };

  const handleConfirmDelete = () => {
    if (selectedProduct) {
      deleteMutation.mutate(selectedProduct.product_id);
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleSaveProduct = async (formData) => {
    const {
      name,
      basePrice,
      isAvailable,
      imageFile,
      existingImageUrl,
      categoryId,
      sizes,
    } = formData;

    let finalImageUrl = existingImageUrl || "";

    if (imageFile) {
      const formDataImg = new FormData();
      formDataImg.append("image", imageFile);
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        { method: "POST", body: formDataImg }
      );
      const result = await res.json();
      if (result.success) {
        finalImageUrl = result.data.url;
      }
    }

    const apiPayload = {
      name,
      base_price: basePrice,
      is_available: isAvailable,
      image_url: finalImageUrl,
      category_id: categoryId,
      customization_details_json: { sizes },
    };

    if (isEditModalOpen) {
      updateMutation.mutate({
        productId: selectedProduct.product_id,
        data: apiPayload,
      });
    } else {
      createMutation.mutate(apiPayload);
    }
  };

  const products =
    productData?.products?.map((p) => ({
      id: p.product_id,
      name: p.name,
      description: p.category_info_json?.category_name || "Producto",
      price: p.base_price,
      available: p.is_available,
      imageUrl: p.image_url,
      ...p,
    })) || [];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-brown-600">
        Productos
      </h1>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-8 mb-6">
        <div className="relative w-full sm:w-2/5">
          <input
            type="text"
            placeholder="Buscar un producto..."
            className="w-full px-4 py-3 border border-brown-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setFilter(null);
            }}
          />
        </div>
        <div className="flex items-center gap-3">
          <FilterDropdown
            options={filterOptions}
            onSelect={handleFilterSelect}
          />
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-brown-300 text-white rounded-lg hover:bg-brown-400"
          >
            <FiPlus />
            <span>Añadir Producto</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <p className="p-4 text-center">Cargando productos...</p>
        ) : (
          products.map((product) => (
            <ProductRow
              key={product.id}
              product={product}
              onEdit={() => {
                setSelectedProduct(product);
                setIsEditModalOpen(true);
              }}
              onDelete={() => {
                setSelectedProduct(product);
                setIsDeleteModalOpen(true);
              }}
            />
          ))
        )}
        {!isLoading && products.length === 0 && (
          <p className="p-4 text-center text-gray-500">
            No se encontraron productos.
          </p>
        )}
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
        productData={selectedProduct}
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
