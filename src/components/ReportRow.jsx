// src/components/ReportRow.jsx

import React from 'react';
import { FiDownload, FiEye } from 'react-icons/fi';

const statusStyles = {
  'Generado': 'bg-green-100 text-green-700',
  'En proceso': 'bg-yellow-100 text-yellow-700',
  'Error': 'bg-red-100 text-red-700',
};

export default function ReportRow({ report }) {
  const isGenerated = report.status === 'Generado';
  const statusClass = statusStyles[report.status] || 'bg-gray-100 text-gray-700';

  let actionButton = null;
  if (isGenerated) {
    actionButton = (
      <a
        href={report.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-brown-600 hover:text-brown-800 transition duration-150 flex items-center justify-center font-semibold w-full"
      >
        <FiDownload className="mr-1" />
        Descargar
      </a>
    );
  } else {
    actionButton = (
      <button
        onClick={() => console.log('Ver estado del reporte:', report.id)}
        // --- CORRECCIÓN AQUÍ ---
        className="text-blue-600 hover:text-blue-800 transition duration-150 flex items-center justify-center font-semibold w-full"
      >
        <FiEye className="mr-1" />
        {report.action}
      </button>
    );
  }

  return (
    <div className="grid grid-cols-6 items-center gap-4 bg-white rounded-xl shadow-md hover:shadow-lg transition duration-300 p-4">
      
      {/* Nombre del Reporte (2 columnas) */}
      <div className="col-span-2 text-left font-medium text-gray-800">
        {report.name}
      </div>
      
      {/* Tipo */}
      <div className="text-center text-gray-600">
        {report.type}
      </div>
      
      {/* Fecha */}
      <div className="text-center text-gray-600">
        {report.date}
      </div>
      
      {/* Estatus */}
      <div className="text-center">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${statusClass}`}
        >
          {report.status}
        </span>
      </div>
      
      {/* Acciones */}
      <div className="text-center">
        {actionButton}
      </div>
    </div>
  );
}