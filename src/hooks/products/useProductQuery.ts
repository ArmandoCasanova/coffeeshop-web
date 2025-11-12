import { 
    useQuery, 
    UseQueryResult, 
} from "@tanstack/react-query";
import { HTTP as api } from "../../config/axios";
import { TProductListResponse } from "../../models/product";

const getProducts = async (
    page: number = 1, 
    limit: number = 20, 
    searchTerm: string = ""
): Promise<TProductListResponse> => {
  
  const params = new URLSearchParams({
    page: page.toString(),
    page_size: limit.toString(),
  });

  let url = "/products/";

  if (searchTerm) {
    params.append("name", searchTerm);
    url = "/products/search";
  }

  const { data } = await api.get<TProductListResponse>(url, { params });
  return data;
};


export const useProductsQuery = (
    page: number, 
    limit: number, 
    searchTerm: string
): UseQueryResult<TProductListResponse, unknown> => {
    
  return useQuery({
    queryKey: ["products", page, limit, searchTerm],
    queryFn: () => getProducts(page, limit, searchTerm),
    
    // 💡 SOLUCIÓN al error: Usamos placeholderData o lo quitamos.
    // Usaremos esta opción compatible con v4/v5 si queremos mantener datos:
    placeholderData: (previousData) => previousData, 
    // Si esta línea da error, simplemente quítala. El error es de tipado estricto.
  });
};