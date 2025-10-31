import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function ProductRow({ product, onEdit, onDelete }) {
  return (
    <div className="block md:grid md:grid-cols-[minmax(0,_3fr)_1fr_1fr_120px] gap-2 items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-4">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-12 h-12 object-cover rounded-md flex-shrink-0"
        />
        <div>
          <div className="font-bold text-gray-800">{product.name}</div>
          <div className="text-sm text-gray-500 hidden sm:block">
            {product.description}
          </div>
        </div>
      </div>

      <div className="md:contents flex flex-col sm:flex-row sm:justify-between gap-4 mt-4 pt-4 border-t md:border-0 md:p-0 md:mt-0">
        <div className="flex justify-between items-center md:justify-center">
          <span className="font-bold text-gray-500 md:hidden">Precio:</span>
          <div className="font-medium text-gray-700">${product.price}</div>
        </div>

        <div className="flex justify-between items-center md:justify-center">
          <span className="font-bold text-gray-500 md:hidden">Estado:</span>
          <span
            className={`px-3 py-1 text-sm font-semibold rounded-full ${
              product.available
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.available ? "Disponible" : "Agotado"}
          </span>
        </div>

        <div className="flex justify-between items-center md:justify-center">
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
