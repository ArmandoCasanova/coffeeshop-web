import { FiEdit, FiTrash2 } from "react-icons/fi";

// El componente recibe "product", "onEdit", y "onDelete" como props
export default function ProductRow({ product, onEdit, onDelete }) {
  return (
    <div className="p-2 m-4 -mt-2">
      <div className="grid grid-cols-[minmax(0,_3fr)_minmax(0,_1fr)_minmax(0,_1fr)_120px] gap-2 items-center bg-white p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        {/* Columna: Producto */}
        <div className="flex items-center gap-4 px-4">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-12 h-12 object-cover rounded-md"
          />
          <div>
            <div className="font-bold text-gray-800">{product.name}</div>
            <div className="text-sm text-gray-500">{product.description}</div>
          </div>
        </div>

        {/* Columna: Precio */}
        <div className="text-center font-medium text-gray-700">
          ${product.price}
        </div>

        {/* Columna: Disponible */}
        <div className="text-center">
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

        {/* Columna: Acción (Botones) */}
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={onEdit} // Llama a la función del padre
            className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-blue-600 transition-colors"
            aria-label="Editar"
          >
            <FiEdit size={18} />
          </button>
          <button
            onClick={onDelete} // Llama a la función del padre
            className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-red-600 transition-colors"
            aria-label="Eliminar"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
