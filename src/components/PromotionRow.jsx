import { FiPenTool, FiTrash, FiTrash2 } from "react-icons/fi";
import ima from "../assets/images/caramel-frappuccino.png";

export default function PromotionRow({ promotion, onEdit, onDelete }) {
  return (
    <tr className="border-b border-gray-200 text-center align-middle hover:bg-gray-50 ">
      <td className="px-2 py-2 ">{promotion.id}</td>
      <td className="px-5 py-4 flex items-center justify-start ">
        <div className="flex flex-row items-center ">
          <div className="w-16 shrink-0 ">
            <img src={ima} alt="Promo Verano" className="object-contain" />
          </div>
          <div className="p-1 text-left ml-2 max-w-[70%] ">
            <p className="text-lg text-brown-600 font-bold ">
              {promotion.name}
            </p>
            <p className="text-sm text-brown-300 ">{promotion.description}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 ">${promotion.price}</td>
      <td className="px-4 py-4 ">{promotion.discount_type}</td>
      <td className="px-4 py-4 ">
        {promotion.discount_type === "Porcentaje" ? (
          <>
            {promotion.discount_value}%
          </>
        ) : (
          <>
            ${promotion.discount_value}
          </>
        )}
      </td>
      <td className="px-4 py-4 ">
        ${promotion.price - (promotion.discount_type === "Porcentaje" ? (promotion.price * promotion.discount_value) / 100 : promotion.discount_value)}
      </td>
      <td className="px-4 py-4 ">{promotion.start_date + " - " + promotion.end_date}</td>
      <td className="px-4 py-4 ">
        {promotion.status === "Activa" ? (
          <div className=" py-1 px-2 bg-brown-600 text-white rounded-full w-24 mx-auto">
            <span>Activo</span>
          </div>
        ) : (
          <div className=" py-1 px-2 bg-gray-300 text-white rounded-full w-24 mx-auto">
            <span>Inactivo</span>
          </div>
        )}
      </td>
      <td className="px-1 py-4 ">
        <button
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
        </button>
      </td>
    </tr>
  );
}
