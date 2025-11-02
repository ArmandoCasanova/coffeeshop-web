// src/pages/Reports.jsx

import { useState } from "react";
import { FiPlus, FiSearch } from "react-icons/fi";
import ReportRow from "../components/ReportRow";
import GenerateReportModal from "../components/GenerateReportModal";
import FilterDropdown from "../components/FilterDropdown";

// --- Estructura de Datos Ficticios para el Historial ---
const initialReports = [
  {
    id: 1,
    name: "Ventas Mensuales - Octubre 2025",
    type: "Finanzas",
    date: "2025-11-01",
    status: "Generado",
    action: "Descargar",
    fileUrl: "/reports/ventas_oct.pdf",
  },
  {
    id: 2,
    name: "Productos más vendidos (Q3)",
    type: "Productos",
    date: "2025-10-15",
    status: "Generado",
    action: "Descargar",
    fileUrl: "/reports/top_q3.xlsx",
  },
  {
    id: 3,
    name: "Clientes Inactivos (6 Meses)",
    type: "Clientes",
    date: "2025-11-02",
    status: "En proceso",
    action: "Ver estado",
    fileUrl: null,
  },
];

// Opciones de filtro adaptadas a reportes
const filterOptions = [
  { label: "Fecha", value: "date" },
  { label: "Tipo", value: "type" },
  { label: "Estado", value: "status" },
];

export default function Reports() {
  const [reports, setReports] = useState(initialReports);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleFilterSelect = (option) => {
    console.log("Filtro de Reportes seleccionado:", option);
  };

  const handleGenerateReport = (formData) => {
    console.log("Solicitud de Reporte enviada:", formData);

    const newReport = {
      id: Date.now(),
      name: `Reporte de ${formData.reportType}`,
      type: formData.reportType,
      date: new Date().toISOString().slice(0, 10),
      status: 'En proceso',
      action: 'Ver estado',
      fileUrl: null,
    };

    setReports([newReport, ...reports]);
    setIsModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-brown-600">Reportes</h1>

      {/* --- Barra de Búsqueda, Filtros y Botón (Corregida) --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-8 mb-6">
        {/* Búsqueda: Ancho controlado */}
        <div className="relative w-full sm:w-auto md:w-72">
          <input
            type="text"
            placeholder="Buscar un reporte..."
            className="w-full px-4 py-3 border border-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300 pl-10"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {/* Filtros y Botón: Alineados a la derecha */}
        <div className="flex w-full sm:w-auto items-center gap-3 sm:ml-auto">
          <div className="flex-grow sm:flex-grow-0">
            <FilterDropdown
              options={filterOptions}
              onSelect={handleFilterSelect}
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-5 py-3 bg-brown-300 text-white font-semibold rounded-lg hover:bg-brown-400 transition-colors"
          >
            <FiPlus />
            <span className="hidden sm:inline">Generar reporte</span>
          </button>
        </div>
      </div>
      {/* --- FIN: Barra de Búsqueda, Filtros y Botón --- */}

      {/* --- Contenedor Principal (Historial de Reportes) --- */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="w-full">
          {/* --- Encabezados de la Tabla --- */}
          <div className="hidden md:block bg-gray-100 p-2 m-4 rounded-xl">
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-2 bg-white rounded-lg p-2 font-bold text-gray-600 text-left px-4">
                Nombre del Reporte
              </div>
              <div className="bg-white rounded-lg p-2 font-bold text-gray-600 text-center">
                Tipo
              </div>
              <div className="bg-white rounded-lg p-2 font-bold text-gray-600 text-center">
                Fecha
              </div>
              <div className="bg-white rounded-lg p-2 font-bold text-gray-600 text-center">
                Estatus
              </div>
              <div className="bg-white rounded-lg p-2 font-bold text-gray-600 text-center">
                Acciones
              </div>
            </div>
          </div>

          {/* --- Filas de Reportes --- */}
          <div className="space-y-3 md:space-y-0 p-2 sm:p-4">
            {reports.map((report) => (
              <ReportRow key={report.id} report={report} />
            ))}
          </div>

          {/* Mensaje de No Reportes */}
          {reports.length === 0 && (
            <p className="text-center text-gray-500 py-10">No hay reportes en el historial.</p>
          )}
        </div>
      </div>

      {/* --- Modal Generar Reporte --- */}
      {isModalOpen && (
        <GenerateReportModal
          onClose={() => setIsModalOpen(false)}
          onGenerate={handleGenerateReport}
        />
      )}
    </div>
  );
}