import { FiTrash2 } from "react-icons/fi";

const StatusBadge = ({ is_verified }) => {
  const text = is_verified ? "Verificado" : "No Verificado";
  const bgColor = is_verified ? "bg-green-100" : "bg-red-100";
  const textColor = is_verified ? "text-green-800" : "text-red-800";

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}
    >
      {text}
    </span>
  );
};

export default function ClientRow({ client, onShowDetails, onDelete }) {
  const handleDeleteClick = (e) => {
    e.stopPropagation(); 
    onDelete(client);
  };

  return (
    <tr
      className="border-b border-gray-200 text-center align-middle hover:bg-gray-50 cursor-pointer"
      onClick={onShowDetails}
    >
      <td className="px-5 py-4 flex items-center justify-start">
        <div className="flex flex-row items-center ">
          <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden bg-brown-200 flex items-center justify-center text-white text-xl font-semibold">
            {client.name.charAt(0)}
            {client.last_name.charAt(0)}
          </div>
          <div className="p-1 text-left ml-2 max-w-[90%] ">
            <p className="text-lg text-brown-600 font-bold ">
              {client.name + " " + client.last_name}
            </p>
            <span className="relative inline-block text-sm text-brown-300 group focus:outline-none">
              <span>Ver Detalles</span>
              <span className="absolute left-0 -bottom-1 h-0.5 bg-brown-300 w-0 group-hover:w-full transition-all duration-300"></span>
            </span>
          </div>
        </div>
      </td>

      <td className="px-4 py-4 text-sm text-gray-600">{client.email}</td>

      <td className="px-4 py-4 text-sm text-gray-600">
        {client.registration_date}
      </td>

      <td className="px-4 py-4 text-sm text-gray-600">
        {client.last_purchase}
      </td>

      <td className="px-4 py-4 font-semibold text-gray-800">
        {client.purchase_count}
      </td>

      <td className="px-4 py-4 font-semibold text-brown-600">
        {client.points}
      </td>

      <td className="px-4 py-4 ">
        <StatusBadge is_verified={client.is_verified} />
      </td>

      <td className="px-1 py-4 ">
        <button
          className="text-red-500 p-2 rounded-lg hover:bg-red-100 font-semibold"
          onClick={handleDeleteClick} 
          aria-label="Eliminar cliente"
        >
          <FiTrash2 size={18} />
        </button>
      </td>
    </tr>
  );
}

