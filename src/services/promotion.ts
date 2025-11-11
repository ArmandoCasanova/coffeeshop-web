import { HTTP } from "../config/axios";
import { URL_PATHS } from "../constants/urlPaths";

interface PromotionPayload {
  code: string;
  discount_type: "percentage" | "fixed_amount";
  discount_value: number;
  start_date: string; 
  end_date: string; 
}

interface UpdatePromotionParams extends PromotionPayload {
  promotionId: string;
}

export const PROMOTION_SERVICE = {
  getAllPromotions: async () => {
    const { data } = await HTTP.get(URL_PATHS.PROMOTIONS.GET_ALL);
    return data;
  },

  /**
   * @param promotionData 
   */
  createPromotion: async (promotionData: PromotionPayload) => {
    const { data } = await HTTP.post(
      URL_PATHS.PROMOTIONS.GET_ALL,
      promotionData
    );
    return data;
  },

  /**
   * @param promotionId 
   */
  deletePromotion: async (promotionId: string) => {
    const { data } = await HTTP.delete(
      URL_PATHS.PROMOTIONS.DELETE(promotionId)
    );
    return data;
  },

  /**
   * @param params 
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