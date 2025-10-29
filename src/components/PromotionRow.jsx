import ima from "../assets/images/caramel-frappuccino.png";
import CheckBox from "./CheckBox";

export default function PromotionRow({ promotion }) {
  return (
    <tr className="border-b border-gray-200 text-center align-middle hover:bg-gray-50 ">
      <td className="px-4 py-2">
        <CheckBox />
      </td>
      <td className="px-4 py-4 flex items-center justify-center">
        <div className="flex flex-row items-center">
          <div className="w-16 shrink-0">
            <img src={ima} alt="Promo Verano" className="object-contain" />
          </div>
          <div className="p-1 text-left ml-2">
            <p className="text-lg text-brown-600 font-bold">
              Happy Hour Caramel
            </p>
            <p className="text-sm text-brown-300 max-w-full">
              Caramel Frappuccino
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 ">$5.00</td>
      <td className="px-4 py-4 ">10%</td>
      <td className="px-4 py-4 ">$4.50</td>
      <td className="px-4 py-4 ">12/01/2023 - 12/31/2023</td>
      <td className="px-4 py-4 ">
        <div className=" py-1 px-2 bg-brown-600 text-white rounded-full w-24 mx-auto">
          <span>Activo</span>
        </div>
        {/* <div className=" py-1 px-2 bg-gray-300 text-white rounded-full w-24 mx-auto">
          <span>Inactivo</span>
        </div> */}
      </td>
    </tr>
  );
}
