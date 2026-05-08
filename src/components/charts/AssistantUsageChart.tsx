import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { AssistantUsageData } from "../../types";

const PALETTE = [
  "#2684ff","#6554c0","#00875a","#ff8b00","#de350b",
  "#4c9aff","#a78bfa","#57d9a3","#ffab00","#ff5630",
];

interface Props {
  data: AssistantUsageData;
}

export default function AssistantUsageChart({ data }: Readonly<Props>) {
  return (
    <div className="card">
      <div className="card__title">{data.title}</div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data.data}
          layout="vertical"
          margin={{ top: 4, right: 24, left: 120, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#dfe1e6" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: "#6b778c" }} />
          <YAxis
            type="category"
            dataKey="assistant_name"
            tick={{ fontSize: 11, fill: "#6b778c" }}
            width={120}
          />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <Bar dataKey="count" name="Uses" radius={[0, 4, 4, 0]}>
            {data.data.map((entry, i) => (
              <Cell key={entry.assistant_name} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
