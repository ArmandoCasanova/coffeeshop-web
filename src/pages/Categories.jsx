// src/pages/Categories.jsx
import { useState, useEffect, useRef } from "react";
import { FiPlus, FiFilter } from "react-icons/fi";
import useDebounce from "../hooks/categories/useDebounce";
import { useCategoriesQuery } from "../hooks/categories/useCategoriesQuery";
import { useCreateCategoryMutation } from "../hooks/categories/useCreateCategoryMutation";
import { useUpdateCategoryMutation } from "../hooks/categories/useUpdateCategoryMutation";
import { useDeleteCategoryMutation } from "../hooks/categories/useDeleteCategoryMutation";

import NewCategoryModal from "../components/NewCategoryModal";
import EditCategoryModal from "../components/EditCategoryModal";
import ConfirmationModal from "../components/ConfirmationModal";
import CategoryActionsDropdown from "../components/CategoryActionsDropdown";

export default function Categories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sort, setSort] = useState({ by: "id", direction: "none" });

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { data, isLoading, isError, error } =
    useCategoriesQuery(debouncedSearchTerm);

  const createMutation = useCreateCategoryMutation();
  const updateMutation = useUpdateCategoryMutation();
  const deleteMutation = useDeleteCategoryMutation();

  const [isNewCategoryModalOpen, setIsNewCategoryModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);

  const categories = Array.isArray(data) ? data : data?.categories || [];

  if (isError)
    return (
      <div className="p-6 text-red-600">
        Error al cargar categorías: {error?.message || "Error desconocido"}
      </div>
    );

  let processedCategories =
    activeFilter === "all"
      ? categories
      : categories.filter((cat) => cat.tag === activeFilter);

  if (sort.direction !== "none") {
    processedCategories = [...processedCategories].sort((a, b) => {
      let comparison = 0;
      if (sort.by === "id")
        comparison = Number(a.category_id) - Number(b.category_id);
      else if (sort.by === "name")
        comparison = a.name.localeCompare(b.name, "es", {
          sensitivity: "base",
        });
      return sort.direction === "asc" ? comparison : comparison * -1;
    });
  }

  const filteredCategories = processedCategories;

  const dropdownOptions = [
    {
      label: "Mostrar todo",
      value: "all",
      type: "filter",
      isActive: activeFilter === "all",
    },
    { label: "---", value: "separator_2", type: "separator" },
    {
      label: `Nombre (A-Z) ${
        sort.by === "name" && sort.direction === "asc" ? "✓" : ""
      }`,
      value: "name_asc",
      type: "sort",
      isActive: sort.by === "name" && sort.direction === "asc",
    },
    {
      label: `Nombre (Z-A) ${
        sort.by === "name" && sort.direction === "desc" ? "✓" : ""
      }`,
      value: "name_desc",
      type: "sort",
      isActive: sort.by === "name" && sort.direction === "desc",
    },
  ];

  const handleDropdownSelect = (option) => {
    if (option.type === "filter") {
      setActiveFilter(option.value);
      setSort({ by: "id", direction: "none" });
    } else if (option.type === "sort") {
      if (option.value === "name_asc") setSort({ by: "name", direction: "asc" });
      if (option.value === "name_desc")
        setSort({ by: "name", direction: "desc" });
    }
    setIsFilterOpen(false);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openEditModal = (categoryId) => {
    const category = categories.find((cat) => cat.category_id === categoryId);
    if (category) {
      setCategoryToEdit(category);
      setIsEditCategoryModalOpen(true);
    }
  };

  const openConfirmDeleteModal = (categoryId) => {
    setCategoryIdToDelete(categoryId);
    setIsConfirmationModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryIdToDelete) {
      deleteMutation.mutate(categoryIdToDelete);
      setIsConfirmationModalOpen(false);
      setCategoryIdToDelete(null);
    }
  };

  const BASE_API_URL = "http://localhost:8000";

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center md:text-left">
        Categorías
      </h1>

      {/* 🔹 Barra superior responsive */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8 mb-6">
        <input
          type="text"
          placeholder="Buscar una categoría..."
          className="w-full sm:w-1/2 lg:w-1/3 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex flex-wrap justify-end gap-3">
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="p-3 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors w-full sm:w-auto flex justify-center"
            >
              <FiFilter size={20} />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                <ul className="py-1">
                  {dropdownOptions.map((option) =>
                    option.type === "separator" ? (
                      <li
                        key={option.value}
                        className="border-t border-gray-200 my-1 mx-4"
                      />
                    ) : (
                      <li
                        key={option.value}
                        onClick={() => handleDropdownSelect(option)}
                        className={`px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer ${
                          option.isActive ? "bg-gray-100 font-semibold" : ""
                        }`}
                      >
                        {option.label}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsNewCategoryModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-brown-600 text-white font-semibold rounded-lg hover:bg-brown-700 transition-colors w-full sm:w-auto"
          >
            <FiPlus />
            <span>Añadir categoría</span>
          </button>
        </div>
      </div>

      {/* 🔹 Tabla / Cards Responsive */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-gray-500 text-center">
            Buscando categorías...
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="p-6 text-gray-500 text-center">
            No hay categorías que coincidan con la búsqueda.
          </div>
        ) : (
          <div className="overflow-x-auto">
            {/* Vista de tabla (desktop) */}
            <div className="hidden md:block">
              <div className="bg-gray-100 p-4 rounded-t-2xl">
                <div className="grid grid-cols-[1fr_2fr_3fr_1fr] gap-4">
                  <div className="font-bold text-gray-600 px-4">ID</div>
                  <div className="font-bold text-gray-600">Nombre</div>
                  <div className="font-bold text-gray-600">Descripción</div>
                  <div className="font-bold text-gray-600 text-center">
                    Acción
                  </div>
                </div>
              </div>

              {filteredCategories.map((category, index) => (
                <div
                  key={category.category_id}
                  className="grid grid-cols-[1fr_2fr_3fr_1fr] gap-4 items-center p-4 border-b border-gray-200"
                >
                  <div className="text-gray-700 font-medium px-4 break-all">
                    {category.category_id}
                  </div>
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        category.image_url
                          ? category.image_url.startsWith("http")
                            ? category.image_url // Si es URL de ImgBB, úsala directo
                            : `${BASE_API_URL}${category.image_url}` // Si es local, añade el prefijo
                          : "/placeholder.png"
                      }
                      alt={category.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <span className="font-medium text-gray-900">
                      {category.name}
                    </span>
                  </div>
                  <div className="text-gray-600">{category.description}</div>
                  <div className="text-center">
                    <CategoryActionsDropdown
                      categoryId={category.category_id}
                      onEdit={() => openEditModal(category.category_id)}
                      onDelete={() =>
                        openConfirmDeleteModal(category.category_id)
                      }
                      direction={
                        index === filteredCategories.length - 1 ? "up" : "down"
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Vista tipo tarjeta (móvil) */}
            <div className="md:hidden divide-y">
              {filteredCategories.map((category, index) => (
                <div
                  key={category.category_id}
                  className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center justify-between"
                >
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-gray-500 break-all">
                      <strong>ID:</strong> {category.category_id}
                    </p>
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          category.image_url
                            ? category.image_url.startsWith("http")
                              ? category.image_url // Si es URL de ImgBB, úsala directo
                              : `${BASE_API_URL}${category.image_url}` // Si es local, añade el prefijo
                            : "/placeholder.png"
                        }
                        alt={category.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900 text-base">
                          {category.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <CategoryActionsDropdown
                      categoryId={category.category_id}
                      onEdit={() => openEditModal(category.category_id)}
                      onDelete={() =>
                        openConfirmDeleteModal(category.category_id)
                      }
                      direction={
                        index === filteredCategories.length - 1 ? "up" : "down"
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modales */}
      <NewCategoryModal
        isOpen={isNewCategoryModalOpen}
        onClose={() => setIsNewCategoryModalOpen(false)}
      />
      <EditCategoryModal
        isOpen={isEditCategoryModalOpen}
        onClose={() => setIsEditCategoryModalOpen(false)}
        categoryToEdit={categoryToEdit}
      />
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar Categoría"
        message="¿Estás seguro de eliminar esta categoría? Esta acción no se puede deshacer."
      />
    </div>
  );
}