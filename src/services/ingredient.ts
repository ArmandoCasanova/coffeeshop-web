import { HTTP } from "../config/axios";
import { URL_PATHS } from "../constants/urlPaths";

interface IngredientPayload {
  name: string;
  unit_of_measure: string;
  stock_current_level: number;
  stock_optimal_level: number;
}

interface UpdateIngredientParams extends IngredientPayload {
  ingredientId: string;
}

export const INGREDIENT_SERVICE = {
  getAllIngredients: async (page = 1, pageSize = 20, status = null) => {
    const params = {
      page,
      page_size: pageSize,
      status: status || undefined,
    };
    const { data } = await HTTP.get(URL_PATHS.INGREDIENTS.GET_ALL, { params });
    return data;
  },

  /**
   * @param ingredientData - Objeto con los datos del nuevo ingrediente.
   */
  createIngredient: async (ingredientData: IngredientPayload) => {
    const { data } = await HTTP.post(URL_PATHS.INGREDIENTS.GET_ALL, ingredientData);
    return data;
  },

  deleteIngredient: async (ingredientId: string) => {
    const { data } = await HTTP.delete(URL_PATHS.INGREDIENTS.DELETE(ingredientId));
    return data;
  },
  /**
   * @param params - Objeto que incluye el ingredientId y el payload con los datos a actualizar.
   */
  updateIngredient: async ({ ingredientId, ...payload }: UpdateIngredientParams) => {
    const { data } = await HTTP.put(
      URL_PATHS.INGREDIENTS.UPDATE(ingredientId), 
      payload 
    );
    return data;
  },
};