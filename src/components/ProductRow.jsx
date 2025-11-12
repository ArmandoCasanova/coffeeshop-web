import { FiEdit, FiTrash2 } from "react-icons/fi";

export default function ProductRow({ product, onEdit, onDelete }) {
  const basePrice = parseFloat(product.base_price || 0);
  
  const finalImageUrl = product.image_url;
      
  // 💡 Tu JSON de ejemplo usa 'size' (singular) y dentro 'options'
  const rawSizes = product.customization_details_json?.size; 
  const sizes = rawSizes?.options || []; 

  // --- Lógica de precios ---
  const getPriceValue = (name) => {
    const size = sizes.find((s) => s.name.toLowerCase() === name.toLowerCase());
    if (size) {
      // 💡 Tu JSON de ejemplo usa 'extra_cost'
      return basePrice + parseFloat(size.extra_cost || 0);
    }
    return null;
  };

  const formatPrice = (priceValue) => {
    if (priceValue === null) {
      return "$0.00";
    }
    return `$${priceValue.toFixed(2)}`;
  };

  const chicoPrice = getPriceValue("chico");
  const medianoPrice = getPriceValue("mediano");
  const grandePrice = getPriceValue("grande");

  const displayChico =
    chicoPrice !== null
      ? formatPrice(chicoPrice)
      : `$${basePrice.toFixed(2)}`; // Fallback al precio base

  // 💡 ARREGLO: Añadimos 'rounded-lg' y 'shadow-sm' de vuelta
  return (
    <div className="block md:grid md:grid-cols-[minmax(0,_3fr)_1fr_1fr_1fr_1fr_120px] gap-2 items-center bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex items-center gap-4">
          <img
            src={finalImageUrl}
            alt={product.name}
            className="w-12 h-12 object-cover rounded-md flex-shrink-0"
          />
          <div>
            <div className="font-bold text-gray-800">{product.name}</div>
            {/* 💡 Leemos el 'category_name' de tu JSON de ejemplo */}
            <div className="text-sm text-gray-500 hidden sm:block">
              {product.category_info_json?.category_name || "Producto"}
            </div>
          </div>
        </div>

        {/* --- Contenido Responsivo --- */}
        <div className="md:contents flex flex-col sm:flex-row sm:justify-between gap-4 mt-4 pt-4 border-t md:border-0 md:p-0 md:mt-0">
            <div className="flex justify-between items-center md:justify-center">
                <span className="font-bold text-gray-500 md:hidden">
                    Chico/Simple:
                </span>
                <div className="font-medium text-gray-700">{displayChico}</div>
            </div>
            <div className="flex justify-between items-center md:justify-center">
                <span className="font-bold text-gray-500 md:hidden">
                    Mediano/Doble:
                </span>
                <div className="font-medium text-gray-700">
                    {formatPrice(medianoPrice)}
                </div>
            </div>
            <div className="flex justify-between items-center md:justify-center">
                <span className="font-bold text-gray-500 md:hidden">Grande:</span>
                <div className="font-medium text-gray-700">
                    {formatPrice(grandePrice)}
                </div>
            </div>
            <div className="flex justify-between items-center md:justify-center">
                <span className="font-bold text-gray-500 md:hidden">Disponible:</span>
                <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                        product.is_available
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    }`}
                >
                    {product.is_available ? "Disponible" : "Agotado"}
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