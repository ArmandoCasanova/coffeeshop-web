import { FiCheckSquare, FiTrash2 } from "react-icons/fi";

export default function OrderRow({
  product,
  onDelete,
  onMarkAsReady,
  sandClockIcon,
  ordersCoffeeIcon,
}) {
  const inPreparation =
    product.status === "pending" || product.status === "paid";

  const statusStyles = {
    pending: {
      text: "Pendiente",
      bg: "bg-yellow-100",
      textColor: "text-yellow-800",
    },
    paid: {
      text: "Pagado (En Cola)",
      bg: "bg-blue-100",
      textColor: "text-blue-800",
    },
    delivered: {
      text: "Entregado",
      bg: "bg-green-100",
      textColor: "text-green-800",
    },
    cancelled: {
      text: "Cancelado",
      bg: "bg-red-100",
      textColor: "text-red-800",
    },
  };

  const statusInfo = statusStyles[product.status] || {
    text: product.status,
    bg: "bg-gray-100",
    textColor: "text-gray-800",
  };

  return (
    <div className="block md:grid md:grid-cols-[minmax(0,_3fr)_1fr_1fr_100px_100px] gap-2 items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center gap-4">
        <img
          src={inPreparation ? sandClockIcon : ordersCoffeeIcon}
          alt={inPreparation ? "En preparación" : "Listo"}
          title={inPreparation ? "En preparación" : "Listo"}
          className={`flex-shrink-0 ${
            inPreparation ? "w-8 h-8" : "w-6 h-6 object-contain rounded-md"
          }`}
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
          <span
            className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${statusInfo.bg} ${statusInfo.textColor}`}
          >
            {statusInfo.text}
          </span>
        </div>

        <div className="flex justify-between items-center md:justify-center">
          <span className="font-bold text-gray-500 md:hidden">Acciones:</span>
          <div className="flex items-center gap-2">
            {inPreparation && (
              <button
                onClick={onMarkAsReady}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-200 hover:text-green-600 transition-colors"
                aria-label="Marcar como listo"
                title="Marcar como listo"
              >
                <FiCheckSquare size={18} />
              </button>
            )}
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
