import * as z from "zod";

export const categorySchema = z.object({
  category_id: z.union([z.string(), z.number()]), // acepta string o número según tu backend
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().optional().nullable(),
  imageUrl: z.string().url().optional().nullable(), // atributo de imagen
  created_at: z.string().optional().nullable(),
  updated_at: z.string().optional().nullable(),
});

// Tipos derivados del schema
export type TCategory = z.infer<typeof categorySchema>;
export type TCategoryCreate = Omit<
  TCategory,
  "category_id" | "created_at" | "updated_at"
>;
