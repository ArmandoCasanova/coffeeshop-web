import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const formattedLabel = format(new Date(label), "eeee dd 'de' MMMM", {
      locale: es,
    });
    const value = payload[0].value.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
    });

    return (
      <div className="p-3 bg-white/90 rounded-lg shadow-lg border border-brown-200">
        <p className="text-sm font-semibold text-gray-700 capitalize">
          {formattedLabel}
        </p>
        <p className="text-lg font-bold text-brown-600">{value}</p>
      </div>
    );
  }
  return null;
};

export default function SalesChart({ data }) {
  const chartData = data.map((item) => ({
    date: new Date(item.date).getTime(),
    total: item.total,
  }));

  if (!chartData || chartData.length === 0) {
    return (
      <div
        style={{ height: 250 }}
        className="flex items-center justify-center text-gray-500"
      >
        No hay suficientes datos para mostrar la gráfica.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart
        data={chartData}
        margin={{ top: 10, right: 30, left: -10, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#A17A5B" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#A17A5B" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          strokeOpacity={0.3}
        />

        <XAxis
          dataKey="date"
          stroke="#5D4037"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(timestamp) =>
            format(new Date(timestamp), "dd MMM", { locale: es })
          }
          type="number"
          scale="time"
          domain={["dataMin", "dataMax"]}
        />

        <YAxis
          dataKey="total"
          stroke="#5D4037"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value / 1000}k`}
        />

        <Tooltip content={<CustomTooltip />} />

        <Line
          type="monotone"
          dataKey="total"
          stroke="#A17A5B"
          strokeWidth={3}
          dot={{ r: 4, fill: "#A17A5B" }}
          activeDot={{ r: 6, fill: "#A17A5B" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
