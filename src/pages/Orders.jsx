import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import OrderRow from "../components/OrderRow";
import FilterDropdown from "../components/FilterDropdown";
import NewOrderModal from "../components/NewOrderModal";
import ConfirmModal from "../components/ConfirmModal";

import seedImg from "../assets/icons/coffee-seed.svg";
import sandClock from "../assets/icons/sand-clock.svg";
import ordersCoffee from "../assets/icons/orders-coffee.svg";

const initialProducts = [
  {
    id: 1,
    name: "Diego RC",
    description: "Caramel Frappuccino, Espresso Americano.",
    price: 230,
    pedido: "0001",
    imageUrl: seedImg,
    status: "en proceso",
    items: [
      { name: "Caramel Frappuccino", quantity: 1, price: 150 },
      { name: "Espresso Americano", quantity: 1, price: 80 },
    ],
  },
  {
    id: 2,
    name: "Fer Salas",
    description: "Latte Vainilla, Espresso Americano.",
    price: 250,
    pedido: "0002",
    imageUrl: seedImg,
    status: "listo",
    items: [
      { name: "Latte Vainilla", quantity: 1, price: 150 },
      { name: "Espresso Americano", quantity: 1, price: 100 },
    ],
  },
  {
    id: 3,
    name: "Eder Rivera",
    description: "Mocha Blanco, Latte Vainilla.",
    price: 65,
    pedido: "0003",
    imageUrl: seedImg,
    status: "listo",
    items: [
      { name: "Mocha Blanco", quantity: 1, price: 35 },
      { name: "Latte Vainilla", quantity: 1, price: 30 },
    ],
  },
  {
    id: 4,
    name: "Lucas Macho",
    description: "Chocolate blanco",
    price: 120,
    pedido: "0004",
    imageUrl: seedImg,
    status: "en proceso",
    items: [{ name: "Chocolate blanco", quantity: 1, price: 120 }],
  },
];

const filterOptions = [
  { label: "Monto", value: "amount" },
  { label: "Cantidad", value: "quantity" },
  { label: "Estado", value: "state" },
];

export default function Orders() {
  const [products, setProducts] = useState(initialProducts);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleFilterSelect = (option) => {
    console.log("Filtro seleccionado:", option);
  };

  const handleOpenNewModal = () => {
    setSelectedProduct(null);
    setIsNewModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setSelectedProduct(product);
    setIsNewModalOpen(true);
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

  const handleSaveOrder = (orderData) => {
    if (selectedProduct) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === selectedProduct.id
            ? {
                ...p,
                name: orderData.customer || p.name,
                description: orderData.items.map((i) => i.name).join(", "),
                price: orderData.total,
                status: orderData.status,
                items: orderData.items,
              }
            : p
        )
      );
      setSelectedProduct(null);
    } else {
      const newOrder = {
        id: Date.now(),
        name: orderData.customer || "Cliente sin nombre",
        description: orderData.items.map((i) => i.name).join(", "),
        price: orderData.total,
        pedido: String(products.length + 1).padStart(4, "0"),
        imageUrl: seedImg,
        status: orderData.status,
        items: orderData.items,
      };
      setProducts((prev) => [...prev, newOrder]);
    }
    setIsNewModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-brown-600">Órdenes</h1>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-8 mb-6">
        <div className="relative w-full sm:w-2/5 md:w-2/5 lg:w-1/3">
          <input
            type="text"
            placeholder="Buscar una orden..."
            className="w-full px-4 py-3 border border-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300"
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
            onClick={handleOpenNewModal}
            className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-5 py-3 bg-brown-300 text-white font-semibold rounded-lg hover:bg-brown-400 transition-colors"
          >
            <FiPlus />
            <span className="hidden sm:inline">Añadir Orden</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="w-full">
          <div className="hidden md:block bg-gray-100 p-2 m-4 rounded-xl">
            <div className="grid grid-cols-[minmax(0,_3fr)_1fr_1fr_100px_100px] gap-2">
              <div className="bg-white rounded-lg p-2 font-bold text-gray-600 text-left px-4">
                Orden
              </div>
              <div className="bg-white rounded-lg p-2 font-bold text-gray-600 text-center">
                Total
              </div>
              <div className="bg-white rounded-lg p-2 font-bold text-gray-600 text-center">
                Pedido
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
              <OrderRow
                key={product.id}
                product={product}
                onEdit={() => handleOpenEditModal(product)}
                onDelete={() => handleOpenDeleteModal(product)}
                sandClockIcon={sandClock}
                ordersCoffeeIcon={ordersCoffee}
              />
            ))}
          </div>
        </div>
      </div>

      <NewOrderModal
        isOpen={isNewModalOpen}
        onClose={() => {
          setIsNewModalOpen(false);
          setSelectedProduct(null);
        }}
        orderData={selectedProduct}
        onSave={handleSaveOrder}
      />

      {selectedProduct && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Confirmar eliminación"
          message="¿Estás seguro de que deseas eliminar esta orden?"
          itemName={selectedProduct.name}
          confirmText="Eliminar"
          cancelText="Cancelar"
          confirmColor="bg-red-600 hover:bg-red-700"
        />
      )}
    </div>
  );
}
