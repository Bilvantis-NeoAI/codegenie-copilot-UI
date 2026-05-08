import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { SeverityAreaData } from "../../types";

const SERIES = [
  { key: "critical", color: "#de350b" },
  { key: "major",    color: "#ff5630" },
  { key: "minor",    color: "#ffab00" },
  { key: "cosmetic", color: "#36b37e" },
] as const;

interface Props {
  data: SeverityAreaData;
}

export default function SeverityAreaChart({ data }: Props) {
  return (
    <div className="card">
      <div className="card__title">{data.title} — Last 14 Days</div>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data.data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
          <defs>
            {SERIES.map(({ key, color }) => (
              <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#dfe1e6" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#6b778c" }} />
          <YAxis tick={{ fontSize: 12, fill: "#6b778c" }} />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          {SERIES.map(({ key, color }) => (
            <Area
              key={key}
              type="monotone"
              dataKey={key}
              name={key.charAt(0).toUpperCase() + key.slice(1)}
              stroke={color}
              strokeWidth={2}
              fill={`url(#grad-${key})`}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
