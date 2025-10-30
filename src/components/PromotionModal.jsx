import React, { useState, useEffect } from "react";


const RadioInput = ({ id, name, value, label, checked, onChange }) => (
  <label htmlFor={id} className="flex items-center gap-2 cursor-pointer">
    <input
      type="radio"
      id={id}
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
      className="form-radio text-brown-500 focus:ring-brown-400"
    />
    <span className="text-gray-700 text-sm sm:text-base">{label}</span>
  </label>
);

const TabButton = ({ label, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-md flex-1 sm:flex-none ${
      active
        ? "bg-brown-100 text-brown-700"
        : "text-gray-500 hover:bg-gray-100"
    } transition-colors duration-200`}
  >
    {label}
  </button>
);

const ProductList = ({ products, selectedProducts, onProductToggle, error }) => (
  <div className="mt-2">
    <div className={`max-h-48 overflow-y-auto border rounded-lg ${
      error ? "border-red-300 bg-red-50" : "border-gray-300"
    }`}>
      {products.length === 0 ? (
        <p className="text-gray-500 text-sm p-3 text-center">No hay productos disponibles</p>
      ) : (
        products.map((product) => (
          <label key={product.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedProducts.includes(product.id)}
              onChange={() => onProductToggle(product.id)}
              className="form-checkbox text-brown-500 focus:ring-brown-400"
            />
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-gray-700 block truncate">{product.name}</span>
              <span className="text-xs text-gray-500">${product.price}</span>
            </div>
          </label>
        ))
      )}
    </div>
    {error && (
      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        {error}
      </p>
    )}
  </div>
);


export default function PromotionModal({ isOpen, onClose, promotionData }) {

  const isEditMode = Boolean(promotionData);

  const [promoName, setPromoName] = useState("");
  const [discountType, setDiscountType] = useState("Porcentaje");
  const [applyTo, setApplyTo] = useState("all");
  const [discountValue, setDiscountValue] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [products] = useState([
    { id: 1, name: "Café Americano", price: 2.50, category: "Bebidas" },
    { id: 2, name: "Café Latte", price: 3.00, category: "Bebidas" },
    { id: 3, name: "Capuchino", price: 3.25, category: "Bebidas" },
    { id: 4, name: "Croissant", price: 2.00, category: "Panadería" },
    { id: 5, name: "Sandwich de Pavo", price: 5.50, category: "Sandwiches" },
    { id: 6, name: "Té Verde", price: 2.25, category: "Bebidas" },
    { id: 7, name: "Muffin de Arándanos", price: 2.75, category: "Panadería" },
    { id: 8, name: "Bagel con Queso Crema", price: 3.50, category: "Panadería" },
  ]);

  const resetForm = () => {
    setPromoName("");
    setDiscountValue("");
    setSelectedProducts([]);
    setErrors({});
    setApplyTo("all");
    setDiscountType("Porcentaje");
    setStartDate("");
    setEndDate("");
  };

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && promotionData) {
        setPromoName(promotionData.name || "");
        setDiscountType(promotionData.discount_type || "porcentaje");
        setDiscountValue(String(promotionData.discount_value || ""));
        setApplyTo(promotionData.apply_to || "all");
        setSelectedProducts(promotionData.selected_products || []);
        setStartDate(promotionData.start_date || "");
        setEndDate(promotionData.end_date || "");
      } else {
        // Modo Creación: Asegurarse que esté reseteado (por si acaso)
        resetForm();
      }
    } else {
      resetForm();
    }
  }, [isOpen, promotionData, isEditMode]); 


  if (!isOpen) return null;

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  
  const validateForm = () => {
    const newErrors = {};

    if (!promoName.trim()) {
      newErrors.promoName = "El nombre es requerido";
    }

    if (applyTo === "product" && selectedProducts.length === 0) {
      newErrors.products = "Debe seleccionar al menos un producto";
    }

    if (!discountValue || parseFloat(discountValue) <= 0) {
      newErrors.discountValue = "El valor del descuento es requerido";
    } else if (discountType === "Porcentaje" && parseFloat(discountValue) > 100) {
      newErrors.discountValue = "El porcentaje no puede ser mayor a 100%";
    }

    if (!startDate) {
      newErrors.startDate = "La fecha de inicio es requerida";
    }
    if (!endDate) {
      newErrors.endDate = "La fecha de fin es requerida";
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate = "La fecha de fin no puede ser anterior a la de inicio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- MANEJO DEL ENVÍO ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }
    
    setIsSubmitting(true);

    try {
      const finalPromotionData = {
        // Añade el ID si estamos editando
        ...(isEditMode && { id: promotionData.id }),
        name: promoName,
        discountType,
        discountValue: parseFloat(discountValue),
        applyTo,
        selectedProducts: applyTo === "product" ? selectedProducts : [],
        startDate: startDate,
        endDate: endDate,
      };

      // Simular una llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (isEditMode) {
        console.log("Promoción actualizada:", finalPromotionData);
        // Aquí llamarías a tu función de API para actualizar
        // updatePromotion(finalPromotionData);
      } else {
        console.log("Promoción creada:", finalPromotionData);
        // Aquí llamarías a tu función de API para crear
        // createPromotion(finalPromotionData);
      }
      
      onClose(); // Cierra el modal al éxito
      // resetForm() se llamará automáticamente por el useEffect
    } catch (error) {
      console.error(`Error ${isEditMode ? 'actualizando' : 'creando'} promoción:`, error);
      // Opcional: setear un error general
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProductToggle = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
    
    if (errors.products && selectedProducts.length >= 0) {
      setErrors(prev => ({ ...prev, products: "" }));
    }
  };

  const handleSelectAllProducts = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map(product => product.id));
    }
    
    if (errors.products) {
      setErrors(prev => ({ ...prev, products: "" }));
    }
  };

  const handleApplyToChange = (value) => {
    setApplyTo(value);
    if (value !== "product" && errors.products) {
      setErrors(prev => ({ ...prev, products: "" }));
    }
  };

  const handleClose = () => {
    onClose();
  };


  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-filter backdrop-blur-sm "
    >
      <div
        onClick={handleModalContentClick}
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto"
      >
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            {isEditMode ? "Editar Promoción" : "Crear Nueva Promoción"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="promoName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nombre de la promoción
              </label>
              <input
                type="text"
                id="promoName"
                value={promoName}
                onChange={(e) => {
                  setPromoName(e.target.value);
                  if (errors.promoName) {
                    setErrors(prev => ({ ...prev, promoName: "" }));
                  }
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300 text-sm sm:text-base ${
                  errors.promoName ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Ej: Descuento de Verano"
              />
              {errors.promoName && (
                <p className="text-red-500 text-xs mt-1">{errors.promoName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Descuento
              </label>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <RadioInput
                  id="Porcentaje"
                  name="discountType"
                  value="Porcentaje"
                  label="Porcentaje (%)"
                  checked={discountType === "Porcentaje"}
                  onChange={(e) => setDiscountType(e.target.value)}
                />
                <RadioInput
                  id="Monto Fijo"
                  name="discountType"
                  value="Monto Fijo"
                  label="Monto Fijo ($)"
                  checked={discountType === "Monto Fijo"}
                  onChange={(e) => setDiscountType(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="discountValue"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {discountType === "Porcentaje" ? "Porcentaje de descuento" : "Monto de descuento"}
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="discountValue"
                  value={discountValue}
                  onChange={(e) => {
                    setDiscountValue(e.target.value);
                    if (errors.discountValue) {
                      setErrors(prev => ({ ...prev, discountValue: "" }));
                    }
                  }}
                  min="0"
                  max={discountType === "Porcentaje" ? "100" : ""}
                  step={discountType === "Porcentaje" ? "1" : "0.01"}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300 pr-10 text-sm sm:text-base ${
                    errors.discountValue ? "border-red-300 bg-red-50" : "border-gray-300"
                  }`}
                  placeholder={discountType === "Porcentaje" ? "0-100" : "0.00"}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  {discountType === "Porcentaje" ? "%" : "$"}
                </span>
              </div>
              {errors.discountValue && (
                <p className="text-red-500 text-xs mt-1">{errors.discountValue}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aplicar a
              </label>
              <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                <TabButton
                  label="Toda la carta"
                  active={applyTo === "all"}
                  onClick={() => handleApplyToChange("all")}
                />
                <TabButton
                  label="Categoría"
                  active={applyTo === "category"}
                  onClick={() => handleApplyToChange("category")}
                />
                <TabButton
                  label="Producto"
                  active={applyTo === "product"}
                  onClick={() => handleApplyToChange("product")}
                />
              </div>
            </div>

            {applyTo === "product" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Seleccionar Productos
                  </label>
                  {products.length > 0 && (
                    <button
                      type="button"
                      onClick={handleSelectAllProducts}
                      className="text-xs text-brown-600 hover:text-brown-700 font-medium self-start sm:self-auto"
                    >
                      {selectedProducts.length === products.length ? "Deseleccionar todos" : "Seleccionar todos"}
                    </button>
                  )}
                </div>
                <ProductList
                  products={products}
                  selectedProducts={selectedProducts}
                  onProductToggle={handleProductToggle}
                  error={errors.products}
                />
                {selectedProducts.length > 0 && !errors.products && (
                  <p className="text-xs text-gray-500 mt-2">
                    {selectedProducts.length} producto(s) seleccionado(s)
                  </p>
                )}
              </div>
            )}
            
            {applyTo === "category" && (
              <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 text-center">
                <p className="text-sm text-gray-500">La selección por categoría aún no está implementada.</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vigencia
              </label>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <label
                    htmlFor="startDate"
                    className="block text-xs text-gray-600 mb-1"
                  >
                    Fecha Inicio 
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (errors.startDate) {
                        setErrors(prev => ({ ...prev, startDate: "" }));
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300 text-sm sm:text-base ${
                      errors.startDate ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>
                  )}
                </div>
                <div className="flex-1">
                  <label
                    htmlFor="endDate"
                    className="block text-xs text-gray-600 mb-1"
                  >
                    Fecha Fin
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      if (errors.endDate) {
                        setErrors(prev => ({ ...prev, endDate: "" }));
                      }
                    }}
                    min={startDate}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300 text-sm sm:text-base ${
                      errors.endDate ? "border-red-300 bg-red-50" : "border-gray-300"
                    }`}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-5 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-brown-300 text-white font-semibold rounded-lg hover:bg-brown-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isEditMode ? "Guardando..." : "Creando..."}
                </>
              ) : (
                isEditMode ? "Guardar Cambios" : "Crear Promoción"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
