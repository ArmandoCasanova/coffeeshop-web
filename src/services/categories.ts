// src/services/categories.ts
import axios from "axios";

const API_URL = "http://localhost:8000/api/v1/categories";

export const CATEGORY_SERVICE = {
  // 🔹 Obtener todas las categorías (incluyendo la lógica de búsqueda)
  getAll: async ({ name = "", page = 1, pageSize = 10 } = {}) => {
    let url = `${API_URL}`;

    // 🔍 CORRECCIÓN: Si hay un término de búsqueda, usa el endpoint /search
    if (name) {
      url = `${API_URL}/search?name=${encodeURIComponent(name)}&page=${page}&page_size=${pageSize}`;
    } else {
      // Si no hay búsqueda, usa el endpoint de listado normal
      url = `${API_URL}?page=${page}&page_size=${pageSize}`;
    }

    const response = await axios.get(url);
    // Asegúrate de devolver el arreglo de categorías, ya sea de / o de /search
    return response.data.categories || response.data;
  },

  // 🔹 Crear categoría (permite imagen)
  create: async (data: any) => {
    // 🛑 CORRECCIÓN CRÍTICA: Eliminar el Content-Type para FormData.
    // Al eliminarlo, Axios detecta FormData y añade el boundary correcto.
    const response = await axios.post(API_URL, data);
    return response.data;
  },

  // 🔹 Actualizar categoría (permite imagen o solo datos)
  update: async (id: string, data: any) => {
    // Es buena práctica eliminar el Content-Type aquí también.
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  },

  // 🔹 Eliminar categoría
  delete: async (id: string) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  },
};