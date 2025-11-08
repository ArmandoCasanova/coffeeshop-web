import React from 'react';
import { FiDownload, FiEye, FiAlertCircle, FiTrash } from 'react-icons/fi';

// Mapeo de estados de la API a estilos de Tailwind
const statusStyles = {
  generado: 'bg-green-100 text-green-700',
  en_proceso: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
};

// Mapeo de estados de la API a texto legible
const statusText = {
  generado: 'Generado',
  en_proceso: 'En proceso',
  error: 'Error',
};

// Función helper para formatear la fecha
const formatDate = (isoString) => {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (error) {
    return isoString.split('T')[0]; // Fallback
  }
};

// Aceptamos las props de descarga y borrado
export default function ReportRow({ 
    report, 
    onDelete, 
    onDownload, 
    isDeleting, 
    isDownloading 
}) {
  
  const apiStatus = report.status; 
  const isGenerated = apiStatus === 'generado';
  const isError = apiStatus === 'error';
  const isProcessing = apiStatus === 'en_proceso';

  const statusClass = statusStyles[apiStatus] || 'bg-gray-100 text-gray-700';
  const statusLabel = statusText[apiStatus] || 'Desconocido';

  // --- ¡NUEVA LÓGICA AQUÍ! ---
  // 1. Extraer el formato del reporte
  // El backend lo guarda como 'excel' o 'pdf'
  const fileFormat = report.parameters?.report_format || 'pdf'; // Default a 'pdf'

  // 2. Crear un texto legible y un estilo
  let formatLabel = 'PDF';
  let formatClass = 'bg-red-100 text-red-700'; // Estilo para PDF

  if (fileFormat === 'xlsx' || fileFormat === 'excel') {
      formatLabel = 'XLSX';
      formatClass = 'bg-emerald-100 text-emerald-700'; // Estilo para Excel
  } else if (fileFormat === 'csv') {
      formatLabel = 'CSV';
      formatClass = 'bg-blue-100 text-blue-700'; // Estilo para CSV
  }
  // --- FIN DE LA NUEVA LÓGICA ---


  let actionButton = null;

  // Lógica del botón de acción (sin cambios)
  if (isGenerated) {
    actionButton = (
      <button
        onClick={() => onDownload(report.id)}
        disabled={isDownloading}
        className="text-brown-600 hover:text-brown-800 transition duration-150 flex items-center justify-center font-semibold w-full disabled:opacity-50"
      >
        <FiDownload className="mr-1" />
        {isDownloading ? "Cargando..." : "Descargar"}
      </button>
    );
  } else if (isError) {
    // ... (sin cambios)
  } else {
    // ... (sin cambios)
  }

  // Handler para el clic en el botón de borrar (sin cambios)
  const handleDeleteClick = () => {
    if (!isDeleting && !isDownloading) {
      onDelete(report.id);
    }
  };

  return (
    <div className="grid grid-cols-6 items-center gap-4 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 p-4">
      
      {/* Col 1: Nombre del Reporte (sin cambios) */}
      <div className="col-span-2 text-left font-medium text-gray-800">
        {report.name}
      </div>
      
      {/* --- ¡COLUMNA MODIFICADA! --- */}
      {/* Col 2: Tipo y Formato */}
      <div className="text-center text-gray-600 space-y-1">
        {/* El tipo de reporte (ej. Ventas) */}
        <div>{report.type}</div>
        {/* El tag del formato (ej. PDF) */}
        <span 
          className={`px-2 py-0.5 rounded-full text-xs font-semibold ${formatClass}`}
        >
          {formatLabel}
        </span>
      </div>
      
      {/* Col 3: Fecha (sin cambios) */}
      <div className="text-center text-gray-600">
        {formatDate(report.request_date)}
      </div>
      
      {/* Col 4: Estatus (sin cambios) */}
      <div className="text-center">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}
        >
          {statusLabel}
        </span>
      </div>
      
      {/* Col 5: Acciones (sin cambios) */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-3">
          <div className="flex-1">{actionButton}</div>
          {!isProcessing && (
            <button
              onClick={handleDeleteClick}
              disabled={isDeleting || isDownloading}
              className="text-gray-400 hover:text-red-600 transition duration-150 p-1 rounded-full hover:bg-red-100 disabled:opacity-30 disabled:cursor-not-allowed"
              title="Eliminar reporte"
            >
              <FiTrash size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}