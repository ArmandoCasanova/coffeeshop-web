import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "../hooks/useSnackbar";
import ConfirmModal from "../components/ConfirmModal"; 
import { FiSearch } from "react-icons/fi";
import FilterDropdown from "../components/FilterDropdown";
import ClientRow from "../components/ClientRow";
import ClientModal from "../components/ClientModal";
import { CLIENT_SERVICE } from "../services/client";

const filterOptions = [
  { label: "Todos", value: null },
  { label: "Verificados (Activos)", value: "true" },
  { label: "No Verificados (Inactivos)", value: "false" },
];

const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function Clients() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [isShowDetailsOpen, setIsShowDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [verificationFilter, setVerificationFilter] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const { data, isLoading, error } = useQuery({
    queryKey: ["clients", verificationFilter, searchTerm],
    queryFn: () =>
      CLIENT_SERVICE.getAllClients(
        1,
        50,
        searchTerm || undefined,
        verificationFilter ? verificationFilter === "true" : undefined
      ),
  });

  const deleteMutation = useMutation({
    mutationFn: CLIENT_SERVICE.deleteClient,
    onSuccess: () => {
      showSnackbar({ type: "success", message: "Cliente eliminado" });
      queryClient.invalidateQueries(["clients"]); 
      setIsDeleteModalOpen(false);
      setSelectedClient(null);
    },
    onError: (err) => {
      showSnackbar({
        type: "error",
        message: err.message || "Error al eliminar",
      });
      setIsDeleteModalOpen(false);
    },
  });

  const handleFilterSelect = (option) => {
    setVerificationFilter(option.value);
  };

  const handleShowDetails = (client) => {
    setSelectedClient(client);
    setIsShowDetailsOpen(true);
  };

  const handleOpenDeleteModal = (client) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedClient) {
      deleteMutation.mutate(selectedClient.user_id);
    }
  };

  const formattedClients =
    data?.clients?.map((client) => ({
      id: client.user_id,
      name: client.name,
      last_name: client.last_name,
      email: client.email,
      registration_date: formatDate(client.created_at),
      last_purchase: formatDate(client.last_order_date),
      purchase_count: client.total_orders,
      points: client.points,
      is_verified: client.is_verified,
      ...client,
    })) || [];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-4xl font-bold text-brown-600">Clientes</h1>
      <p className="text-gray-500 mt-1">Administra tus clientes</p>

      <div className="flex flex-wrap items-center justify-between gap-4 mt-8 mb-6">
        <div className="relative grow sm:grow-0 sm:w-2/5 md:w-2/5 lg:w-4/5">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 border border-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        <div className="flex items-center gap-3">
          <FilterDropdown
            options={filterOptions}
            onSelect={handleFilterSelect}
          />
        </div>
      </div>

      <div className="overflow-x-auto mt-6 rounded-lg shadow-lg">
        <table className="w-full min-w-3xl">
          <thead>
            <tr className="border-b text-center align-middle bg-gray-50">
              <th className="border-b-2 border-brown-300 px-4 py-3 text-left w-2/6">
                Cliente
              </th>
              <th className="border-b-2 border-brown-300 px-4 py-3 text-left">
                Email
              </th>
              <th className="border-b-2 border-brown-300 px-4 py-3">
                Registro
              </th>
              <th className="border-b-2 border-brown-300 px-4 py-3">
                Última Compra
              </th>
              <th className="border-b-2 border-brown-300 px-4 py-3">
                N° Compras
              </th>
              <th className="border-b-2 border-brown-300 px-4 py-3">Puntos</th>
              <th className="border-b-2 border-brown-300 px-4 py-3">Estado</th>
              <th className="border-b-2 border-brown-300 px-4 py-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="8" className="text-center p-4">
                  Cargando clientes...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="8" className="text-center p-4 text-red-500">
                  Error al cargar clientes.
                </td>
              </tr>
            ) : formattedClients.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-500">
                  No se encontraron clientes.
                </td>
              </tr>
            ) : (
              formattedClients.map((client) => (
                <ClientRow
                  key={client.id}
                  client={client}
                  onShowDetails={() => handleShowDetails(client)}
                  onDelete={() => handleOpenDeleteModal(client)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedClient && (
        <ClientModal
          client={selectedClient}
          isOpen={isShowDetailsOpen}
          onClose={() => {
            setIsShowDetailsOpen(false);
            setSelectedClient(null);
          }}
        />
      )}

      {selectedClient && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Confirmar Eliminación"
          message={`¿Estás seguro de que deseas eliminar a ${selectedClient.name} ${selectedClient.last_name}? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          confirmColor="bg-red-600 hover:bg-red-700"
          isConfirmLoading={deleteMutation.isLoading}
        />
      )}
    </div>
  );
}

