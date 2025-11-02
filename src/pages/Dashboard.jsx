import { useQuery } from "@tanstack/react-query";
import { DASHBOARD_SERVICE } from "../services/dashboardService";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import InfoCard from "../components/InfoCard";
import ProgressBar from "../components/ProgressBar";
import SalesChart from "../components/SalesChart";

const formatCurrency = (value) => {
  if (typeof value !== "number") value = 0;
  return `${value.toLocaleString("es-MX", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export default function Dashboard() {
  const { user } = useAuth();

  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: DASHBOARD_SERVICE.getStats,
  });

  const { data: popularProducts, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["popularProducts"],
    queryFn: () => DASHBOARD_SERVICE.getPopularProducts(5),
  });

  const { data: lowStockItems, isLoading: isLoadingStock } = useQuery({
    queryKey: ["lowStock"],
    queryFn: DASHBOARD_SERVICE.getLowStock,
  });

  const isLoading = isLoadingStats || isLoadingProducts || isLoadingStock;

  const salesToday = formatCurrency(statsData?.salesToday);
  const salesWeek = formatCurrency(statsData?.salesWeek);
  const salesMonth = formatCurrency(statsData?.salesMonth);
  const ordersToday = statsData?.ordersToday || 0;

  const salesChartData = statsData?.salesChart30D || [];

  const sales30DayTotal = salesChartData.reduce(
    (acc, item) => acc + item.total,
    0
  );
  const formattedSales30DayTotal = formatCurrency(sales30DayTotal);

  const topProduct = popularProducts?.[0]?.name || "N/A";
  const lowStockCount = lowStockItems?.length || 0;
  const popularProductList = popularProducts || [];

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 md:p-8">
        <h1 className="text-4xl font-bold text-gray-400">Cargando...</h1>
        <p className="text-gray-500 mt-1">Obteniendo estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-4xl font-bold text-brown-600">
        ¡Hola, {user?.name || "Admin"}!
      </h1>
      <p className="text-gray-500 mt-1">Rendimiento de Coffee Shop</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <StatCard title="Venta del día" value={salesToday} />
        <StatCard title="Venta de la semana" value={salesWeek} />
        <StatCard title="Venta del mes" value={salesMonth} />

        <InfoCard title="Lo más vendido" content={topProduct} />
        <InfoCard
          title="Stock bajo"
          content={`${lowStockCount} ingredientes`}
        />
        <InfoCard title="Pedidos Hoy" content={`${ordersToday} pedidos`} />

        <div className="bg-cream-100 p-6 rounded-2xl shadow-sm md:col-span-2 lg:col-span-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-800">Ventas</p>
              <p className="text-sm text-gray-500">Últimos 30 días</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-brown-600">
                {formattedSales30DayTotal}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <SalesChart data={salesChartData} />
          </div>
        </div>

        <div className="bg-cream-100 p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Productos Populares</h3>
          {popularProductList.map((product, index) => (
            <ProgressBar
              key={product.productId}
              label={product.name}
              percentage={
                100 - (index * 100) / (popularProductList.length || 1)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
