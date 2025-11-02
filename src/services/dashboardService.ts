import { HTTP } from "../config/axios";
import { URL_PATHS } from "../constants/urlPaths";

// Define las interfaces de respuesta
interface SalesChartItem {
  date: string;
  total: number;
}
interface DashboardStats {
  salesToday: number;
  salesWeek: number;
  salesMonth: number;
  ordersToday: number;
  salesChart30d: SalesChartItem[];
}
interface Product {
  productId: string;
  name: string;
}
interface LowStockItem {
  ingredientId: string;
  name: string;
}

export const DASHBOARD_SERVICE = {
  getStats: async (): Promise<DashboardStats> => {
    const { data } = await HTTP.get(URL_PATHS.DASHBOARD.STATS);
    return data;
  },

  getPopularProducts: async (limit: number = 5): Promise<Product[]> => {
    const { data } = await HTTP.get(
      `${URL_PATHS.PRODUCTS.POPULAR_LIST}?limit=${limit}`
    );
    return data;
  },

  getLowStock: async (): Promise<LowStockItem[]> => {
    const { data } = await HTTP.get(URL_PATHS.INGREDIENTS.LOW_STOCK);
    return data;
  },
};