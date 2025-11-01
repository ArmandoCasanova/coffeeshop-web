import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function OrderRow({
  product,
  onEdit,
  onDelete,
  sandClockIcon,
  ordersCoffeeIcon,
}) {
  return (
    <div className="block md:grid md:grid-cols-[minmax(0,_3fr)_1fr_1fr_100px_100px] gap-2 items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-4">
        <img
          src={product.imageUrl}
          alt="ícono de orden"
          className="w-6 h-6 object-contain rounded-md flex-shrink-0"
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
          <span className="font-bold text-gray-500 md:hidden">Total:</span>
          <div className="font-medium text-gray-700">${product.price}</div>
        </div>

        <div className="flex justify-between items-center md:justify-center">
          <span className="font-bold text-gray-500 md:hidden">Pedido:</span>
          <div className="font-medium text-gray-700">{product.pedido}</div>
        </div>

        <div className="flex justify-between items-center md:justify-center">
          <span className="font-bold text-gray-500 md:hidden">Estado:</span>
          <div className="flex justify-center items-center w-6 h-6">
            {product.status === "en proceso" ? (
              <img
                src={sandClockIcon}
                alt="En proceso"
                title="En proceso"
                className="w-8 h-8"
              />
            ) : (
              <img
                src={ordersCoffeeIcon}
                alt="Listo"
                title="Listo"
                className="w-5 h-5"
              />
            )}
          </div>
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
