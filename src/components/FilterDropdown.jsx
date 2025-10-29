// src/components/FilterDropdown.jsx
import { useState, useRef, useEffect } from "react";
import { FiFilter } from "react-icons/fi";

export default function FilterDropdown({ options, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleSelect = (option) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 border border-gray-300 rounded-lg hover:ring-2 hover:ring-brown-300 transition-all"
      >
        <FiFilter className="text-gray-700" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10 py-1">
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option)}
              className="w-full text-left block px-4 py-2 text-gray-800 hover:bg-gray-100"
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
