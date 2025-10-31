import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import ProductRow from "../components/ProductRow";
import FilterDropdown from "../components/FilterDropdown";
import NewProductModal from "../components/NewProductModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import caramelImg from "../assets/images/caramel-frappuccino.png"; // Imagen de ejemplo

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
  // --- ESTADOS ---
  const [products, setProducts] = useState(initialProducts); // Para que la lista se actualice al borrar
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // --- MANEJADORES DE EVENTOS ---
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
      // Filtra la lista de productos para remover el seleccionado
      setProducts(products.filter((p) => p.id !== selectedProduct.id));
      console.log("Eliminando producto con ID:", selectedProduct.id);
      setIsDeleteModalOpen(false); // Cierra el modal
      setSelectedProduct(null); // Limpia la selección
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-4xl font-bold text-brown-600">Productos</h1>

      {/* --- BARRA DE BÚSQUEDA Y BOTONES --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-8 mb-6">
        <div className="relative grow sm:grow-0 sm:w-2/5 md:w-2/5 lg:w-1/3">
          <input
            type="text"
            placeholder="Buscar un producto..."
            className="w-full px-4 py-3 border border-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300"
          />
        </div>
        <div className="flex items-center gap-3">
          <FilterDropdown
            options={filterOptions}
            onSelect={handleFilterSelect}
          />
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-brown-300 text-white font-semibold rounded-lg hover:bg-brown-400 transition-colors"
          >
            <FiPlus />
            <span>Añadir Producto</span>
          </button>
        </div>
      </div>

      {/* --- TABLA DE PRODUCTOS --- */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="min-w-full overflow-x-auto">
          {/* Encabezado */}
          <div className="bg-gray-300 p-2 m-4 rounded-xl">
            <div className="grid grid-cols-[minmax(0,_3fr)_minmax(0,_1fr)_minmax(0,_1fr)_120px] gap-2">
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
          {/* Filas */}
          <div>
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

      {/* --- MODALES --- */}
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
          itemName={selectedProduct.name} // Usamos una prop genérica como "itemName"
        />
      )}
    </div>
  );
}
