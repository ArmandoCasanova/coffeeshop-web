import { useState } from "react";
import { FiPlus, FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "../hooks/useSnackbar";
import { REPORT_SERVICE } from "../services/report";
import { saveAs } from 'file-saver'; 

// Componentes
import ReportRow from "../components/ReportRow";
import GenerateReportModal from "../components/GenerateReportModal";
import FilterDropdown from "../components/FilterDropdown";

const filterOptions = [
  { label: "Todos", value: null },
  { label: "Generado", value: "generado" },
  { label: "En proceso", value: "en_proceso" },
  { label: "Error", value: "error" },
];

const PAGE_SIZE = 20;

export default function Reports() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(null);
  const [page, setPage] = useState(1);

  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  // --- Query para obtener reportes (Sin cambios) ---
  const { data, isLoading } = useQuery({
    queryKey: ["reports", page, PAGE_SIZE, statusFilter, searchTerm],
    queryFn: () =>
      REPORT_SERVICE.getAllReports(
        page,
        PAGE_SIZE,
        statusFilter,
        searchTerm
      ),
    keepPreviousData: true,
    refetchInterval: (data) =>
      data?.reports?.some(r => r.status === 'en_proceso') ? 30000 : false,
  });

  // --- Mutación para crear reporte (Sin cambios) ---
  const createReportMutation = useMutation({
    mutationFn: REPORT_SERVICE.requestNewReport,
    onSuccess: (newReport) => {
      queryClient.invalidateQueries(["reports"]);
      showSnackbar({ type: "success", message: "Reporte solicitado." });
      setIsModalOpen(false);
      setPage(1);
    },
    onError: (err) => {
      showSnackbar({
        type: "error",
        message: err.message || "Error al solicitar el reporte",
      });
    },
  });

  // --- Mutación para descargar (Sin cambios) ---
  const downloadReportMutation = useMutation({
      mutationFn: REPORT_SERVICE.downloadReport,
      onSuccess: (response) => {
          const contentDisposition = response.headers['content-disposition'];
          let filename = 'reporte_generado.bin';
          if (contentDisposition) {
              const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
              if (filenameMatch && filenameMatch[1]) {
                  filename = filenameMatch[1];
              }
          }
          saveAs(response.data, filename);
          showSnackbar({ type: "success", message: "Descarga iniciada..." });
      },
      onError: (err) => {
          showSnackbar({
              type: "error",
              message: err.message || "Error al descargar el archivo",
          });
      },
  });

  // --- Mutación para borrar reporte (Sin cambios) ---
  const deleteReportMutation = useMutation({
    mutationFn: REPORT_SERVICE.deleteReport,
    onSuccess: () => {
      queryClient.invalidateQueries(["reports"]);
      showSnackbar({ type: "success", message: "Reporte eliminado." });
    },
    onError: (err) => {
      showSnackbar({
        type: "error",
        message: err.message || "Error al eliminar el reporte",
      });
    },
  });

  // --- Handlers (Sin cambios) ---
  const handleFilterSelect = (option) => {
    setStatusFilter(option.value);
    setPage(1);
  };
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };
  const handleGenerateReport = (formData) => {
    const report_type = formData.reportType; 
    const format = formData.format.split(' ')[0].replace('.', '').toLowerCase();
    
    const apiData = {
      report_type: report_type,
      start_date: formData.startDate,
      end_date: formData.endDate,
      format: format,
    };
    createReportMutation.mutate(apiData);
  };
  const handleDeleteReport = (reportId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este reporte?")) {
      deleteReportMutation.mutate(reportId);
    }
  };
  const handleDownloadReport = (reportId) => {
      downloadReportMutation.mutate(reportId);
  };

  const reportsList = data?.reports || [];
  const totalReports = data?.total || 0;
  const totalPages = Math.ceil(totalReports / PAGE_SIZE);

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-brown-600">Reportes</h1>

      {/* --- ¡ESTA ES LA SECCIÓN CORREGIDA! --- */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-8 mb-6">
        <div className="relative w-full sm:w-auto md:w-72">
          <input
            type="text"
            placeholder="Buscar un reporte..."
            className="w-full px-4 py-3 border border-brown-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300 pl-10"
            value={searchTerm}
            onChange={handleSearchChange} 
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>

        <div className="flex w-full sm:w-auto items-center gap-3 sm:ml-auto">
          <div className="flex-grow sm:flex-grow-0">
            <FilterDropdown
              options={filterOptions}
              onSelect={handleFilterSelect}
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={createReportMutation.isLoading} 
            className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 px-5 py-3 bg-brown-300 text-white font-semibold rounded-lg hover:bg-brown-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiPlus />
            <span className="hidden sm:inline">Generar reporte</span>
          </button>
        </div>
      </div>
      {/* --- FIN DE LA SECCIÓN CORREGIDA --- */}


      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="w-full">
          {/* --- ENCABEZADOS DE LA TABLA (Sin cambios) --- */}
          <div className="hidden md:block bg-gray-100 p-2 m-4 rounded-xl">
             <div className="grid grid-cols-6 gap-4">
               <div className="col-span-2 bg-white rounded-lg p-2 font-bold text-gray-600 text-left px-4">
                 Nombre del Reporte
               </div>
               <div className="bg-white rounded-lg p-2 font-bold text-gray-600 text-center">
                 Tipo / Formato
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
          
          {/* --- Lista de Reportes (Sin cambios) --- */}
          <div className="space-y-3 md:space-y-0 p-2 sm:p-4">
            {isLoading ? (
              <p className="text-center p-4">Cargando historial...</p>
            ) : (
              reportsList.map((report) => (
                <ReportRow 
                  key={report.id} 
                  report={report}
                  onDelete={handleDeleteReport}
                  onDownload={handleDownloadReport}
                  isDeleting={
                    deleteReportMutation.isLoading &&
                    deleteReportMutation.variables === report.id
                  }
                  isDownloading={
                    downloadReportMutation.isLoading &&
                    downloadReportMutation.variables === report.id
                  }
                />
              ))
            )}
          </div>

          {/* --- Mensaje "No se encontraron" (Sin cambios) --- */}
          {!isLoading && reportsList.length === 0 && (
            <p className="text-center text-gray-500 py-10">
              No se encontraron reportes
              {statusFilter ? ` con filtro "${statusFilter}"` : ""}
              {searchTerm ? ` para "${searchTerm}"` : ""}.
            </p>
          )}

          {/* --- Paginación (Sin cambios) --- */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center p-4 border-t border-gray-100">
              <span className="text-sm text-gray-600">
                Página <strong>{page}</strong> de <strong>{totalPages}</strong>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  <FiChevronLeft size={18} />
                  Anterior
                </button>
                <button
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                  className="flex items-center justify-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Siguiente
                  <FiChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- Modal (Sin cambios) --- */}
      {isModalOpen && (
        <GenerateReportModal
          onClose={() => setIsModalOpen(false)}
          onGenerate={handleGenerateReport}
          isGenerating={createReportMutation.isLoading}
        />
      )}
    </div>
  );
}