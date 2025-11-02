import { FiUser, FiShield, FiBell, FiLogOut, FiCamera } from "react-icons/fi";

const ToggleSwitch = ({ label, enabled, setEnabled }) => {
  return (
    <button
      type="button"
      onClick={() => setEnabled(!enabled)}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brown-300 focus:ring-offset-2 ${
        enabled ? "bg-brown-300" : "bg-gray-200"
      }`}
    >
      <span className="sr-only">{label}</span>
      <span
        aria-hidden="true"
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          enabled ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
};

export default function Ajustes() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-brown-600 mb-8">
        Ajustes
      </h1>

      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
              <FiUser className="text-brown-400" />
              <span>Perfil de Usuario</span>
            </h2>
            <p className="text-gray-500 mt-1">
              Administra tu información personal.
            </p>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-grow">
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre Completo
                </label>
                <input
                  type="text"
                  id="fullName"
                  defaultValue="Nombre de Ejemplo"
                  className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                defaultValue="correo@ejemplo.com"
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300"
              />
            </div>
          </div>
          <div className="p-6 bg-gray-50 text-right">
            <button className="px-6 py-3 bg-brown-300 text-white font-semibold rounded-lg hover:bg-brown-400 transition-colors shadow-sm cursor-pointer">
              Guardar Cambios
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
              <FiShield className="text-brown-400" />
              <span>Seguridad</span>
            </h2>
            <p className="text-gray-500 mt-1">Actualiza tu contraseña.</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label
                htmlFor="current-password"
                className="block text-sm font-medium text-gray-700"
              >
                Contraseña Actual
              </label>
              <input
                type="password"
                id="current-password"
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300"
              />
            </div>
            <div>
              <label
                htmlFor="new-password"
                className="block text-sm font-medium text-gray-700"
              >
                Nueva Contraseña
              </label>
              <input
                type="password"
                id="new-password"
                className="mt-1 w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300"
              />
            </div>
          </div>
          <div className="p-6 bg-gray-50 text-right">
            <button className="px-6 py-3 bg-brown-300 text-white font-semibold rounded-lg hover:bg-brown-400 transition-colors shadow-sm cursor-pointer">
              Actualizar Contraseña
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <FiLogOut className="text-red-500" />
                <span>Cerrar Sesión</span>
              </h2>
              <p className="text-gray-500 mt-1">
                Cierra tu sesión en este dispositivo.
              </p>
            </div>
            <button className="mt-4 sm:mt-0 w-full sm:w-auto px-6 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-colors shadow-sm cursor-pointer">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
