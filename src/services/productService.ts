import { HTTP } from "../config/axios";
import { URL_PATHS } from "../constants/urlPaths";

interface ProductCreatePayload {
  name: string;
  basePrice: number;
  imageUrl: string;
  isAvailable: boolean;
  categoryInfoJson?: object;
  customizationDetailsJson?: object;
}

interface ProductUpdatePayload {
  name?: string;
  basePrice?: number;
  imageUrl?: string;
  isAvailable?: boolean;
  categoryInfoJson?: object;
  customizationDetailsJson?: object;
}

export const PRODUCT_SERVICE = {
  getAllProducts: async (
    page = 1,
    pageSize = 20,
    filterType: string | null = null,
    searchTerm: string | null = null
  ) => {
    
    if (searchTerm) {
      const { data } = await HTTP.get(URL_PATHS.PRODUCTS.SEARCH, {
        params: { name: searchTerm, page, page_size: pageSize },
      });
      return data;
    }
    
    if (filterType === "best-sellers") {
      const { data } = await HTTP.get(URL_PATHS.PRODUCTS.GET_POPULAR, {
        params: { limit: pageSize },
      });
      return { products: data, total: data.length, page: 1, pageSize };
    }

    let availabilityParam: boolean | undefined = undefined;
    if (filterType === "available") availabilityParam = true;
    if (filterType === "unavailable") availabilityParam = false;

    const { data } = await HTTP.get(URL_PATHS.PRODUCTS.GET_ALL, {
      params: {
        page,
        page_size: pageSize,
        is_available: availabilityParam,
      },
    });
    return data;
  },

  createProduct: async (productData: ProductCreatePayload) => {
    const { data } = await HTTP.post(URL_PATHS.PRODUCTS.CREATE, productData);
    return data;
  },

  updateProduct: async (productId: string, productData: ProductUpdatePayload) => {
    const { data } = await HTTP.put(
      URL_PATHS.PRODUCTS.UPDATE(productId),
      productData
    );
    return data;
  },

  deleteProduct: async (productId: string) => {
    const { data } = await HTTP.delete(URL_PATHS.PRODUCTS.DELETE(productId));
    return data;
  },
};