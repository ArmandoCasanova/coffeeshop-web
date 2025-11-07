import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CATEGORY_SERVICE } from "../../services/categories";
import { useSnackbar } from "../useSnackbar";

export const useDeleteCategoryMutation = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (id: string) => CATEGORY_SERVICE.delete(id), // ✅ id como string
    onSuccess: () => {
      showSnackbar({ type: "success", message: "Categoría eliminada" });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      showSnackbar({ type: "error", message: "Error al eliminar la categoría" });
    },
  });
};