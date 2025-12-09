import { FiX } from "react-icons/fi";

/**
 * Componente reutilizable para los selectores con "pastillas" (pills)
 * basado en tu nuevo diseño.
 *
 * @param {object} props
 * @param {string} props.label - El título de la sección
 * @param {string} props.placeholder - Texto para el <select>
 * @param {Array<object>} props.options - Lista completa de opciones (ej: [{ category_id: "1", name: "Bebidas" }])
 * @param {Array<string>} props.selectedIds - Lista de IDs seleccionados (ej: ["1"])
 * @param {Function} props.onChange - Función llamada con la nueva lista de IDs
 * @param {string} props.idKey - El nombre de la propiedad ID (ej: "category_id")
 * @param {string} props.nameKey - El nombre de la propiedad a mostrar (ej: "name")
 * @returns {JSX.Element}
 */
export default function MultiSelectPillInput({
  label,
  placeholder = "Selecciona una opción",
  options = [],
  selectedIds = [],
  onChange,
  idKey,
  nameKey,
}) {
  const selectedOptions = selectedIds
    .map((id) => options.find((opt) => opt[idKey] === id))
    .filter(Boolean); // Filtra los que no se encontraron

  const availableOptions = options.filter(
    (opt) => !selectedIds.includes(opt[idKey])
  );

  const handleSelect = (e) => {
    const newId = e.target.value;
    if (newId && !selectedIds.includes(newId)) {
      onChange([...selectedIds, newId]);
    }
  };

  const handleRemove = (idToRemove) => {
    onChange(selectedIds.filter((id) => id !== idToRemove));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {/* Contenedor principal con estilo de input */}
      <div className="flex flex-wrap items-center gap-2 p-2 min-h-[42px] bg-white border border-gray-300 rounded-lg shadow-sm">
        {/* Pastillas de opciones seleccionadas */}
        {selectedOptions.map((option) => (
          <span
            key={option[idKey]}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-brown-100 text-brown-800 rounded-full text-sm font-medium"
          >
            {option[nameKey]}
            <button
              type="button"
              onClick={() => handleRemove(option[idKey])}
              className="text-brown-600 hover:text-brown-800"
            >
              <FiX className="w-4 h-4" />
            </button>
          </span>
        ))}
        
        {/* El <select> que se hace pasar por input */}
        <select
          value="" // Siempre resetea el <select>
          onChange={handleSelect}
          className="flex-1 min-w-[150px] border-none focus:ring-0 text-gray-600 cursor-pointer"
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {availableOptions.map((option) => (
            <option key={option[idKey]} value={option[idKey]}>
              {option[nameKey]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}