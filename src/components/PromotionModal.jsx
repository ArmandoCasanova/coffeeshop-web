import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";

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

const toISOStart = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr + "T00:00:00Z").toISOString();
};

const toISOEnd = (dateStr) => {
  if (!dateStr) return null;
  return new Date(dateStr + "T23:59:59Z").toISOString();
};

const fromISO = (isoString) => {
  if (!isoString) return "";
  try {
    return isoString.split("T")[0];
  } catch (e) {
    return e;
  }
};

export default function PromotionModal({
  isOpen,
  onClose,
  onSave, 
  isSaving,
  promotionData,
}) {
  const isEditMode = Boolean(promotionData);

  const [code, setCode] = useState(""); 
  const [discountType, setDiscountType] = useState("Porcentaje"); 
  const [discountValue, setDiscountValue] = useState("");
  const [startDate, setStartDate] = useState(""); 
  const [endDate, setEndDate] = useState(""); 

  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setCode(""); 
    setDiscountType("Porcentaje");
    setDiscountValue("");
    setStartDate("");
    setEndDate("");
    setErrors({});
  };

  useEffect(() => {
    if (isOpen) {
      if (isEditMode && promotionData) {
        setCode(promotionData.code || ""); 
        setDiscountType(
          promotionData.discountType === "percentage"
            ? "Porcentaje"
            : "Monto Fijo"
        );
        setDiscountValue(String(promotionData.discount_value || ""));
        
        setStartDate(fromISO(promotionData.startDate));
        setEndDate(fromISO(promotionData.endDate));
      } else {
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

    if (!code.trim()) {
      newErrors.code = "El código es requerido"; 
    }
    if (!discountValue || parseFloat(discountValue) <= 0) {
      newErrors.discountValue = "El valor del descuento es requerido";
    } else if (
      discountType === "Porcentaje" &&
      parseFloat(discountValue) > 100
    ) {
      newErrors.discountValue = "El porcentaje no puede ser mayor a 100%";
    }
    if (!startDate) {
      newErrors.startDate = "La fecha de inicio es requerida";
    }
    if (!endDate) {
      newErrors.endDate = "La fecha de fin es requerida";
    }
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.endDate =
        "La fecha de fin no puede ser anterior a la de inicio";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const finalPromotionData = {
      code, 
      discount_type:
        discountType === "Porcentaje" ? "percentage" : "fixed_amount",
      discount_value: parseFloat(discountValue),
      start_date: toISOStart(startDate),
      end_date: toISOEnd(endDate),
    };

    onSave(finalPromotionData);
  };

  const handleClose = () => {
    resetForm(); 
    onClose();
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-filter lg bg-black/30"
    >
      <div
        onClick={handleModalContentClick}
        className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            {isEditMode ? "Editar Promoción" : "Crear Nueva Promoción"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label
                htmlFor="promoCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Código de la promoción
              </label>
              <input
                type="text"
                id="promoCode"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase()); 
                  if (errors.code) {
                    setErrors((prev) => ({ ...prev, code: "" }));
                  }
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300 text-sm sm:text-base ${
                  errors.code ? "border-red-300 bg-red-50" : "border-gray-300"
                }`}
                placeholder="Ej: VERANO20"
              />
              {errors.code && (
                <p className="text-red-500 text-xs mt-1">{errors.code}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Descuento
                </label>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-3">
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
                  {discountType === "Porcentaje"
                    ? "Porcentaje de descuento"
                    : "Monto de descuento"}
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="discountValue"
                    value={discountValue}
                    onChange={(e) => {
                      setDiscountValue(e.target.value);
                      if (errors.discountValue) {
                        setErrors((prev) => ({ ...prev, discountValue: "" }));
                      }
                    }}
                    min="0"
                    max={discountType === "Porcentaje" ? "100" : undefined}
                    step={discountType === "Porcentaje" ? "1" : "0.01"}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300 pr-10 text-sm sm:text-base ${
                      errors.discountValue
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder={
                      discountType === "Porcentaje" ? "0-100" : "0.00"
                    }
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {discountType === "Porcentaje" ? "%" : "$"}
                  </span>
                </div>
                {errors.discountValue && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.discountValue}
                  </p>
                )}
              </div>
            </div>
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
                        setErrors((prev) => ({ ...prev, startDate: "" }));
                      }
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300 text-sm sm:text-base ${
                      errors.startDate
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.startDate}
                    </p>
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
                        setErrors((prev) => ({ ...prev, endDate: "" }));
                      }
                    }}
                    min={startDate}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300 text-sm sm:text-base ${
                      errors.endDate
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSaving} 
              className="px-5 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving} 
              className="px-5 py-2 bg-brown-300 text-white font-semibold rounded-lg hover:bg-brown-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {isSaving ? ( 
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isEditMode ? "Guardando..." : "Creando..."}
                </>
              ) : isEditMode ? (
                "Guardar Cambios"
              ) : (
                "Crear Promoción"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}