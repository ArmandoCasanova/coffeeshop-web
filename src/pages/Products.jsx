import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import ProductRow from "../components/ProductRow";
import FilterDropdown from "../components/FilterDropdown";
import NewProductModal from "../components/NewProductModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import caramelImg from "../assets/images/caramel-frappuccino.png";

const initialProducts = [
  {
    id: 1,
    name: "Caramel Frappuccino",
    description: "Bebida a base de caramelo, café y leche.",
    price: 35,
    available: true,
    imageUrl: caramelImg,
  },
  {
    id: 2,
    name: "Espresso Americano",
    description: "Café espresso diluido con agua caliente.",
    price: 25,
    available: true,
    imageUrl: caramelImg,
  },
  {
    id: 3,
    name: "Latte Vainilla",
    description: "Espresso con leche vaporizada y vainilla.",
    price: 30,
    available: false,
    imageUrl: caramelImg,
  },
  {
    id: 4,
    name: "Mocha Blanco",
    description: "Chocolate blanco, espresso y leche.",
    price: 40,
    available: true,
    imageUrl: caramelImg,
  },
];

const filterOptions = [
  { label: "Más vendidos", value: "best-sellers" },
  { label: "Disponibles", value: "available" },
  { label: "No disponibles", value: "unavailable" },
];

export default function Products() {
  const [products, setProducts] = useState(initialProducts);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleFilterSelect = (option) => {
    console.log("Filtro seleccionado:", option);
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
      setProducts(products.filter((p) => p.id !== selectedProduct.id));
      console.log("Eliminando producto con ID:", selectedProduct.id);
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      {/* Título ajustado para móviles */}
      <h1 className="text-3xl sm:text-4xl font-bold text-brown-600">
        Productos
      </h1>

      {/* Barra de búsqueda y botones (ya es bastante responsive) */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-8 mb-6">
        <div className="relative grow sm:grow-0 sm:w-2/fivth md:w-2/fivth lg:w-1/3">
          <input
            type="text"
            placeholder="Buscar un producto..."
            className="w-full px-4 py-3 border border-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300"
          />
        </div>
        <div className="flex w-full sm:w-auto items-center gap-3">
          <FilterDropdown
            options={filterOptions}
            onSelect={handleFilterSelect}
          />
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-5 py-3 bg-brown-300 text-white font-semibold rounded-lg hover:bg-brown-400 transition-colors"
          >
            <FiPlus />
            {/* El texto se oculta en pantallas muy pequeñas para ahorrar espacio */}
            <span className="hidden sm:inline">Añadir Producto</span>
          </button>
        </div>
      </div>

      {/* Contenedor de la lista */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="w-full">
          {/* Encabezado: Se oculta en móvil (md:grid) y se muestra en pantallas medianas y grandes */}
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

          {/* Filas de productos */}
          <div className="space-y-3 md:space-y-0 p-2 sm:p-4">
            {products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                onEdit={() => handleOpenEditModal(product)}
                onDelete={() => handleOpenDeleteModal(product)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modales */}
      <NewProductModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
      />
      <NewProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        productData={selectedProduct}
      />
      {selectedProduct && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          itemName={selectedProduct.name}
        />
      )}
    </div>
  );
}
