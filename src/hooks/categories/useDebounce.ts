// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

// Define el tipo genérico T para que funcione con cualquier tipo de valor
export default function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Configura el temporizador
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpia el temporizador si el valor cambia (el Debouncing)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); 

  return debouncedValue;
}