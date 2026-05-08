import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { SeverityDistribution } from "../../types";

const COLORS: Record<string, string> = {
  critical: "#de350b",
  major: "#ff5630",
  minor: "#ffab00",
  cosmetic: "#36b37e",
};

interface Props {
  data: SeverityDistribution;
}

export default function SeverityPieChart({ data }: Props) {
  const chartData = data.data.filter((d) => d.percentage > 0);

  return (
    <div className="card">
      <div className="card__title">{data.title}</div>
      {chartData.length === 0 ? (
        <p style={{ color: "#6b778c", fontSize: 13 }}>No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="percentage"
              nameKey="severity"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label={({ severity, percentage }) =>
                `${severity}: ${(percentage as number).toFixed(1)}%`
              }
              labelLine={false}
            >
              {chartData.map((entry) => (
                <Cell key={entry.severity} fill={COLORS[entry.severity] ?? "#0052cc"} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: number) => `${v.toFixed(1)}%`}
              contentStyle={{ fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
