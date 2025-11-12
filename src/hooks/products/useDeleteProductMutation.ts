import { useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query";
import { HTTP as api } from "../../config/axios";

// 1. La función de la API tipada
// El backend no devuelve contenido (ej. status 204), pero tanstack/query espera un retorno
const deleteProduct = async (productId: string): Promise<void> => {
  // Asume que el endpoint DELETE devuelve 204 No Content
  await api.delete(`/products/${productId}`);
};

// 2. El Hook
export const useDeleteProductMutation = (
    // La respuesta es 'void' (vacío), el error 'unknown', el input 'string' (el ID)
    options?: UseMutationOptions<void, unknown, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (data, variables, context) => {
      // Forzamos la actualización de la lista de productos
      queryClient.invalidateQueries({ queryKey: ["products"] }); 
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};