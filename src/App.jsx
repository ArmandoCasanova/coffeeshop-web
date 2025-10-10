import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Products from './pages/Products';
import Promotions from './pages/Promotions';
import Categories from './pages/Categories';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Clients from './pages/Clients';
import Reports from './pages/Reports';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/" element={<Home />}>
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
    </BrowserRouter>
  );
}
