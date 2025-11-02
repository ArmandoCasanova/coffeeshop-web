import { NavLink, useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import DashboardIcon from "../assets/icons/dashboard.svg";
import CategoriesIcon from "../assets/icons/categories.svg";
import PromotionsIcon from "../assets/icons/promotions.svg";
import InventoryIcon from "../assets/icons/inventory.svg";
import SettingsIcon from "../assets/icons/settings.svg";
import PersonIcon from "../assets/icons/person.svg";
import OrdersIcon from "../assets/icons/orders.svg";
import ReportsIcon from "../assets/icons/reports.svg";
import LogoIcon from "../assets/icons/logo.png";
import CoffeeFooterImg from "../assets/images/coffee-login.svg";
import { useAuth } from "../context/AuthContext";

const categoryItems = [
  { label: "Productos", to: "/products", icon: InventoryIcon },
  { label: "Promociones", to: "/promotions", icon: PromotionsIcon },
  { label: "Categorías", to: "/categories", icon: CategoriesIcon },
  { label: "Ajustes", to: "/settings", icon: SettingsIcon },
];

const mainMenu = [
  { label: "Dashboard", to: "/dashboard", icon: DashboardIcon },
  { label: "Ordenes", to: "/orders", icon: OrdersIcon },
  { label: "Clientes", to: "/clients", icon: PersonIcon },
  { label: "Reportes", to: "/reports", icon: ReportsIcon },
];

export default function Sidebar({ isOpen }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const userName = user ? `${user.name} ${user.lastName}` : "Usuario";

  const userRole = user
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
    : "Staff";

  return (
    <aside
      className={`w-64 min-h-screen p-6 flex flex-col bg-cream-100 
      transition-transform duration-300 ease-in-out z-30
      absolute inset-y-0 left-0 transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }
      md:relative md:translate-x-0`}
    >
      <div>
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 flex items-center justify-center mb-3">
            <img src={LogoIcon} alt="Logo" className="w-12 h-12" />
          </div>
          <div className="text-lg font-bold text-center text-brown-800">
            {userName}
          </div>
          <div className="text-sm text-center text-gray-unselected">
            {userRole}
          </div>
        </div>

        <div className="mb-8">
          <nav className="flex flex-col gap-1">
            {categoryItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-full font-medium transition-colors ${
                    isActive
                      ? "bg-brown-300 text-white"
                      : "bg-transparent text-gray-unselected"
                  }`
                }
              >
                <img src={item.icon} alt={item.label} className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="text-xs uppercase font-bold mb-3 tracking-wider px-4 text-gray-unselected">
            MAIN MENU
          </h3>
          <nav className="flex flex-col gap-1">
            {mainMenu.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-full font-medium transition-colors ${
                    isActive
                      ? "bg-brown-300 text-white"
                      : "bg-transparent text-gray-unselected"
                  }`
                }
              >
                <img src={item.icon} alt={item.label} className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-12">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-full font-medium transition-colors bg-transparent text-gray-unselected hover:bg-red-100 hover:text-red-700"
        >
          <FiLogOut className="w-4 h-4" />
          <span>Cerrar sesión</span>
        </button>
      </div>

      <div className="mt-auto pt-6">
        <img
          src={CoffeeFooterImg}
          alt="Café decorativo"
          className="w-full h-auto opacity-80"
        />
      </div>
    </aside>
  );
}
