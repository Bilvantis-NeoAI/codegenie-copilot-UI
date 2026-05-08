import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { AvgQualityData, AvgSeverityData } from "../../types";

const QUALITY_LABELS: Record<number, string> = { 1: "Poor", 2: "Average", 3: "Good", 4: "Excellent" };

interface QualityProps { data: AvgQualityData; }
interface SeverityProps { data: AvgSeverityData; }

export function QualityLineChart({ data }: QualityProps) {
  return (
    <div className="card">
      <div className="card__title">{data.title}</div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data.data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dfe1e6" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b778c" }} />
          <YAxis
            domain={[1, 4]}
            ticks={[1, 2, 3, 4]}
            tickFormatter={(v: number) => QUALITY_LABELS[v] ?? v}
            tick={{ fontSize: 11, fill: "#6b778c" }}
            width={68}
          />
          <Tooltip
            formatter={(v: number) => [`${v.toFixed(2)} (${QUALITY_LABELS[Math.round(v)] ?? ""})`, "Avg Quality"]}
            contentStyle={{ fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <ReferenceLine y={3} stroke="#36b37e" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="average_quality"
            name="Avg Quality"
            stroke="#0052cc"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#0052cc" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SeverityLineChart({ data }: SeverityProps) {
  return (
    <div className="card">
      <div className="card__title">{data.title}</div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data.data} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dfe1e6" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b778c" }} />
          <YAxis
            domain={[0, 3]}
            ticks={[0, 1, 2, 3]}
            tickFormatter={(v: number) =>
              ({ 0: "—", 0.5: "Cosm", 1: "Minor", 2: "Major", 3: "Critical" }[v] ?? String(v))
            }
            tick={{ fontSize: 11, fill: "#6b778c" }}
            width={56}
          />
          <Tooltip
            formatter={(v: number) => [`${v.toFixed(2)}`, "Avg Severity"]}
            contentStyle={{ fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <ReferenceLine y={2} stroke="#ff5630" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="average_severity"
            name="Avg Severity"
            stroke="#de350b"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#de350b" }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
