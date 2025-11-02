import { FiPlus } from "react-icons/fi";
import FilterDropdown from "../components/FilterDropdown";
import ClientRow from "../components/ClientRow";
import { useState } from "react";
import ClientModal from "../components/ClientModal";

const filterOptions = [
  { label: "Todos", value: "all" },
  { label: "Activos", value: "active" },
  { label: "Inactivos", value: "inactive" },
];

const mockClients = [
  {
    id: 1,
    name: "Juan",
    last_name: "Perez",
    email: "juan.perez@example.com",
    registration_date: "2023-01-15",
    last_purchase: "2024-06-10",
    purchase_count: 5,
    points: 100,
    status: "Activo",
    ordenes: [
      { noOrden: "0001", fecha: "2024-05-20", total: 55.75 },
      { noOrden: "0002", fecha: "2024-04-10", total: 12.30 },
    ],
    estadisticas: {
      comprasTotales: 5, 
      totalGastado: 250.00, 
    },
  },
  {
    id: 2,
    name: "Maria",
    last_name: "Gomez",
    email: "maria.gomez@example.com",
    registration_date: "2023-02-20",
    last_purchase: "2024-06-15",
    purchase_count: 3,
    points: 50,
    status: "Inactivo",
    ordenes: [], 
    estadisticas: {
      comprasTotales: 3,
      totalGastado: 75.50,
    },
  },
];

export default function Clients() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [isShowDetailsOpen, setIsShowDetailsOpen] = useState(false);

  const handleFilterSelect = (option) => {
    console.log("Filtro seleccionado:", option);
  };

  const handleShowDetails = (client) => {
    setSelectedClient(client);
    setIsShowDetailsOpen(true);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-4xl font-bold text-brown-600">Clientes</h1>
      <p className="text-gray-500 mt-1">Nuevos Clientes</p>
      <div className="flex flex-wrap items-center justify-between gap-4 mt-8 mb-6">
        <div className="relative grow sm:grow-0 sm:w-2/5 md:w-2/5 lg:w-4/5">
          <input
            type="text"
            placeholder="Buscar un cliente..."
            className="w-full px-4 py-3 border border-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300"
          />
        </div>
        <div className="flex items-center gap-3">
          <FilterDropdown
            options={filterOptions}
            onSelect={handleFilterSelect}
          />
          <button
            // onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-brown-300 text-white font-semibold rounded-lg hover:bg-brown-200 transition-colors"
          >
            <FiPlus />
            <span>Añadir Cliente</span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto mt-6 rounded-lg shadow-lg">
        <table className="w-full min-w-3xl">
          <thead>
            <tr className="border-b text-center align-middle bg-gray-50">
              <th className="border-b-2 border-brown-300 px-4 py-3">
                Nombre del Cliente
              </th>
              <th className="border-b-2 border-brown-300 px-4 py-3 ">Email</th>
              <th className="border-b-2 border-brown-300 px-2 py-3 w-[120px]">
                Fecha de Registro
              </th>
              <th className="border-b-2 border-brown-300 px-4 py-3">
                Last Purchase
              </th>
              <th className="border-b-2 border-brown-300 px-4 py-3 w-[120px]">
                N° de Compras
              </th>
              <th className="border-b-2 border-brown-300 px-4 py-3">Puntos</th>
              <th className="border-b-2 border-brown-300 px-4 py-3">Estatus</th>
            </tr>
          </thead>

          <tbody>
            {mockClients.map((client) => (
              <ClientRow
                key={client.id}
                client={client}
                onShowDetails={() => handleShowDetails(client)}
              />
            ))}
          </tbody>
        </table>
      </div>
      {selectedClient && (
        <ClientModal
          clienteInicial={selectedClient}
          isOpen={isShowDetailsOpen}
          onClose={() => setIsShowDetailsOpen(false)}
        />
      )}
    </div>
  );
}
