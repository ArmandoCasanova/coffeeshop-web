import { FiPlus } from "react-icons/fi";
import ProductRow from "../components/ProductRow";
import FilterDropdown from "../components/FilterDropdown";
import caramelImg from "../assets/images/caramel-frappuccino.png";
import NewProductModal from "../components/NewProductModal";
import { useState } from "react";

const productsData = [
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
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);
  const handleFilterSelect = (option) => {
    console.log("Filtro seleccionado:", option);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-4xl font-bold text-brown-600">Productos</h1>

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
            onClick={() => setIsNewProductModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-brown-300 text-white font-semibold rounded-lg hover:bg-brown-400 transition-colors"
          >
            <FiPlus />
            <span>Añadir Producto</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="min-w-full overflow-x-auto">
          <div className="bg-gray-300 p-2 m-4 rounded-xl">
            <div className="grid grid-cols-[3fr_1fr_1fr_auto] gap-2">
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
          <div>
            {productsData.map((product) => (
              <ProductRow key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
      <NewProductModal
        isOpen={isNewProductModalOpen}
        onClose={() => setIsNewProductModalOpen(false)}
      />
    </div>
  );
}
