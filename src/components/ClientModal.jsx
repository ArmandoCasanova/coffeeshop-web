import React, { useState, useEffect } from "react";

const ClientModal = ({ isOpen, onClose, clienteInicial }) => {
  const [isEditing, setIsEditing] = useState(false);
  // Usamos 'clientData' para los cambios que se realizan en el modal
  const [clientData, setClientData] = useState(clienteInicial);

  // Efecto para sincronizar clientData con clienteInicial cada vez que el modal se abre
  // o el clienteInicial cambia (ej. al seleccionar un cliente diferente)
  useEffect(() => {
    if (isOpen) {
      setClientData(clienteInicial);
      setIsEditing(false); 
    }
  }, [isOpen, clienteInicial]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClientData((prevClientData) => ({
      ...prevClientData,
      [name]: value,
    }));
  };

  const handleSave = () => {
    console.log("Cliente guardado:", clientData);
    // Idealmente, aquí también llamarías a una función pasada por prop
    // para actualizar el estado del cliente en el componente padre
    // Por ejemplo: onUpdateClient(clientData);
    setIsEditing(false); 
  };

  const handleCloseModal = () => {
    setClientData(clienteInicial);
    setIsEditing(false);
    onClose();
  };

  const renderEditableField = (label, name, value) => (
    <div className="flex justify-between items-center mb-2">
      <span className="font-semibold text-gray-700 w-1/3">{label}:</span>
      {isEditing ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleInputChange}
          className="flex-1 border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      ) : (
        <span className="flex-1 text-gray-900">{value}</span>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 backdrop-blur-sm backdrop-filter flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg md:max-w-xl lg:max-w-2xl overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            Detalles del Cliente
          </h2>
          <button
            onClick={handleCloseModal}
            className="text-gray-500 hover:text-gray-700 text-2xl font-semibold"
            aria-label="Cerrar"
          >
            &times;
          </button>
        </div>

        <div className="p-6 max-h-[80vh] overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Información General
            </h3>
            <div className="flex items-start mb-4">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 text-3xl font-bold mr-4 shrink-0">
                {clientData.name ? clientData.name.charAt(0) : ""}
              </div>
              <div className="grow">
                {renderEditableField("Nombre", "name", clientData.name)}
                {renderEditableField("Email", "email", clientData.email)}
                {renderEditableField("Estado", "status", clientData.status)}
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Historial de Órdenes
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                      No. Orden
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                      Fecha
                    </th>
                    <th className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-600">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {clientData.ordenes &&
                    clientData.ordenes.map((orden) => (
                      <tr key={orden.noOrden} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                            {orden.noOrden}
                          </span>
                        </td>
                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                          {orden.fecha}
                        </td>
                        <td className="py-2 px-4 border-b text-sm text-gray-800">
                          ${orden.total.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Estadísticas Clave
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-semibold text-gray-700">
                  Compras Totales:
                </span>{" "}
                {clientData.estadisticas?.comprasTotales || 0}
              </div>
              <div>
                <span className="font-semibold text-gray-700">
                  Total Gastado:
                </span>{" "}
                $
                {clientData.estadisticas?.totalGastado
                  ? clientData.estadisticas.totalGastado.toFixed(2)
                  : "0.00"}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3 bg-gray-50">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-150 ease-in-out w-full sm:w-auto"
              >
                Guardar Cambios
              </button>
              <button
                onClick={() => {
                  setClientData(clienteInicial); 
                  setIsEditing(false);
                }}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition duration-150 ease-in-out w-full sm:w-auto"
              >
                Cancelar Edición
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-150 ease-in-out w-full sm:w-auto"
            >
              Editar Cliente
            </button>
          )}
          <button
            onClick={() => console.log("Ver todas las órdenes")}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition duration-150 ease-in-out w-full sm:w-auto"
          >
            Ver Todas las Órdenes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClientModal;