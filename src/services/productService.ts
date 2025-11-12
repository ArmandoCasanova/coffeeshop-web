// src/services/productService.ts

import { HTTP } from "../config/axios";
import { URL_PATHS } from "../constants/urlPaths";

// 🛑 Esta interfaz ahora solo la usaremos de referencia
// ya que FormData no es un objeto JSON tipado.
interface ProductUpdatePayload {
    name?: string;
    base_price?: number;
    image_url?: string;
    is_available?: boolean;
    category_info_json?: object;
    customization_details_json?: object;
}

export const PRODUCT_SERVICE = {
    getAllProducts: async (
        page = 1,
        pageSize = 20,
        filterType: string | null = null,
        searchTerm: string | null = null
    ) => {
        // ... (Tu código de getAllProducts se queda igual)
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

    // ✅ CRÍTICO: Recibe FormData para POST (Creación)
    createProduct: async (productData: FormData) => {
        const { data } = await HTTP.post(URL_PATHS.PRODUCTS.CREATE, productData);
        return data;
    },

    // ✅ CRÍTICO: Recibe FormData también para PUT (Actualización)
    // Esto es necesario para poder actualizar la imagen.
    updateProduct: async (productId: string, productData: FormData) => {
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