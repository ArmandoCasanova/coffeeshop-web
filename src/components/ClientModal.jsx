import React, { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CLIENT_SERVICE } from "../services/client";
import { useSnackbar } from "../hooks/useSnackbar";
import { FiTrash2 } from "react-icons/fi";
import ConfirmModal from "../components/ConfirmModal";

const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  return new Date(isoString).toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "$0.00";
  return amount.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN",
  });
};

const fromISO = (isoString) => {
  if (!isoString) return "";
  return isoString.split("T")[0];
};

const ClientModal = ({ isOpen, onClose, client }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isOpen && client) {
      setFormData({
        name: client.name || "",
        last_name: client.last_name || "",
        email: client.email || "",
        birth_date: fromISO(client.birth_date),
        role: client.role || "customer",
        points: client.points || 0,
      });
      setIsEditing(false); 
    }
  }, [isOpen, client]);

  const updateMutation = useMutation({
    mutationFn: CLIENT_SERVICE.updateClient,
    onSuccess: () => {
      showSnackbar({
        type: "success",
        message: "Cliente actualizado",
      });
      queryClient.invalidateQueries(["clients"]);
      setIsEditing(false);
      onClose();
    },
    onError: (err) => {
      showSnackbar({
        type: "error",
        message: err.message || "Error al actualizar",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: CLIENT_SERVICE.deleteClient,
    onSuccess: () => {
      showSnackbar({ type: "success", message: "Cliente eliminado" });
      queryClient.invalidateQueries(["clients"]);
      setIsDeleteConfirmOpen(false); 
      onClose(); 
    },
    onError: (err) => {
      showSnackbar({
        type: "error",
        message: err.message || "Error al eliminar",
      });
      setIsDeleteConfirmOpen(false); 
    },
  });

  if (!isOpen || !client) return null;

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSave = () => {
    updateMutation.mutate({
      userId: client.user_id,
      ...formData,
    });
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(client.user_id);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
    onClose();
  };

  const renderEditableField = (label, name, value, type = "text") => (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
      <span className="font-semibold text-gray-700 w-full sm:w-1/3 mb-1 sm:mb-0">
        {label}:
      </span>
      {isEditing ? (
        <input
          type={type}
          name={name}
          value={value}
          onChange={handleInputChange}
          min={type === "number" ? "0" : undefined}
          className="flex-1 border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      ) : (
        <span className="flex-1 text-gray-900">{value}</span>
      )}
    </div>
  );

  const renderRoleSelector = () => (
    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
      <span className="font-semibold text-gray-700 w-full sm:w-1/3 mb-1 sm:mb-0">
        Rol:
      </span>
      {isEditing ? (
        <select
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          className="flex-1 border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
        >
          <option value="customer">Cliente</option>
          <option value="admin">Admin</option>
        </select>
      ) : (
        <span className="flex-1 text-gray-900 capitalize">
          {client.role}
        </span>
      )}
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm backdrop-filter flex justify-center items-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg md:max-w-xl lg:max-w-2xl overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-brown-800">
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
              <h3 className="text-xl font-semibold text-brown-600 mb-4">
                Información General
              </h3>
              <div className="flex items-start mb-4">
                <div className="w-20 h-20 bg-brown-200 rounded-full flex items-center justify-center text-white text-3xl font-bold mr-4 shrink-0">
                  {client.name ? client.name.charAt(0) : ""}
                  {client.last_name ? client.last_name.charAt(0) : ""}
                </div>
                <div className="grow">
                  {renderEditableField("Nombre", "name", formData.name)}
                  {renderEditableField(
                    "Apellido",
                    "last_name",
                    formData.last_name
                  )}
                  {renderEditableField("Email", "email", formData.email)}
                  {renderEditableField(
                    "Fec. Nacimiento",
                    "birth_date",
                    formData.birth_date,
                    "date"
                  )}
                  {renderRoleSelector()}

                  <div className="mt-4 pt-2 border-t">
                    {renderEditableField(
                      "Puntos",
                      "points",
                      formData.points,
                      "number"
                    )}
                  </div>

                  <div className="flex justify-between items-center mb-2 mt-2">
                    <span className="font-semibold text-gray-700 w-1/3">
                      Estado:
                    </span>
                    <span className="flex-1 text-gray-900">
                      {client.is_verified ? "Verificado" : "No Verificado"}
                    </span>
                  </div>
                </div>
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
                  {client.total_orders || 0}
                </div>
                <div>
                  <span className="font-semibold text-gray-700">
                    Total Gastado:
                  </span>{" "}
                  {formatCurrency(client.total_spent)}
                </div>
              </div>
            </div>

            <div className="mb-6 mt-6">
              <h3 className="text-xl font-semibold text-brown-600 mb-4">
                Historial de Órdenes Recientes
              </h3>
              <div className="overflow-x-auto max-h-48 overflow-y-auto border rounded-lg">
                <table className="min-w-full bg-white">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="py-2 px-4 border-b border-brown-300 text-left text-sm font-bold text-brown-600">
                        ID Orden (Corto)
                      </th>
                      <th className="py-2 px-4 border-b border-brown-300 text-left text-sm font-bold text-brown-600">
                        Fecha
                      </th>
                      <th className="py-2 px-4 border-b border-brown-300 text-left text-sm font-bold text-brown-600">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {client.completed_orders &&
                    client.completed_orders.length > 0 ? (
                      client.completed_orders.map((order) => (
                        <tr key={order.order_id} className="hover:bg-gray-50">
                          <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                              {order.order_id.slice(-6).toUpperCase()}
                            </span>
                          </td>
                          <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                            {formatDate(order.order_date)}
                          </td>
                          <td className="py-2 px-4 border-b border-gray-200 text-sm text-gray-800">
                            {formatCurrency(order.total_amount)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="py-3 px-4 text-center text-gray-500"
                        >
                          No hay órdenes completadas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-3 bg-gray-50">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  disabled={updateMutation.isLoading || deleteMutation.isLoading}
                  className="flex items-center justify-center gap-2 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-150 ease-in-out w-full sm:w-auto mr-auto"
                >
                  <FiTrash2 size={16} />
                  Eliminar
                </button>

                <button
                  onClick={handleSave}
                  disabled={updateMutation.isLoading || deleteMutation.isLoading}
                  className="px-6 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition duration-150 ease-in-out w-full sm:w-auto"
                >
                  {updateMutation.isLoading
                    ? "Guardando..."
                    : "Guardar Cambios"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  disabled={updateMutation.isLoading || deleteMutation.isLoading}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition duration-150 ease-in-out w-full sm:w-auto"
                >
                  Cancelar
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
          </div>
        </div>
      </div>

      {isDeleteConfirmOpen && (
        <ConfirmModal
          isOpen={isDeleteConfirmOpen}
          onClose={() => setIsDeleteConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Confirmar Eliminación"
          message={`¿Estás seguro de que deseas eliminar a ${client.name} ${client.last_name}? Esta acción no se puede deshacer.`}
          confirmText="Eliminar"
          cancelText="Cancelar"
          confirmColor="bg-red-600 hover:bg-red-700"
          isConfirmLoading={deleteMutation.isLoading}
        />
      )}
    </>
  );
};

export default ClientModal;