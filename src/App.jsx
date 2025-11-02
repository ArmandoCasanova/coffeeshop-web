import { Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import Products from "./pages/Products";
import Promotions from "./pages/Promotions";
import Categories from "./pages/Categories";
import Settings from "./pages/Settings";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Clients from "./pages/Clients";
import Reports from "./pages/Reports";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="promotions" element={<Promotions />} />
        <Route path="categories" element={<Categories />} />
        <Route path="settings" element={<Settings />} />
        <Route path="orders" element={<Orders />} />
        <Route path="clients" element={<Clients />} />
        <Route path="reports" element={<Reports />} />
      </Route>
    </Routes>
  );
}
