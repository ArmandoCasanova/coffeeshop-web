import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CATEGORY_SERVICE } from "../../services/categories";
import { useSnackbar } from "../useSnackbar";

export const useCreateCategoryMutation = () => {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (data: any) => CATEGORY_SERVICE.create(data),
    onSuccess: () => {
      showSnackbar({ type: "success", message: "Categoría creada con éxito" });
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: () => {
      showSnackbar({ type: "error", message: "Error al crear la categoría" });
    },
  });
};