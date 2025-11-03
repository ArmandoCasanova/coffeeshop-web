import { FiPenTool, FiTrash2 } from "react-icons/fi";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
};

export default function PromotionRow({ promotion, onEdit, onDelete }) {
  const statusStyles = {
    Activa: "bg-green-600 text-white",
    Programada: "bg-blue-500 text-white",
    Expirada: "bg-gray-400 text-gray-800",
  };

  return (
    <tr className="border-b border-gray-200 text-center align-middle hover:bg-gray-50 ">
      <td className="px-5 py-4 text-left">
        <div className="flex flex-col">
          <p className="text-lg text-brown-600 font-bold ">
            {promotion.name}
          </p>
          <p className="text-sm text-brown-300 truncate max-w-xs">
            {promotion.description}
          </p>
        </div>
      </td>
      <td className="px-4 py-4 ">{formatCurrency(promotion.base_price)}</td>
      <td className="px-4 py-4 ">{promotion.discount_type_label}</td>
      <td className="px-4 py-4 ">
        {promotion.discount_type === "percentage" ? (
          <>{promotion.discount_value}%</>
        ) : (
          <>{formatCurrency(promotion.discount_value)}</>
        )}
      </td>
      <td className="px-4 py-4 font-semibold text-brown-600">
        {formatCurrency(promotion.precio_final)}
      </td>
      <td className="px-4 py-4 text-sm">{promotion.duracion}</td>
      <td className="px-4 py-4 ">
        <div
          className={`py-1 px-2 rounded-full w-24 mx-auto text-sm font-medium ${
            statusStyles[promotion.status] || "bg-gray-300 text-white"
          }`}
        >
          <span>{promotion.status}</span>
        </div>
      </td>

      <td className="px-1 py-4 ">
        <button
          className="text-white bg-yellow-500 p-2 rounded-lg hover:bg-yellow-600 font-semibold mr-1 transition-colors"
          onClick={onEdit}
        >
          <FiPenTool size={15} />
        </button>
        <button
          className="text-white bg-red-500 p-2 rounded-lg hover:bg-red-700 font-semibold transition-colors"
          onClick={onDelete}
        >
          <FiTrash2 size={15} />
        </button>
      </td>
    </tr>
  );
}
