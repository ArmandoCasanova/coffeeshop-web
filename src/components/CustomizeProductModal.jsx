import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function CustomizeProductModal({
  isOpen,
  onClose,
  item,
  onSave,
}) {
  const [localItem, setLocalItem] = useState(item || { extras: [] });

  const extrasList = [
    { name: "Miel", price: 10 },
    { name: "Chispas", price: 5 },
    { name: "Crema extra", price: 8 },
    { name: "Shot de espresso", price: 12 },
  ];

  useEffect(() => {
    setLocalItem(item || { extras: [] });
  }, [item]);

  const toggleExtra = (extra) => {
    const exists = localItem.extras?.some((e) => e.name === extra.name);
    const updatedExtras = exists
      ? localItem.extras.filter((e) => e.name !== extra.name)
      : [...(localItem.extras || []), extra];

    const extraTotal = updatedExtras.reduce((acc, e) => acc + e.price, 0);
    const newItem = {
      ...localItem,
      extras: updatedExtras,
      price: (item.price || 0) + extraTotal,
    };
    setLocalItem(newItem);
  };

  const handleSave = () => {
    const extrasText =
      localItem.extras?.length > 0
        ? ` (${localItem.extras.map((e) => e.name).join(", ")})`
        : "";
    onSave({
      ...localItem,
      name: localItem.name + extrasText,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center backdrop-blur-md bg-black/30 z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#fdfaf6]/95 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative border border-[#c9b49b]/40"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 text-[#5a4634] hover:text-[#2e2217] transition"
          onClick={onClose}
        >
          <FiX size={26} />
        </button>

        <h2 className="text-2xl font-bold text-[#3c2a1e] mb-5 text-center">
          Personalizar: {item?.name}
        </h2>

        <div className="space-y-3">
          {extrasList.map((extra) => (
            <label
              key={extra.name}
              className="flex justify-between items-center p-3 border border-[#d6c7b4] rounded-xl cursor-pointer hover:bg-[#f1e7dc] transition"
            >
              <span className="text-[#3c2a1e] font-medium">
                {extra.name}{" "}
                <span className="text-[#7a6756]">+${extra.price}</span>
              </span>
              <input
                type="checkbox"
                checked={!!localItem.extras?.some((e) => e.name === extra.name)}
                onChange={() => toggleExtra(extra)}
                className="w-5 h-5 accent-[#8b5e3c]"
              />
            </label>
          ))}
        </div>

        <button
          onClick={handleSave}
          className="w-full mt-6 py-3 bg-[#5a3e2b] text-white font-semibold rounded-xl hover:bg-[#3c291d] transition"
        >
          Guardar Personalización
        </button>
      </div>
    </div>
  );
}
