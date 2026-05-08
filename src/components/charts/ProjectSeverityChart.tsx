import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ProjectSeverityData } from "../../types";

interface Props {
  data: ProjectSeverityData;
}

export default function ProjectSeverityChart({ data }: Props) {
  return (
    <div className="card">
      <div className="card__title">{data.title}</div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data.data}
          layout="vertical"
          margin={{ top: 4, right: 24, left: 80, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#dfe1e6" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 11, fill: "#6b778c" }} />
          <YAxis
            type="category"
            dataKey="project"
            tick={{ fontSize: 11, fill: "#6b778c" }}
            width={80}
          />
          <Tooltip contentStyle={{ fontSize: 12 }} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="critical" name="Critical" fill="#de350b" stackId="a" />
          <Bar dataKey="major"    name="Major"    fill="#ff5630" stackId="a" />
          <Bar dataKey="minor"    name="Minor"    fill="#ffab00" stackId="a" />
          <Bar dataKey="cosmetic" name="Cosmetic" fill="#36b37e" stackId="a" radius={[0, 3, 3, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
