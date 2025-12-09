import { HTTP } from "../config/axios";
import { URL_PATHS } from "../constants/urlPaths";

// Definimos el tipo de respuesta (basado en tu imagen de BD)
export interface ICustomizationGroup {
  group_id: string;
  system_name: string;
  display_name: string;
}

// 💡 Esta es la línea clave que tu otro archivo está buscando.
export const CUSTOMIZATION_GROUP_SERVICE = {
  // 🛑 ADVERTENCIA: Esta ruta es un invento.
  // Debes crear un router en tu backend que responda en
  // URL_PATHS.CUSTOMIZATION_GROUPS.GET_ALL
  getAllGroups: async (): Promise<ICustomizationGroup[]> => {
    const { data } = await HTTP.get(URL_PATHS.CUSTOMIZATION_GROUPS.GET_ALL);
    
    // Si la ruta no existe, devolvemos un array vacío para no crashear
    if (!data) {
        console.error("No se pudo cargar customization_groups. ¿La ruta API existe?");
        return [];
    }
    
    return data; // Espera [{ group_id: "...", display_name: "..."}]
  },
};