import { 
    useMutation, 
    useQueryClient, 
    UseMutationOptions 
} from "@tanstack/react-query";
import { HTTP as api } from "../../config/axios";
import { TProduct } from "../../models/product"; 

type MutationResponse = TProduct; 
type MutationPayload = FormData; 
type MutationError = unknown; 

const createProduct = async (formData: MutationPayload): Promise<MutationResponse> => {
  const { data } = await api.post<MutationResponse>("/products/", formData);
  return data;
};

export const useCreateProductMutation = (
    options?: UseMutationOptions<MutationResponse, MutationError, MutationPayload> 
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      options?.onSuccess?.(data, variables, context); 
    },
    
    ...options,
  });
};