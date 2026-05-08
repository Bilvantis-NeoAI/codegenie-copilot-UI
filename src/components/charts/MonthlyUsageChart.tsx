import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { MonthlyUsageData } from "../../types";

interface Props {
  data: MonthlyUsageData;
}

export default function MonthlyUsageChart({ data }: Props) {
  // Merge review + assistant into one array keyed by month
  const reviewMap = new Map((data.data[0]?.review ?? []).map((r) => [r.month, r.count]));
  const assistantMap = new Map((data.data[1]?.assistant ?? []).map((a) => [a.month, a.count]));
  const months = Array.from(new Set([...reviewMap.keys(), ...assistantMap.keys()])).sort();

  const merged = months.map((m) => ({
    month: m,
    review: reviewMap.get(m) ?? 0,
    assistant: assistantMap.get(m) ?? 0,
  }));

  return (
    <div className="card">
      <div className="card__title">{data.title}</div>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={merged} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dfe1e6" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#6b778c" }} />
          <YAxis tick={{ fontSize: 12, fill: "#6b778c" }} />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="review"    name="Reviews"   fill="#0052cc" stackId="a" />
          <Bar dataKey="assistant" name="Assistant" fill="#0065ff" stackId="a" radius={[3, 3, 0, 0]} />
          <Line
            type="monotone"
            dataKey="review"
            name="Review trend"
            stroke="#de350b"
            strokeWidth={2}
            dot={false}
            strokeDasharray="4 4"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
