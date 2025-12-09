// src/components/CustomizationGroupEditor.jsx

import { FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import { Switch } from "@headlessui/react"; // Asumiendo que usas Headless UI o Tailwind-CSS para el Switch

const optionTypes = [
    { value: "radio", label: "Selección Única (Radio)" },
    { value: "checkbox", label: "Selección Múltiple (Checkbox)" },
    { value: "select", label: "Desplegable (Select)" },
];

export default function CustomizationGroupEditor({
    group,
    onUpdate,
    onRemove,
    isBaseGroup, // True si es el grupo "Tamaño"
    basePrice, // Se usa para calcular el precio ADICIONAL en otros grupos
}) {
    // Manejar cambios en el grupo (nombre, tipo, requerido)
    const handleGroupChange = (field, value) => {
        onUpdate({ ...group, [field]: value });
    };

    // Manejar cambios en una opción (nombre, precio total)
    const handleOptionChange = (id, field, value) => {
        const updatedOptions = group.options.map((opt) =>
            opt.id === id ? { ...opt, [field]: value } : opt
        );
        onUpdate({ ...group, options: updatedOptions });
    };

    // Añadir una nueva opción
    const handleAddOption = () => {
        onUpdate({
            ...group,
            options: [
                ...group.options,
                { id: Date.now(), name: "Nueva Opción", price: "" },
            ],
        });
    };

    // Eliminar una opción
    const handleRemoveOption = (id) => {
        if (group.options.length > (isBaseGroup ? 1 : 0)) {
            const updatedOptions = group.options.filter((opt) => opt.id !== id);
            onUpdate({ ...group, options: updatedOptions });
        }
    };
    
    // Calcular el precio a mostrar en el input (Total para TAMAÑO, Adicional para otros)
    const getDisplayPrice = (optionPrice) => {
        if (isBaseGroup || basePrice === null) return optionPrice;
        
        // Para extras: (Precio TOTAL - Base Price) + Precio Adicional del Extra
        // Asumiendo que el precio guardado es el precio ADICIONAL del extra.
        // Si el precio del extra es 5.00, se muestra 5.00.
        // Solo para TAMAÑO el precio es el TOTAL.
        return optionPrice;
    };


    return (
        <div className="border border-gray-200 p-3 rounded-lg bg-white shadow-sm">
            <div className="flex justify-between items-start mb-3">
                <div className="flex-1 space-y-1">
                    {/* Nombre del Grupo */}
                    <input
                        type="text"
                        placeholder={group.name}
                        value={group.name}
                        onChange={(e) => handleGroupChange("name", e.target.value)}
                        className={`w-full text-lg font-semibold border-0 p-0 focus:ring-0 ${isBaseGroup ? 'cursor-not-allowed text-brown-700' : 'text-gray-800'}`}
                        disabled={isBaseGroup} // No se puede cambiar el nombre de "Tamaño"
                    />
                    
                    {/* Tipo de Selector */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Tipo:</label>
                        <select
                            value={group.type}
                            onChange={(e) => handleGroupChange("type", e.target.value)}
                            className={`text-sm border-gray-300 rounded-md py-1 ${isBaseGroup ? 'cursor-not-allowed' : ''}`}
                            disabled={isBaseGroup} // El grupo "Tamaño" siempre es radio
                        >
                            {optionTypes.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Requerido (Switch) */}
                    <div className="flex items-center gap-2 pt-2">
                        <Switch
                            checked={group.is_required}
                            onChange={(value) => handleGroupChange("is_required", value)}
                            className={`${
                                group.is_required ? 'bg-brown-500' : 'bg-gray-300'
                            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                        >
                            <span className="sr-only">Habilitar notificaciones</span>
                            <span
                                className={`${
                                    group.is_required ? 'translate-x-6' : 'translate-x-1'
                                } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                            />
                        </Switch>
                        <span className="text-sm text-gray-700">
                            {group.is_required ? "Requerido" : "Opcional"}
                        </span>
                    </div>

                </div>

                {/* Botón de eliminar grupo (solo si no es el grupo base) */}
                {!isBaseGroup && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="p-1 text-red-500 rounded-full hover:bg-red-100"
                    >
                        <FiTrash2 className="w-5 h-5" />
                    </button>
                )}
            </div>

            <hr className="my-3" />

            {/* Opciones dentro del grupo */}
            <h4 className="text-md font-medium text-gray-800 mb-2">
                Opciones ({isBaseGroup ? "Precio Total" : "Precio Adicional"})
            </h4>
            <div className="space-y-3">
                {group.options.map((option, index) => (
                    <div key={option.id} className="flex gap-2 items-center">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder={`Nombre de la opción ${index + 1}`}
                                value={option.name}
                                onChange={(e) => handleOptionChange(option.id, "name", e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                        </div>
                        <div className="w-24">
                            <input
                                type="number"
                                placeholder={isBaseGroup ? "70.00" : "5.00"}
                                value={getDisplayPrice(option.price)}
                                step="0.01"
                                min="0"
                                onChange={(e) => handleOptionChange(option.id, "price", e.target.value)}
                                className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm text-center"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => handleRemoveOption(option.id)}
                            disabled={isBaseGroup && group.options.length <= 1} // No eliminar el único tamaño
                            className="p-2 text-gray-400 rounded-full hover:bg-red-100 hover:text-red-500 disabled:opacity-50"
                        >
                            <FiX className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            <button
                type="button"
                onClick={handleAddOption}
                className="mt-3 text-sm flex items-center gap-1 text-brown-600 hover:text-brown-800"
            >
                <FiPlus className="w-4 h-4" />
                Añadir Opción
            </button>
        </div>
    );
}