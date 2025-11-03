import { HTTP } from "../config/axios";
import { URL_PATHS } from "../constants/urlPaths";

// ---
// NOTA: Esta interfaz se basa en la lógica de `handleSave` en Promotions.js
// y en los datos que envías a la API.
// (name, description, price) + (discount_type, discount_value, dates)
// ---
interface PromotionPayload {
  name:string,
  discount_type: "percentage" | "fixed_amount";
  discount_value: number;
  start_date: string; 
  end_date: string; 
}

interface UpdatePromotionParams extends PromotionPayload {
  promotionId: string;
}

export const PROMOTION_SERVICE = {
  /**
   * Obtiene todas las promociones.
   * Promotions.js filtra localmente, por eso no se pasan params de filtro.
   */
  getAllPromotions: async () => {
    // Asumo que tienes una ruta similar a la de ingredientes
    const { data } = await HTTP.get(URL_PATHS.PROMOTIONS.GET_ALL);
    return data;
  },

  /**
   * @param promotionData - Objeto con los datos de la nueva promoción.
   */
  createPromotion: async (promotionData: PromotionPayload) => {
    // Reutiliza la URL base de GET_ALL para hacer POST, igual que en INGREDIENT_SERVICE
    const { data } = await HTTP.post(
      URL_PATHS.PROMOTIONS.GET_ALL,
      promotionData
    );
    return data;
  },

  /**
   * @param promotionId - El ID de la promoción a eliminar.
   */
  deletePromotion: async (promotionId: string) => {
    const { data } = await HTTP.delete(
      URL_PATHS.PROMOTIONS.DELETE(promotionId)
    );
    return data;
  },

  /**
   * @param params - Objeto que incluye el promotionId y el payload con los datos a actualizar.
   */
  updatePromotion: async ({
    promotionId,
    ...payload
  }: UpdatePromotionParams) => {
    const { data } = await HTTP.put(
      URL_PATHS.PROMOTIONS.UPDATE(promotionId),
      payload
    );
    return data;
  },
};
