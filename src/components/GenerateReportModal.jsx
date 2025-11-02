// src/components/GenerateReportModal.jsx

import { useState } from 'react';
import { FiX } from 'react-icons/fi';

const REPORT_TYPES = [
    'Ventas por Producto',
    'Clientes',
    'Finanzas (Ingresos/Egresos)',
    'Inventario y Stock',
];

const FILE_FORMATS = ['Excel (.xlsx)', 'CSV (.csv)', 'PDF (.pdf)'];

export default function GenerateReportModal({ onClose, onGenerate }) {
    const [formData, setFormData] = useState({
        reportType: REPORT_TYPES[0],
        startDate: '',
        endDate: '',
        format: FILE_FORMATS[0],
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onGenerate(formData);
    };

    return (
        // *******************************************************************
        // SOLUCIÓN: Usamos 'bg-black/50' para asegurar transparencia neutral.
        // *******************************************************************
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4">
            
            {/* Contenido principal del modal */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                
                {/* Encabezado del Modal */}
                <header className="flex justify-between items-center p-6 border-b border-gray-100 bg-cream-50">
                    <h2 className="text-2xl font-semibold text-brown-600">Generar Nuevo Reporte</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-brown-600 transition">
                        <FiX size={24} />
                    </button>
                </header>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    
                    {/* Sección 1: Tipo de Reporte */}
                    <div className="space-y-1">
                        <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">
                            Selecciona el Tipo de Reporte
                        </label>
                        <select
                            id="reportType"
                            name="reportType"
                            value={formData.reportType}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:border-brown-500 focus:ring-brown-500 transition"
                        >
                            {REPORT_TYPES.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sección 2: Rango de Fechas */}
                    <div className="space-y-1">
                        <label className="block text-sm font-medium text-gray-700">
                            Rango de Fechas
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-brown-500 focus:ring-brown-500 transition"
                                />
                                <span className="block text-xs text-gray-500 mt-1">Fecha de Inicio</span>
                            </div>
                            <div>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:border-brown-500 focus:ring-brown-500 transition"
                                />
                                <span className="block text-xs text-gray-500 mt-1">Fecha de Fin</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Sección 3: Formato de Salida */}
                    <div className="space-y-1">
                        <label htmlFor="format" className="block text-sm font-medium text-gray-700">
                            Formato de Salida
                        </label>
                        <select
                            id="format"
                            name="format"
                            value={formData.format}
                            onChange={handleChange}
                            required
                            className="w-full mt-1 p-3 border border-gray-300 rounded-lg shadow-sm focus:border-brown-500 focus:ring-brown-500 transition"
                        >
                            {FILE_FORMATS.map(format => (
                                <option key={format} value={format}>{format}</option>
                            ))}
                        </select>
                    </div>

                    {/* Acciones del Modal */}
                    <div className="flex justify-end pt-4 space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 transition duration-150"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="bg-brown-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-brown-700 transition duration-150"
                        >
                            Generar Reporte
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}