import { HTTP } from "../config/axios";
import { URL_PATHS } from "../constants/urlPaths";

interface ClientUpdatePayload {
  name: string;
  last_name: string;
  email: string;
  birth_date: string; 
  role: "customer" | "admin"; 
  points: number;
}

interface UpdateClientParams extends ClientUpdatePayload {
  userId: string;
}

export const CLIENT_SERVICE = {
  getAllClients: async (
    page = 1,
    pageSize = 20,
    search?: string,
    is_verified?: boolean
  ) => {
    const params = {
      page,
      page_size: pageSize,
      search: search || undefined,
      is_verified: is_verified,
    };
    const { data } = await HTTP.get(URL_PATHS.CLIENTS.GET_ALL, { params });
    return data;
  },

  /**
   * @param params 
   */
  updateClient: async ({ userId, ...payload }: UpdateClientParams) => {
    const apiPayload = {
      ...payload,
      role: payload.role || "customer",
    };

    const { data } = await HTTP.put(
      URL_PATHS.CLIENTS.UPDATE(userId),
      apiPayload
    );
    return data;
  },

  /**
   * @param userId 
   */
  deleteClient: async (userId: string) => {
    const { data } = await HTTP.delete(URL_PATHS.CLIENTS.DELETE(userId));
    return data;
  },
};

