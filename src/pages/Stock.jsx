import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import FilterDropdown from "../components/FilterDropdown";
import ConfirmModal from "../components/ConfirmModal";
import StockRow from "../components/StockRow";
import StockModal from "../components/StockModal";

const initialProducts = [
  {
    id: 1,
    name: "Café en Grano - Origen Único", 
    stock: 230,
    unidad_medida: "kg",
    price: 120,
    status: "bajo", 
  },
  {
    id: 2,
    name: "Leche entera",
    stock: 250,
    unidad_medida: "lt",
    price: 120,
    status: "optimo",
  },
  {
    id: 3,
    name: "Cacao molido",
    stock: 65,
    unidad_medida: "kg",
    price: 150,
    status: "optimo",
  },
  {
    id: 4,
    name: "Vasos desechables Medios",
    stock: 120,
    unidad_medida: "pzas",
    price: 80,
    status: "bajo",
  },
];

const filterOptions = [
  { label: "Monto", value: "amount" },
  { label: "Cantidad", value: "quantity" },
  { label: "Estado", value: "state" },
];

export default function Stock() {
  const [products, setProducts] = useState(initialProducts);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleFilterSelect = (option) => {
    console.log("Filtro seleccionado:", option);
  };

  const handleOpenNewProductModal = () => {
    setSelectedProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProductModal = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleOpenDeleteModal = (product) => {
    setSelectedProduct(product);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedProduct) {
      setProducts(products.filter((p) => p.id !== selectedProduct.id));
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleSaveProduct = (productData) => {
    if (selectedProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === selectedProduct.id ? { ...p, ...productData } : p
        )
      );
    } else {
      const newProduct = {
        id: Date.now(),
        ...productData,
      };
      setProducts((prev) => [newProduct, ...prev]); 
    }
    setIsProductModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-brown-600">Stock</h1>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-8 mb-6">
        <div className="relative w-full sm:w-2/5 md:w-2/5 lg:w-1/3">
          <input
            type="text"
            placeholder="Buscar un producto..."
            className="w-full px-4 py-3 border border-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300"
          />
        </div>
        <div className="flex w-full sm:w-auto items-center gap-3">
          <div className="grow">
            <FilterDropdown
              options={filterOptions}
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
            <div className="grid grid-cols-[minmax(0,3fr)_1fr_1fr_1fr_1fr_100px] gap-2">
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
                Costo/unidad
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
            {products.map((product) => (
              <StockRow
                key={product.id}
                product={product}
                onEdit={() => handleOpenEditProductModal(product)}
                onDelete={() => handleOpenDeleteModal(product)}
              />
            ))}
          </div>
        </div>
      </div>

      <StockModal 
        isOpen={isProductModalOpen}
        onClose={() => {
          setIsProductModalOpen(false);
          setSelectedProduct(null);
        }}
        productData={selectedProduct}
        onSave={handleSaveProduct} 
      />

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
        />
      )}
    </div>
  );
}