// src/services/report.ts

import { HTTP } from "../config/axios";
import { URL_PATHS } from "../constants/urlPaths";

// --- 1. Esta interface VUELVE a ser necesaria ---
interface ReportRequestPayload {
  report_type: string;
  start_date: string;
  end_date: string;
  format: string; // "pdf", "csv", "xlsx"
}

// --- 2. Interfaces de Respuesta (Sin cambios) ---
interface Report {
  id: string; // UUID
  name: string;
  type: string;
  status: "en_proceso" | "generado" | "error";
  request_date: string; // ISO DateTime string
  parameters: Record<string, any>; // Objeto JSON
  // 'file_url' ya no existe en el modelo, pero lo dejamos
  // como 'null' por si el schema de Pydantic lo incluye
  file_url: string | null; 
}

interface PaginatedReportsResponse {
  total: number;
  reports: Report[];
}

// --- 3. Definición del Servicio ---

export const REPORT_SERVICE = {
  
  // (Sin cambios, asumiendo que la corrección skip/limit ya estaba)
  getAllReports: async (
    page = 1,
    pageSize = 20,
    status: string | null = null,
    search: string | null = null
  ): Promise<PaginatedReportsResponse> => {
    const skip = (page - 1) * pageSize;
    const params = {
      skip: skip,
      limit: pageSize,
      status: status || undefined,
      search: search || undefined,
    };
    const { data } = await HTTP.get(URL_PATHS.REPORTS.GET_ALL, { params });
    return data;
  },

  /**
   * --- REVERTIDO ---
   * Solicita la generación (crea el snapshot JSON)
   */
  requestNewReport: async (reportData: ReportRequestPayload): Promise<Report> => {
    // REVERTIDO: Enviamos JSON, no FormData
    const { data } = await HTTP.post(URL_PATHS.REPORTS.GET_ALL, reportData, {
        headers: {
            'Content-Type': 'application/json',
        }
    });
    return data;
  },

  /**
   * --- NUEVA FUNCIÓN ---
   * Descarga el archivo generado dinámicamente
   */
  downloadReport: async (reportId: string) => {
    // Asumimos que tienes una ruta URL_PATHS.REPORTS.DOWNLOAD(reportId)
    // que apunta a /reports/{id}/download
    const response = await HTTP.get(
        URL_PATHS.REPORTS.DOWNLOAD(reportId), 
        {
            // ¡MUY IMPORTANTE!
            // Le decimos a Axios que esperamos un archivo binario (blob)
            responseType: 'blob', 
        }
    );
    
    // Devolvemos la RESPUESTA COMPLETA de Axios
    // porque necesitaremos 'response.data' (el blob)
    // y 'response.headers' (para el nombre del archivo)
    return response; 
  },

  /**
   * (Sin cambios)
   */
  deleteReport: async (reportId: string) => {
    const { data } = await HTTP.delete(URL_PATHS.REPORTS.DELETE(reportId));
    return data;
  },
};