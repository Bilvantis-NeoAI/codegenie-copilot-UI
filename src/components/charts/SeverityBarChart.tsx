import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
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

export default function SeverityBarChart({ data }: Props) {
  return (
    <div className="card">
      <div className="card__title">{data.title}</div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data.data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dfe1e6" />
          <XAxis dataKey="severity" tick={{ fontSize: 12, fill: "#6b778c" }} />
          <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "#6b778c" }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "#6b778c" }} unit="%" />
          <Tooltip
            formatter={(v: number, name: string) =>
              name === "percentage" ? `${v}%` : v
            }
            contentStyle={{ fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar yAxisId="left" dataKey="count" name="Count" radius={[3, 3, 0, 0]}>
            {data.data.map((entry) => (
              <Cell key={entry.severity} fill={COLORS[entry.severity] ?? "#0052cc"} />
            ))}
          </Bar>
          <Bar
            yAxisId="right"
            dataKey="percentage"
            name="Percentage"
            fill="#0052cc"
            fillOpacity={0.25}
            radius={[3, 3, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
