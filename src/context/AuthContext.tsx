import { createContext, useContext, useState, useEffect } from "react";

// 1. Crear el contexto
const AuthContext = createContext(null);

// 2. Crear el Proveedor (el componente que "envuelve" la app)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Al cargar, revisa si ya hay un usuario en localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("coffeeUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Función para iniciar sesión
  const login = (userData) => {
    // Guarda el token (si tu API lo devuelve por separado)
    if (userData.access_token) {
      localStorage.setItem("accessToken", userData.access_token);
    }
    // Guarda el usuario
    localStorage.setItem("coffeeUser", JSON.stringify(userData));
    setUser(userData);
  };

  // Función para cerrar sesión (¡la necesitarás!)
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("coffeeUser");
    setUser(null);
    // Redirige a /login. 'replace' evita que pueda volver con "atrás".
    window.location.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Crear un "hook" para usar el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};