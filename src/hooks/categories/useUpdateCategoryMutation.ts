import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CATEGORY_SERVICE } from "../../services/categories";
import { useSnackbar } from "../useSnackbar";

export const useUpdateCategoryMutation = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      CATEGORY_SERVICE.update(id, data),

    onSuccess: () => {
      showSnackbar({
        type: "success",
        message: "Categoría actualizada correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },

    onError: () => {
      showSnackbar({
        type: "error",
        message: "Error al actualizar la categoría",
      });
    },
  });
};