import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { HTTP as api } from "../../config/axios";
// import { ProductResponse } from "./useProductsQuery";

// 💡 Define la interfaz para la data que envías
interface ProductUpdatePayload {
    name?: string;
    base_price?: number;
    is_available?: boolean;
    // La imagen no puede ir aquí, solo JSON
    // ... otros campos
}

// 1. La función de la API tipada
// Recibe un objeto con el ID y la data JSON.
const updateProduct = async (
    { productId, productData }: { productId: string; productData: ProductUpdatePayload }
): Promise<ProductResponse> => {
  
  const { data } = await api.put<ProductResponse>(`/products/${productId}`, productData);
  return data;
};

// 2. El Hook
export const useUpdateProductMutation = (
    options?: UseMutationOptions<
        ProductResponse, 
        unknown, 
        { productId: string; productData: ProductUpdatePayload }
    > 
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", data.product_id] });
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};