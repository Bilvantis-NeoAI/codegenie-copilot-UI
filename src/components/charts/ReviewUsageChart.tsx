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
import type { ReviewUsageData } from "../../types";

const PALETTE = [
  "#de350b","#ff5630","#ff8b00","#ffab00",
  "#6554c0","#a78bfa","#2684ff","#4c9aff",
];

interface Props {
  data: ReviewUsageData;
}

export default function ReviewUsageChart({ data }: Readonly<Props>) {
  return (
    <div className="card">
      <div className="card__title">{data.title}</div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data.data}
          layout="vertical"
          margin={{ top: 4, right: 24, left: 130, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#dfe1e6" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: "#6b778c" }} />
          <YAxis
            type="category"
            dataKey="review_name"
            tick={{ fontSize: 11, fill: "#6b778c" }}
            width={130}
          />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <Bar dataKey="count" name="Reviews" radius={[0, 4, 4, 0]}>
            {data.data.map((entry, i) => (
              <Cell key={entry.review_name} fill={PALETTE[i % PALETTE.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
