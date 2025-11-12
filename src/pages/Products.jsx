import { useState, useEffect } from "react"; // 💡 Añadimos useEffect
import { FiPlus } from "react-icons/fi";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PRODUCT_SERVICE } from "../services/productService";
import { useSnackbar } from "../hooks/useSnackbar";
import ProductRow from "../components/ProductRow";
import FilterDropdown from "../components/FilterDropdown";
import NewProductModal from "../components/NewProductModal";
import ConfirmModal from "../components/ConfirmModal";
import { AxiosError } from "axios";
import axios from "axios";

const filterOptions = [
  { label: "Todos", value: null },
  { label: "Más vendidos", value: "best-sellers" },
  { label: "Disponibles", value: "available" },
  { label: "No disponibles", value: "unavailable" },
];

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;
const IMGBB_UPLOAD_URL = `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`;

// 💡 Definimos el tamaño de página como una constante
const PAGE_SIZE = 20;

export default function Products() {
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filter, setFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  
  // 💡 --- AÑADIMOS ESTADO DE PAGINACIÓN ---
  const [page, setPage] = useState(1);

  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  // 💡 --- REINICIAMOS LA PÁGINA AL FILTRAR O BUSCAR ---
  // Si el filtro o el término de búsqueda cambian, volvemos a la página 1
  useEffect(() => {
    setPage(1);
  }, [filter, searchTerm]);

  // --- Data Fetching (Modificado) ---
  const { data, isLoading: isLoadingList } = useQuery({
    // 💡 queryKey ahora incluye la 'page'
    queryKey: ["products", filter, searchTerm, page], 
    queryFn: () => {
      if (searchTerm) {
        // 💡 Pasamos 'page' y 'PAGE_SIZE'
        return PRODUCT_SERVICE.getAllProducts(page, PAGE_SIZE, null, searchTerm);
      }
      // 💡 Pasamos 'page' y 'PAGE_SIZE'
      return PRODUCT_SERVICE.getAllProducts(page, PAGE_SIZE, filter?.value, null);
    },
    refetchOnWindowFocus: false,
    // 💡 'keepPreviousData' es útil para que la lista vieja
    // no desaparezca mientras carga la nueva página.
    keepPreviousData: true, 
  });

  const isLoading = isLoadingList;
  
  // 💡 --- EXTRAEMOS DATOS DE PAGINACIÓN DE LA RESPUESTA ---
  const productData = data;
  const products =
    productData?.products?.map((p) => ({
      ...p,
      id: p.product_id, 
    })) || [];
  const totalProducts = productData?.total || 0;
  const totalPages = Math.ceil(totalProducts / PAGE_SIZE);


  // --- Mutations ---
  const mutationOptions = {
    onSuccess: (action) => {
      showSnackbar({ type: "success", message: `Producto ${action}` });
      // 💡 Al invalidar, se recargará la página actual
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["allCategories"] });
      queryClient.invalidateQueries({ queryKey: ["allIngredients"] });
      queryClient.invalidateQueries({ queryKey: ["allCustomGroups"] }); 
      
      setIsNewModalOpen(false);
      setIsEditModalOpen(false);
      setSelectedProduct(null);
    },
    onError: (error, action) => {
      let errorMsg = `Error al ${action} producto.`;
      if (error instanceof AxiosError && error.response) {
        console.error(`Error al ${action} producto:`, error.response.data);
        if (error.response.status === 422) {
            errorMsg = "Error 422: Datos inválidos. Revisa el payload.";
        } else {
            errorMsg = error.response.data.detail || `Error al ${action}`;
        }
      }
      showSnackbar({ type: "error", message: errorMsg });
    }
  };

  const createMutation = useMutation({
    mutationFn: PRODUCT_SERVICE.createProduct,
    ...mutationOptions,
    onSuccess: () => mutationOptions.onSuccess('creado'),
    onError: (error) => mutationOptions.onError(error, 'crear')
  });

  const updateMutation = useMutation({
    mutationFn: ({ productId, data }) =>
      PRODUCT_SERVICE.updateProduct(productId, data),
    ...mutationOptions,
    onSuccess: () => mutationOptions.onSuccess('actualizado'),
    onError: (error) => mutationOptions.onError(error, 'actualizar')
  });
  
  const deleteMutation = useMutation({
    mutationFn: PRODUCT_SERVICE.deleteProduct,
    onSuccess: () => {
      showSnackbar({ type: "success", message: "Producto eliminado" });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsDeleteModalOpen(false);
      setSelectedProduct(null);
    },
    onError: (error) => {
        let errorMsg = "Error al eliminar.";
        if (error instanceof AxiosError && error.response) {
            if (error.response.status === 409) {
                errorMsg = "No se puede borrar: El producto está enlazado a un pedido.";
            } else {
                errorMsg = error.response.data?.detail || errorMsg;
            }
        }
        showSnackbar({ type: "error", message: errorMsg });
        setIsDeleteModalOpen(false);
        setSelectedProduct(null);
    }
  });

  // --- Handlers ---
  const handleFilterSelect = (option) => {
    setSearchTerm("");
    setFilter(option);
    // setPage(1) // 💡 No es necesario, el useEffect se encarga
  };

  const handleConfirmDelete = () => {
    if (selectedProduct) {
      deleteMutation.mutate(selectedProduct.product_id);
    }
  };

  // 💡 --- NUEVOS HANDLERS DE PAGINACIÓN ---
  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    // Solo avanza si no estás ya en la última página
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    }
  };


  const handleSaveProduct = async (modalData) => {
    // ... (Esta función no necesita cambios, está perfecta)
    const {
      name,
      description,
      basePrice,
      isAvailable,
      imageFile,
      existingImageUrl,
      category_info_json, 
      customization_details_json,
      ingredients_json,
      id, 
    } = modalData;

    let finalImageUrl = existingImageUrl || null;

    try {
      if (imageFile) {
        const imgFormData = new FormData();
        imgFormData.append("image", imageFile);
        const res = await axios.post(IMGBB_UPLOAD_URL, imgFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        finalImageUrl = res.data.data.url;
      }
      
      if (!finalImageUrl) {
        showSnackbar({ type: "error", message: "La imagen del producto es obligatoria." });
        return; 
      }

      // 🛑 ¡ERROR ENCONTRADO AQUÍ! 🛑
      // Tu servicio 'productService.ts' espera FormData para crear y actualizar
      // porque así lo definiste para poder subir imágenes.
      // Pero 'handleSaveProduct' está creando un objeto JSON ('finalPayload').
      // Debemos construir un FormData.

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("base_price", parseFloat(basePrice));
      formData.append("is_available", isAvailable);
      formData.append("image_url", finalImageUrl);
      
      // Los JSON deben ir como strings
      formData.append("category_info_json", JSON.stringify(category_info_json));
      formData.append("customization_details_json", JSON.stringify(customization_details_json));
      formData.append("ingredients_json", JSON.stringify(ingredients_json));

      // 💡 Importante: Si hay un archivo, tu backend debe manejar
      // 'image_file' Y 'image_url'. Si el backend SOLO acepta 'image_url',
      // esta lógica está bien. Pero si el backend espera el ARCHIVO,
      // debes cambiar 'productService' para que NO suba a ImgBB aquí,
      // sino que mande el 'imageFile' en el FormData.
      //
      // Asumiendo que el backend SÍ quiere 'image_url' (como está ahora):

      if (id) {
        updateMutation.mutate({
          productId: id,
          // 🛑 Aquí estaba el error. 'data' debe ser el FormData.
          data: formData, 
        });
      } else {
        // 🛑 Aquí estaba el error. Debe ser el FormData.
        createMutation.mutate(formData);
      }

    } catch (error) {
        console.error("Error en la subida a ImgBB o guardado:", error);
        let errorMsg = "Error al guardar el producto.";
        if (error.response && error.response.data && error.response.data.error) {
            errorMsg = `Error en ImgBB: ${error.response.data.error.message}`;
        } else if (error instanceof AxiosError) {
            errorMsg = error.response?.data?.detail || "Error de red";
        }
        showSnackbar({ type: "error", message: errorMsg });
    }
  };
  
  // --- Renderizado ---
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-brown-600">
        Productos
      </h1>
      <div className="flex flex-wrap items-center justify-between gap-4 mt-8 mb-6">
        <div className="relative w-full sm:w-2/5">
          <input
            type="text"
            placeholder="Buscar un producto..."
            className="w-full px-4 py-3 border border-brown-300 rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          <FilterDropdown
            options={filterOptions}
            onSelect={handleFilterSelect}
          />
          <button
            onClick={() => setIsNewModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-brown-300 text-white rounded-lg hover:bg-brown-400"
          >
            <FiPlus />
            <span>Añadir Producto</span>
          </button>
        </div>
      </div>

      <div className="space-y-4"> 
        {isLoading && page === 1 ? ( // 💡 Mostrar solo en la página 1
          <p className="p-4 text-center">Cargando productos...</p>
        ) : (
          products.map((product) => (
            <ProductRow
              key={product.product_id}
              product={product}
              onEdit={() => {
                setSelectedProduct(product);
                setIsEditModalOpen(true);
              }}
              onDelete={() => {
                setSelectedProduct(product);
                setIsDeleteModalOpen(true);
              }}
            />
          ))
        )}
        {!isLoading && products.length === 0 && (
          <p className="p-4 text-center text-gray-500 bg-white rounded-lg shadow-sm">
            No se encontraron productos.
          </p>
        )}
      </div>

      {/* 💡 --- RENDERIZADO DE PAGINACIÓN --- 💡 */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-between items-center mt-8 p-4 bg-white rounded-lg shadow-sm">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
            className="px-4 py-2 font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Anterior
          </button>
          
          <span className="text-sm font-medium text-gray-600">
            Página {page} de {totalPages}
          </span>
          
          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className="px-4 py-2 font-medium text-white bg-brown-300 rounded-lg hover:bg-brown-400 disabled:bg-brown-200 disabled:cursor-not-allowed"
          >
            Siguiente
          </button>
        </div>
      )}


      {/* Modales */}
      {isNewModalOpen && (
        <NewProductModal
          isOpen={isNewModalOpen}
          onClose={() => setIsNewModalOpen(false)}
          onSave={handleSaveProduct}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
      {isEditModalOpen && (
        <NewProductModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProduct(null);
          }}
          productData={selectedProduct}
          onSave={handleSaveProduct}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      )}
      {selectedProduct && isDeleteModalOpen && (
        <ConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedProduct(null);
          }}
          onConfirm={handleConfirmDelete}
          itemName={selectedProduct.name}
          isLoading={deleteMutation.isPending}
          title="Confirmar Eliminación"
          message="¿Estás seguro de que quieres eliminar este producto?"
        />
      )}
    </div>
  );
}