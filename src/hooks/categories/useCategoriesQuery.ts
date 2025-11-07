// export const useCategoriesQuery = () => { ...
import { useQuery } from "@tanstack/react-query";
import { CATEGORY_SERVICE } from "../../services/categories";

// 🛑 ACEPTAR EL TÉRMINO DE BÚSQUEDA COMO ARGUMENTO
export const useCategoriesQuery = (searchTerm = "") => {
  return useQuery({
    // La clave de consulta debe cambiar con el término de búsqueda
    queryKey: ["categories", { searchTerm }], 
    
    // 🛑 CORRECCIÓN DEL ERROR DE queryFn: 
    // Ahora llamamos a getAll como una función que devuelve una Promesa, 
    // y le pasamos el objeto de argumentos { name: searchTerm }
    queryFn: () => CATEGORY_SERVICE.getAll({ name: searchTerm }),
  });
};
