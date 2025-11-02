import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ORDER_SERVICE } from "../services/order";
import { useSnackbar } from "../hooks/useSnackbar";

import OrderRow from "../components/OrderRow";
import FilterDropdown from "../components/FilterDropdown";
import ConfirmModal from "../components/ConfirmModal";

import sandClock from "../assets/icons/sand-clock.svg";
import ordersCoffee from "../assets/icons/orders-coffee.svg";

const filterOptions = [
  { label: "Todas", value: null },
  { label: "Pagadas (En Cola)", value: "paid" },
  { label: "Entregadas", value: "delivered" },
];

export default function Orders() {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const { data, isLoading } = useQuery({
    queryKey: ["orders", statusFilter],
    queryFn: () => ORDER_SERVICE.getAllOrders(1, 20, statusFilter),
  });

  const deleteMutation = useMutation({
    mutationFn: ORDER_SERVICE.deleteOrder,
    onSuccess: () => {
      showSnackbar({ type: "success", message: "Orden eliminada" });
      queryClient.invalidateQueries(["orders"]);
    },
    onError: (err) => {
      showSnackbar({
        type: "error",
        message: err.message || "Error al eliminar",
      });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ORDER_SERVICE.updateOrderStatus,
    onSuccess: () => {
      showSnackbar({
        type: "success",
        message: "Orden marcada como entregada",
      });
      queryClient.invalidateQueries(["orders", statusFilter]);
    },
    onError: (err) => {
      showSnackbar({
        type: "error",
        message: err.message || "Error al actualizar",
      });
    },
  });

  const handleFilterSelect = (option) => {
    setStatusFilter(option.value);
  };

  const handleOpenDeleteModal = (order) => {
    setSelectedOrder(order);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedOrder) {
      deleteMutation.mutate(selectedOrder.id);
      setIsDeleteModalOpen(false);
      setSelectedOrder(null);
    }
  };

  const handleMarkAsReady = (order) => {
    statusMutation.mutate({ orderId: order.id, status: "delivered" });
  };

  const handleOpenNewModal = () => {
    showSnackbar({
      type: "warning",
      message: "Crea nuevas órdenes desde la App móvil.",
    });
  };

  const formattedOrders =
    data?.orders
      ?.filter((order) => {
        const customerName =
          `${order.user.name} ${order.user.lastName}`.toLowerCase();
        const shortOrderId = order.orderId.slice(-6).toUpperCase();
        const search = searchTerm.toLowerCase();

        if (search === "") return true;

        return customerName.includes(search) || shortOrderId.includes(search);
      })
      .map((order) => ({
        id: order.orderId,
        name: `${order.user.name} ${order.user.lastName}`,
        description:
          order.itemsSummaryJson
            ?.map((item) => `${item.name} (x${item.qty})`)
            .join(", ") || "Sin items",
        price: order.totalAmount,
        pedido: order.orderId.slice(-6).toUpperCase(),
        status: order.status,
        ...order,
      })) || [];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-brown-600">Órdenes</h1>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-8 mb-6">
        <div className="relative w-full sm:w-2/5 md:w-2/5 lg:w-1/3">
          <input
            type="text"
            placeholder="Buscar por cliente o N° Pedido..."
            className="w-full px-4 py-3 border border-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
            onClick={handleOpenNewModal}
            className="grow sm:grow-0 flex items-center justify-center gap-2 px-5 py-3 bg-brown-300 text-white font-semibold rounded-lg hover:bg-brown-400 transition-colors"
          >
            <FiPlus />
            <span className="hidden sm:inline">Añadir Orden</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="w-full">
          <div className="hidden md:block bg-gray-100 p-2 m-4 rounded-xl">
            <div className="grid grid-cols-[minmax(0,3fr)_1fr_1fr_100px_100px] gap-2">
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
            {isLoading ? (
              <p className="text-center p-4">Cargando órdenes...</p>
            ) : (
              formattedOrders.map((order) => (
                <OrderRow
                  key={order.id}
                  product={order}
                  onMarkAsReady={() => handleMarkAsReady(order)}
                  onDelete={() => handleOpenDeleteModal(order)}
                  sandClockIcon={sandClock}
                  ordersCoffeeIcon={ordersCoffee}
                />
              ))
            )}
            {!isLoading && formattedOrders.length === 0 && (
              <p className="text-center p-4 text-gray-500">
                No se encontraron órdenes{" "}
                {statusFilter ? `con estatus "${statusFilter}"` : ""}.
              </p>
            )}
          </div>
        </div>
      </div>

      {selectedOrder && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Confirmar eliminación"
          message="¿Estás seguro de que deseas eliminar esta orden?"
          itemName={`Orden de ${selectedOrder.name}`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          confirmColor="bg-red-600 hover:bg-red-700"
        />
      )}
    </div>
  );
}
