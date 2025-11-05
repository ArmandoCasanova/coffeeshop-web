import { useState, useRef, useEffect } from "react";
import { FiMoreVertical, FiEdit3, FiTrash2 } from "react-icons/fi";

/**
 * Menú de acciones para cada fila de categoría (Editar/Eliminar).
 * @param {number} categoryId - ID de la categoría.
 * @param {'down' | 'up'} [direction='down'] - Dirección en la que se abre el menú. 'down' para abajo, 'up' para arriba.
 * @param {function} onEdit - Función para abrir el modal de edición.
 * @param {function} onDelete - Función para abrir el modal de confirmación de eliminación.
 */
export default function CategoryActionsDropdown({ 
    categoryId, 
    direction = 'down', // 👈 ¡Esta es la prop clave que usaremos!
    onEdit, 
    onDelete 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Lógica de cierre al hacer clic afuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleEdit = () => {
        setIsOpen(false);
        // Aseguramos que la función reciba el ID, aunque la función externa puede no necesitarlo
        onEdit(categoryId); 
    };

    const handleDelete = () => {
        setIsOpen(false);
        // Aseguramos que la función reciba el ID
        onDelete(categoryId); 
    };

    // ✅ LÓGICA CLAVE: Clases para controlar la dirección (arriba o abajo)
    const menuClasses = {
        // Por defecto: hacia abajo (se posiciona en 'top-full')
        down: "right-0 top-full mt-2 origin-top-right", 
        // Para el último elemento: hacia arriba (se posiciona en 'bottom-full')
        up: "right-0 bottom-full mb-2 origin-bottom-right", 
    };
    
    // Obtenemos la clase específica: 'right-0 bottom-full mb-2 origin-bottom-right' cuando direction='up'
    const currentMenuClass = menuClasses[direction];

    return (
        <div className="relative inline-block text-left" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                // Uso de clases condicionales para el estado abierto/cerrado
                className={`p-1 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors 
                            ${isOpen ? 'bg-gray-100 text-gray-800' : ''}`}
                aria-expanded={isOpen ? "true" : "false"}
                aria-haspopup="true"
            >
                <FiMoreVertical size={20} />
            </button>

            {isOpen && (
                <div 
                    // 🚨 Aplicación de la clase que fuerza la apertura hacia ARRIBA o ABAJO
                    className={`absolute z-50 w-36 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${currentMenuClass}`}
                >
                    <div className="py-1">
                        <button
                            onClick={handleEdit}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                            <FiEdit3 className="mr-3 h-4 w-4" />
                            Editar
                        </button>
                        
                        <button
                            onClick={handleDelete}
                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                            <FiTrash2 className="mr-3 h-4 w-4" />
                            Eliminar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}