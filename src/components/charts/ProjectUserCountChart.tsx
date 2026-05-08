import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ProjectUserCountData } from "../../types";

interface Props {
  data: ProjectUserCountData;
}

export default function ProjectUserCountChart({ data }: Props) {
  return (
    <div className="card">
      <div className="card__title">{data.title}</div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data.data} margin={{ top: 4, right: 16, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#dfe1e6" />
          <XAxis
            dataKey="project"
            tick={{ fontSize: 11, fill: "#6b778c" }}
            angle={-30}
            textAnchor="end"
          />
          <YAxis tick={{ fontSize: 12, fill: "#6b778c" }} allowDecimals={false} />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <Bar dataKey="count" name="Users" fill="#0052cc" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
