import StatCard from "../components/StatCard";
import InfoCard from "../components/InfoCard";
import ProgressBar from "../components/ProgressBar";
import SalesChart from "../components/SalesChart";

export default function Dashboard() {
  const popularProducts = [
    { name: "Caramel Frappuccino", percentage: 90 },
    { name: "Espresso", percentage: 70 },
    { name: "Iced Coffee", percentage: 60 },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h1 className="text-4xl font-bold text-brown-600">Dashboard</h1>
      <p className="text-gray-500 mt-1">Rendimiento de Coffee Shop</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <StatCard title="Venta del día" value="2,526" change="12" />
        <StatCard title="Venta de la semana" value="13,325" change="8" />
        <StatCard title="Venta del mes" value="41,569" change="15" />

        <InfoCard title="Lo más vendido" content="Caramel Frappuccino" />
        <InfoCard title="Stock bajo" content="15 ingredientes" />
        <InfoCard title="Stock bajo" content="15 ingredientes" />

        <div className="bg-cream-100 p-6 rounded-2xl shadow-sm md:col-span-2 lg:col-span-2">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-bold text-gray-800">Ventas</p>
              <p className="text-sm text-gray-500">Últimos 30 días</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-brown-600">$41,569</p>
              <p className="text-sm text-green-500 font-semibold">+15%</p>
            </div>
          </div>
          <div className="mt-4">
            <SalesChart />
          </div>
        </div>

        <div className="bg-cream-100 p-6 rounded-2xl shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Productos Populares</h3>
          {popularProducts.map((product) => (
            <ProgressBar
              key={product.name}
              label={product.name}
              percentage={product.percentage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
