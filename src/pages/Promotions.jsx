import CheckBox from "../components/CheckBox";
import PromotionRow from "../components/promotionRow";

export default function Promotions() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-4xl font-bold text-brown-600">Promociones</h1>
      <p className="text-gray-500 mt-1">Nuevas Promociones a Crear</p>
      <div>{/* Busqueda y Filtros */}</div>
      <div className="overflow-x-auto mt-6 rounded-lg shadow-lg">
        <table className="w-full min-w-3xl">
          <thead>
            <tr className="border-b text-center align-middle bg-gray-50">
              <th className="border-b-2 border-brown-300 py-3 w-1 ">
                <CheckBox />
              </th>
              <th className="border-b-2 border-brown-300 px-4 py-3">
                Nombre de la Promoción
              </th>
              <th className="border-b-2 border-brown-300 px-4 py-3 ">Precio</th>
              <th className="border-b-2 border-brown-300 px-4 py-3">
                Descuento
              </th>
              <th className="border-b-2 border-brown-300 px-4 py-3">
                Precio Final
              </th>
              <th className="border-b-2 border-brown-300 px-4 py-3">
                Duración
              </th>
              <th className="border-b-2 border-brown-300 px-4 py-3">Estatus</th>
            </tr>
          </thead>

          <tbody>
            <PromotionRow />
            <PromotionRow />
            <PromotionRow />
          </tbody>
        </table>
      </div>
    </div>
  );
}
