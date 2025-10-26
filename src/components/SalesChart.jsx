import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const salesData = [
  { name: "Sem 1", ventas: 2200 },
  { name: "Sem 2", ventas: 3100 },
  { name: "Sem 3", ventas: 1900 },
  { name: "Sem 4", ventas: 4100 },
  { name: "Sem 5", ventas: 3200 },
  { name: "Sem 6", ventas: 5200 },
  { name: "Sem 7", ventas: 6150 },
];

export default function SalesChart() {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart
        data={salesData}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#A17A5B" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#A17A5B" stopOpacity={0} />
          </linearGradient>
        </defs>

        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />

        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value / 1000}k`}
        />

        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          strokeOpacity={0.3}
        />

        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            border: "1px solid #cccccc",
          }}
          formatter={(value) => [`$${value.toLocaleString()}`, "Ventas"]}
        />

        <Area
          type="monotone"
          dataKey="ventas"
          stroke="#A17A5B"
          strokeWidth={2}
          fillOpacity={1}
          fill="url(#colorVentas)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
