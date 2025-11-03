import PromotionRow from "../components/PromotionRow";
import { FiPlus } from "react-icons/fi";
import FilterDropdown from "../components/FilterDropdown";
import { useState } from "react";
import PromotionModal from "../components/PromotionModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

const mockPromotions = [
  {
    id: 1,
    name: "Promo Verano",
    description: "Disfruta del verano con nuestra promoción especial de Frappuccino de  Caramelo.",
    price: 100,
    discount_type: "Porcentaje",
    discount_value: "90",
    start_date: "2025-07-01",
    end_date: "2025-07-31",
    status: "Activa",
  },
  {
    id: 2,
    name: "Promo Invierno",
    description: "Disfruta nuestro rico nuestro rico Chocolate.",
    price: 200,
    discount_type: "Monto Fijo",
    discount_value: "10",
    start_date: "2025-12-01",
    end_date: "2025-12-31",
    status: "Inactiva",
  },
  {
    id: 3,
    name: "Promo Otoño",
    description: "Disfruta nuestro rico Frappuccino de  Otoño.",
    price: 150,
    discount_type: "Porcentaje",
    discount_value: "15",
    start_date: "2025-09-01",
    end_date: "2025-09-30",
    status: "Activa",
  }
];

export default function Promotions() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);

  const handleOpenEditModal = (promotion) => {
    setSelectedPromotion(promotion); 
    setIsEditModalOpen(true);       
  };        
  const handleOpenDeleteModal = (promotion) => {
    setSelectedPromotion(promotion);
    setIsDeleteModalOpen(true); 
  };
  const handleConfirmDelete = () => {
    // AQUÍ VA TU LÓGICA PARA ELIMINAR
    console.log("Eliminando promoción con ID:", selectedPromotion.id);
    
    setIsDeleteModalOpen(false);
    // Aquí volver a cargar tus datos 
    // quitar el item del estado para que la UI se actualice
  };


  const filterOptions = [
    { label: "Más vendidos", value: "best-sellers" },
    { label: "Disponibles", value: "available" },
    { label: "No disponibles", value: "unavailable" },
  ];
  
  const handleFilterSelect = (option) => {
    console.log("Filtro seleccionado:", option);
    // Lógica para filtrar las promociones
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-4xl font-bold text-brown-600">Promociones</h1>
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
            onClick={() => setIsModalOpen(true)}
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
              <th className="border-b-2 border-brown-300 px-2 py-3 w-1 ">ID</th>
              <th className="border-b-2 border-brown-300 px-4 py-3">
                Nombre de la Promoción
              </th>
              <th className="border-b-2 border-brown-300 px-4 py-3 ">Precio</th>
              <th className="border-b-2 border-brown-300 px-2 py-3 w-[120px]">
                 Tipo de Descuento
              </th>
              <th className="border-b-2 border-brown-300 px-4 py-3">
                Valor del Descuento 
              </th>
              <th className="border-b-2 border-brown-300 px-4 py-3">
                Precio Final
              </th>
              <th className="border-b-2 border-brown-300 px-4 py-3">
                Duración
              </th>
              <th className="border-b-2 border-brown-300 px-4 py-3">Estatus</th>
              <th className="border-b-2 border-brown-300 px-4 py-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {mockPromotions.map((promo) => (
              <PromotionRow
                key={promo.id}
                promotion={promo}
                onEdit={() => handleOpenEditModal(promo)}
                onDelete={() => handleOpenDeleteModal(promo)}
              />
            ))}
          </tbody>
        </table>
      </div>
      <PromotionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <PromotionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          promotionData={selectedPromotion} 
        />
        {selectedPromotion && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          promotionName={selectedPromotion.name}
        />
      )}
    </div>
  );
}
