// src/components/ProductRow.jsx
import { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";

export default function ProductRow({ product }) {
  const [isAvailable, setIsAvailable] = useState(product.available);

  return (
    <div className="grid grid-cols-[3fr_1fr_1fr_auto] items-center py-4 px-6 border-t border-gray-200 gap-4">
      <div className="flex items-center gap-4">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-12 h-12 rounded-full object-cover" // <-- Cambio aquí: rounded-full
        />
        <div>
          <p className="font-bold text-gray-800">{product.name}</p>
          <p className="text-sm text-gray-500">{product.description}</p>
        </div>
      </div>

      <div className="font-semibold text-gray-700">${product.price}</div>

      <div>
        <button
          onClick={() => setIsAvailable(!isAvailable)}
          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 ${
            isAvailable ? "bg-brown-300" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${
              isAvailable ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <div>
        <button className="p-2 rounded-full hover:bg-gray-200 transition-colors">
          <FiMoreVertical className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}
