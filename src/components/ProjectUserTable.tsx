import type { ProjectUserMapping } from "../types";

interface Props {
  data: ProjectUserMapping[];
}

export default function ProjectUserTable({ data }: Props) {
  if (!data || data.length === 0) {
    return (
      <div className="card">
        <div className="card__title">Project — User Mapping</div>
        <p style={{ color: "#6b778c", fontSize: 13 }}>No project data available.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ overflowX: "auto" }}>
      <div className="card__title">Project — User Mapping</div>
      <table className="cf-table">
        <thead>
          <tr>
            <th>Project</th>
            <th># Users</th>
            <th>Users</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.project_name}>
              <td style={{ fontWeight: 600, color: "#0052cc", whiteSpace: "nowrap" }}>
                {row.project_name}
              </td>
              <td style={{ textAlign: "center", fontWeight: 700, color: "#172b4d" }}>
                {row.users.length}
              </td>
              <td>
                {row.users.map((u) => (
                  <span className="badge" key={u.user_id}>
                    {u.full_name || u.username || `#${u.user_id}`}
                  </span>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
