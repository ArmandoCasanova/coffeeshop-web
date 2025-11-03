import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function StockRow({ product, onEdit, onDelete }) {

  const statusStyles =
    product.status === "bajo"
      ? "bg-red-100 text-red-700"
      : "bg-green-100 text-green-700";

  return (
    <div className="block md:grid md:grid-cols-[minmax(0,3fr)_1fr_1fr_1fr_100px] gap-2 items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-4">
        <div>
          <div className="font-semibold text-gray-800">{product.name}</div>
        </div>
      </div>

      <div className="md:contents flex flex-col sm:flex-row sm:justify-between sm:flex-wrap gap-4 mt-4 pt-4 border-t md:border-0 md:p-0 md:mt-0">
        
        <div className="flex justify-between items-center md:justify-center md:text-center">
          <span className="font-bold text-gray-500 md:hidden">En stock:</span>
          <div className="font-medium text-gray-700">{product.stock}</div>
        </div>

        <div className="flex justify-between items-center md:justify-center md:text-center">
          <span className="font-bold text-gray-500 md:hidden">
            Unidad:
          </span>
          <div className="font-medium text-gray-700">{product.unidad_medida}</div>
        </div>

        <div className="flex justify-between items-center md:justify-center md:text-center">
          <span className="font-bold text-gray-500 md:hidden">Estado:</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${statusStyles} capitalize`}
          >
            {product.status}
          </span>
        </div>

        <div className="flex justify-between items-center md:justify-center ">
          <span className="font-bold text-gray-500 md:hidden">Acciones:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-blue-600 transition-colors"
              aria-label="Editar"
            >
              <FiEdit size={18} />
            </button>
            <button
              onClick={onDelete}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-red-600 transition-colors"
              aria-label="Eliminar"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}