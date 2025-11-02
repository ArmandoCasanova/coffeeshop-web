// En: src/services/orderService.ts
import { HTTP } from "../config/axios";
import { URL_PATHS } from "../constants/urlPaths";

export const ORDER_SERVICE = {
  getAllOrders: async (page = 1, pageSize = 20, status = null) => {
    const params = {
      page,
      page_size: pageSize,
      status: status || undefined,
    };
    const { data } = await HTTP.get(URL_PATHS.ORDERS.GET_ALL, { params });
    return data;
  },

  deleteOrder: async (orderId: string) => {
    const { data } = await HTTP.delete(URL_PATHS.ORDERS.DELETE(orderId));
    return data;
  },

  updateOrderStatus: async ({ orderId, status }: { orderId: string, status: string }) => {
    const { data } = await HTTP.patch(
      URL_PATHS.ORDERS.UPDATE_STATUS(orderId), 
      { status }
    );
    return data;
  },
};