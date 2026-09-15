import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const MOCK_HEALTH = [
  { week: "Wk 1", healthy: 72, issues: 18 },
  { week: "Wk 2", healthy: 78, issues: 14 },
  { week: "Wk 3", healthy: 81, issues: 12 },
  { week: "Wk 4", healthy: 76, issues: 16 },
  { week: "Wk 5", healthy: 86, issues: 9 },
  { week: "Wk 6", healthy: 90, issues: 7 },
];

function DashboardChart() {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={MOCK_HEALTH} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
          <defs>
            <linearGradient id="healthyFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2f7238" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#2f7238" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e6f0e4" vertical={false} />
          <XAxis
            dataKey="week"
            tick={{ fill: "#78716c", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#78716c", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #cde0c8",
              fontSize: 13,
            }}
          />
          <Area
            type="monotone"
            dataKey="healthy"
            stroke="#2f7238"
            strokeWidth={2.2}
            fill="url(#healthyFill)"
            name="Healthy score"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default DashboardChart;
