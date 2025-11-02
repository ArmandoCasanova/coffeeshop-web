function ClientRow({ client, onShowDetails }) {
  return (
    <tr className="border-b border-gray-200 text-center align-middle hover:bg-gray-50 ">
      <td className="px-5 py-4 flex items-center justify-start">
        <div className="flex flex-row items-center ">
          <div className="w-12 h-12 shrink-0 rounded-full overflow-hidden bg-brown-200 flex items-center justify-center text-white text-xl">
            {client.name.charAt(0)}
            {client.last_name.charAt(0)}
          </div>
          <div className="p-1 text-left ml-2 max-w-[70%] ">
            <p className="text-lg text-brown-600 font-bold ">
              {client.name + " " + client.last_name}
            </p>
            <button
              className="relative inline-block text-sm text-brown-300 group focus:outline-none"
              onClick={onShowDetails}
            >
              <span>Ver Detalles</span>
              <span className="absolute left-0 -bottom-1 h-0.5 bg-brown-300 w-0 group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 ">{client.email}</td>
      <td className="px-4 py-4 ">{client.registration_date}</td>
      <td className="px-4 py-4 ">{client.last_purchase}</td>
      <td className="px-4 py-4 ">{client.purchase_count}</td>
      <td className="px-4 py-4 ">{client.points}</td>
      <td className="px-4 py-4 ">
        {client.status === "Activo" ? (
          <span className="bg-green-500 font-semibold text-white px-2 py-1 rounded-full">
            Activo
          </span>
        ) : (
          <span className="bg-red-500 font-semibold text-white px-2 py-1 rounded-full">
            Inactivo
          </span>
        )}
      </td>
      <td className="px-1 py-4 ">
        {/* <button
              className="text-white bg-yellow-300 p-2  rounded-lg hover:bg-yellow-500 font-semibold mr-1"
              onClick={onEdit}
            >
              <FiPenTool size={15} />
            </button>
            <button
              className="text-white bg-red-500 p-2  rounded-lg hover:bg-red-700 font-semibold"
              onClick={onDelete}
            >
              <FiTrash2 size={15} />
            </button> */}
      </td>
    </tr>
  );
}

export default ClientRow;
