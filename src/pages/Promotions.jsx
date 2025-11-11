import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "../hooks/useSnackbar";
import { PROMOTION_SERVICE } from "../services/promotion";
import PromotionRow from "../components/PromotionRow";
import FilterDropdown from "../components/FilterDropdown";
import PromotionModal from "../components/PromotionModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

const filterOptions = [
  { label: "Todas", value: null },
  { label: "Activas", value: "Activa" },
  { label: "Programadas", value: "Programada" },
  { label: "Expiradas", value: "Expirada" },
];

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return new Date(dateString).toLocaleDateString("es-MX", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch (e) {
    return e;
  }
};

export default function Promotions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);

  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const { data, isLoading } = useQuery({
    queryKey: ["promotions"],
    queryFn: () => PROMOTION_SERVICE.getAllPromotions(),
  });

  const createMutation = useMutation({
    mutationFn: PROMOTION_SERVICE.createPromotion,
    onSuccess: () => {
      showSnackbar({ type: "success", message: "Promoción creada" });
      queryClient.invalidateQueries(["promotions"]);
      setIsModalOpen(false);
    },
    onError: (err) => {
      showSnackbar({
        type: "error",
        message: err.message || "Error al crear la promoción",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: PROMOTION_SERVICE.updatePromotion,
    onSuccess: () => {
      showSnackbar({ type: "success", message: "Promoción actualizada" });
      queryClient.invalidateQueries(["promotions"]);
      setIsEditModalOpen(false);
      setSelectedPromotion(null);
    },
    onError: (err) => {
      showSnackbar({
        type: "error",
        message: err.message || "Error al actualizar la promoción",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: PROMOTION_SERVICE.deletePromotion,
    onSuccess: () => {
      showSnackbar({ type: "success", message: "Promoción eliminada" });
      queryClient.invalidateQueries(["promotions"]);
      setIsDeleteModalOpen(false);
      setSelectedPromotion(null);
    },
    onError: (err) => {
      showSnackbar({
        type: "error",
        message: err.message || "Error al eliminar la promoción",
      });
    },
  });

  const handleOpenEditModal = (promotion) => {
    setSelectedPromotion(promotion);
    setIsEditModalOpen(true);
  };

  const handleOpenDeleteModal = (promotion) => {
    setSelectedPromotion(promotion);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedPromotion) {
      deleteMutation.mutate(selectedPromotion.id);
    }
  };

  const handleFilterSelect = (option) => {
    setStatusFilter(option.value);
  };

  const handleSave = (promotionData) => {

    if (selectedPromotion) {
      updateMutation.mutate({
        promotionId: selectedPromotion.id, 
        ...promotionData,
      });
    } else {
      createMutation.mutate(promotionData);
    }
  };

  const formattedPromotions = (data?.promotions || [])
    .map((promo) => {
      const now = new Date();
      const startDate = new Date(promo.startDate);
      const endDate = new Date(promo.endDate);
      let status = "Activa";
      if (now < startDate) status = "Programada";
      if (now > endDate) status = "Expirada";

      const discountValueNum = parseFloat(promo.discountValue) || 0;

      return {
        ...promo, 
        id: promo.promotionId, 
        code: promo.code, 
        discount_type_label:
          promo.discountType === "percentage" ? "Porcentaje" : "Monto Fijo",
        discount_value: discountValueNum, 
        
        duracion: `${formatDate(promo.startDate)} - ${formatDate(
          promo.endDate
        )}`,
        status: status,
      };
    })

    .filter((promo) => {
      const matchesStatus = !statusFilter || promo.status === statusFilter;
      const matchesSearch =
        searchTerm === "" ||
        promo.code.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-4xl font-bold text-brown-600">Promociones </h1>
      <div className="flex flex-wrap items-center justify-between gap-4 mt-8 mb-6">
        <div className="relative grow sm:grow-0 sm:w-2/5 md:w-2/5 lg:w-1-3">
          <input
            type="text"
            placeholder="Buscar promoción por código..."
            className="w-full px-4 py-3 border border-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <FilterDropdown options={filterOptions} onSelect={handleFilterSelect} />
          <button
            onClick={() => {
              setSelectedPromotion(null); 
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-3 bg-brown-300 text-white font-semibold rounded-lg hover:bg-brown-200 transition-colors"
          >
            <FiPlus />
            <span>Añadir Promoción</span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto mt-6 rounded-lg shadow-lg">
        <table className="w-full min-w-3xl">
          <thead>
            <tr className="border-b text-center align-middle bg-gray-50">
              <th className="border-b-2 border-brown-300 px-4 py-3">
                Código de la Promoción
              </th>
              <th className="border-b-2 border-brown-300 px-2 py-3 w-[120px]">
                Tipo de Descuento
              </th>
              <th className="border-b-2 border-brown-300 px-4 py-3">
                Valor del Descuento
              </th>
              <th className="border-b-2 border-brown-300 px-4 py-3">
                Duración
              </th>
              <th className="border-b-2 border-brown-300 px-4 py-3">Estatus</th>
              <th className="border-b-2 border-brown-300 px-4 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" className="text-center p-4"> 
                  Cargando promociones...
                </td>
              </tr>
            ) : (
              formattedPromotions.map((promo) => (
                <PromotionRow
                  key={promo.id} 
                  promotion={promo}
                  onEdit={() => handleOpenEditModal(promo)}
                  onDelete={() => handleOpenDeleteModal(promo)}
                />
              ))
            )}
            {!isLoading && formattedPromotions.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center p-4 text-gray-500"> 
                  No se encontraron promociones.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <PromotionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        isSaving={createMutation.isLoading}
      />

      <PromotionModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPromotion(null); 
        }}
        promotionData={selectedPromotion} 
        onSave={handleSave}
        isSaving={updateMutation.isLoading}
      />

      {selectedPromotion && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedPromotion(null); 
          }}
          onConfirm={handleConfirmDelete}
          promotionName={selectedPromotion.code} 
          isDeleting={deleteMutation.isLoading}
        />
      )}
    </div>
  );
}