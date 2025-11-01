import { useState, useEffect } from "react";
import { FiX, FiChevronDown } from "react-icons/fi";
import CustomizeProductModal from "./CustomizeProductModal";

export default function NewOrderModal({ isOpen, onClose, onSave, orderData }) {
  const [customer, setCustomer] = useState("");
  const [status, setStatus] = useState("en proceso");
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [customizingItemIndex, setCustomizingItemIndex] = useState(null);

  const products = [
    { name: "Café Americano", price: 25 },
    { name: "Cappuccino", price: 35 },
    { name: "Latte", price: 40 },
    { name: "Moka", price: 45 },
    { name: "Frappé", price: 50 },
    { name: "Té Verde", price: 30 },
  ];

  useEffect(() => {
    if (orderData) {
      setCustomer(orderData.name || "");
      setStatus(orderData.status || "en proceso");
      setItems(orderData.items || []);
      setTotal(orderData.price || 0);
    } else {
      setCustomer("");
      setStatus("en proceso");
      setItems([]);
      setTotal(0);
    }
  }, [orderData, isOpen]);

  useEffect(() => {
    setTotal(items.reduce((acc, item) => acc + item.price * item.quantity, 0));
  }, [items]);

  const handleAddItem = () => {
    setItems([...items, { name: "", quantity: 1, price: 0, extras: [] }]);
  };

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;

    if (field === "name") {
      const selected = products.find((p) => p.name === value);
      if (selected) updated[index].price = selected.price;
    }

    setItems(updated);
  };

  const handleCustomizeItem = (index) => {
    setCustomizingItemIndex(index);
  };

  const handleSaveCustomization = (customizedItem) => {
    const updated = [...items];
    updated[customizingItemIndex] = customizedItem;
    setItems(updated);
    setCustomizingItemIndex(null);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    onSave({ customer, status, items, total });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-lg bg-black/20 z-50 p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="bg-[#fdfaf6]/95 rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative border border-[#c9b49b]/40"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-[#5a4634] hover:text-[#2e2217] transition"
          onClick={onClose}
        >
          <FiX size={26} />
        </button>

        <h2 className="text-3xl font-bold text-[#3c2a1e] mb-6 text-center">
          {orderData ? "Editar Orden" : "Nueva Orden"}
        </h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nombre del cliente"
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className="w-full px-4 py-3 border border-[#d6c7b4] rounded-xl focus:ring-2 focus:ring-[#a97c50] outline-none transition bg-white/80"
          />

          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-3 pr-10 border border-[#d6c7b4] rounded-xl focus:ring-2 focus:ring-[#a97c50] outline-none transition bg-white/80 appearance-none"
            >
              <option value="en proceso">En proceso</option>
              <option value="listo">Listo</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
              <FiChevronDown className="text-[#5a4634]" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-[#3c2a1e] text-lg">Productos</h3>
            {items.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center gap-3 bg-white/80 border border-[#e2d8cc] p-4 rounded-xl transition hover:shadow-md"
              >
                <div className="relative flex-1">
                  <select
                    value={item.name}
                    onChange={(e) =>
                      handleItemChange(index, "name", e.target.value)
                    }
                    className="w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-[#a97c50] appearance-none"
                  >
                    <option value="">Seleccionar producto...</option>
                    {products.map((p, i) => (
                      <option key={i} value={p.name}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <FiChevronDown className="text-[#5a4634]" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Cant."
                    value={item.quantity}
                    min="1"
                    onChange={(e) =>
                      handleItemChange(
                        index,
                        "quantity",
                        Number(e.target.value)
                      )
                    }
                    className="w-20 px-3 py-2 border rounded-lg text-center"
                  />
                  <input
                    type="number"
                    placeholder="Precio"
                    value={item.price}
                    min="0"
                    onChange={(e) =>
                      handleItemChange(index, "price", Number(e.target.value))
                    }
                    className="w-24 px-3 py-2 border rounded-lg text-center"
                  />
                </div>

                <div className="flex justify-between sm:justify-end gap-2">
                  <button
                    onClick={() => handleCustomizeItem(index)}
                    className="px-4 py-2 bg-[#8b5e3c] text-white rounded-lg hover:bg-[#6f4b2c] text-sm font-medium w-full sm:w-auto"
                  >
                    Customizar
                  </button>
                  <button
                    onClick={() => handleRemoveItem(index)}
                    className="text-red-500 hover:text-red-700 font-bold text-lg"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}

            <button
              onClick={handleAddItem}
              className="w-full py-3 bg-[#a97c50] text-white font-semibold rounded-xl hover:bg-[#8c633e] transition"
            >
              + Agregar Producto
            </button>
          </div>

          <div className="text-right font-semibold text-lg text-[#3c2a1e]">
            Total: ${total}
          </div>

          <button
            onClick={handleSave}
            className="w-full py-3 bg-[#5a3e2b] text-white font-semibold rounded-xl hover:bg-[#3c291d] transition-all"
          >
            Guardar Orden
          </button>
        </div>
      </div>

      {customizingItemIndex !== null && (
        <CustomizeProductModal
          isOpen={true}
          onClose={() => setCustomizingItemIndex(null)}
          item={items[customizingItemIndex]}
          onSave={handleSaveCustomization}
        />
      )}
    </div>
  );
}
