import * as z from "zod";

// --- 1. Sub-Schemas para los campos JSON ---

// 1.1 Esquema de la información de Categoría (Como lo arma NewProductModal.jsx)
// 💡 Tu modal envía un array de IDs, no un objeto
export const categoryInfoSchema = z.object({
  categories_ids: z.array(z.string().uuid("El ID de categoría debe ser un UUID")),
});

// 1.2 Esquemas de Personalización
const sizeOptionSchema = z.object({
  name: z.string().min(1, "El nombre del tamaño es obligatorio"),
  // 💡 price es el precio ADICIONAL al base_price
  price: z.number().min(0, "El precio adicional no puede ser negativo"),
});

const customizationOptionSchema = z.object({
  display_name: z.string().min(1, "El nombre de la opción es obligatorio"),
  price: z.number().min(0, "El precio adicional no puede ser negativo"),
});

const customizationGroupSchema = z.object({
  group_id: z.string().uuid("El ID de grupo debe ser un UUID").nullable(),
  system_name: z.string().min(1, "El nombre de sistema es obligatorio"),
  display_name: z.string().min(1, "El nombre de grupo es obligatorio"),
  is_required: z.boolean(),
  type: z.enum(["radio", "checkbox", "select"]), // 💡 Tu editor usa estos tipos
  options: z.array(customizationOptionSchema).min(1, "Debe haber al menos una opción"),
});

// 1.3 Esquema de los detalles de personalización (Como lo arma NewProductModal.jsx)
export const customizationDetailsSchema = z.object({
  sizes: z.array(sizeOptionSchema).min(1, "Debe haber al menos un tamaño"),
  customization_groups: z.array(customizationGroupSchema),
});


// --- 2. Esquema Principal ---

/**
 * Esquema base del Producto (tal como regresa de la API)
 */
export const productSchema = z.object({
  product_id: z.string().uuid("El ID del producto debe ser un UUID válido"),
  name: z.string().min(1, "El nombre es obligatorio"),
  base_price: z.number().min(0.01, "El precio base debe ser mayor que cero"),
  is_available: z.boolean(),
  
  // 💡 CRÍTICO: La API ahora solo maneja URLs de ImgBB
  image_url: z.string().url("La URL de la imagen debe ser una URL válida (ImgBB)"),
  
  // 💡 Usamos los schemas actualizados
  category_info_json: categoryInfoSchema,
  customization_details_json: customizationDetailsSchema,
  
  created_at: z.string().datetime().optional(), // o z.string() si no te importa
  updated_at: z.string().datetime().optional().nullable(), // o z.string()
});


// --- 3. Tipos Derivados (Interfaces) ---

export type TProduct = z.infer<typeof productSchema>;

// Tipo para la lista de productos (respuesta paginada de la API)
export interface TProductListResponse {
  products: TProduct[];
  total: number;
  page: number;
  page_size: number;
}

// 💡 Estos son los tipos que SÍ enviaremos a la API
export type TProductCreatePayload = Omit<TProduct, "product_id" | "created_at" | "updated_at">;
export type TProductUpdatePayload = Partial<TProductCreatePayload>;

// Tipos para los sub-schemas
export type TCategoryInfo = z.infer<typeof categoryInfoSchema>;
export type TCustomizationDetails = z.infer<typeof customizationDetailsSchema>;