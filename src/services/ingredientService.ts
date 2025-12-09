import { HTTP } from "../config/axios";
import { URL_PATHS } from "../constants/urlPaths";

// Definimos el tipo de respuesta (basado en tu schema)
export interface IIngredient {
  ingredient_id: string;
  name: string;
  unit_of_measure: string;
  stock_current_level: number;
}

export const INGREDIENT_SERVICE = {
  // Tu router tiene paginación, pero para un selector
  // querremos todos. Usamos un page_size grande (pero válido).
  getAllIngredients: async (): Promise<IIngredient[]> => {
    const { data } = await HTTP.get(URL_PATHS.INGREDIENTS.GET_ALL, {
      params: { 
          page: 1, 
          // ✅ CORREGIDO: De 200 a 100 (el máximo de tu API)
          page_size: 100 
        }, 
    });
    // Asumimos que la respuesta es como la de productos
    return data.ingredients || data;
  },
};