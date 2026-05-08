import { useEffect, useState, useCallback } from "react";
import { fetchMetrics, fetchFilteredMetric } from "../api";
import type { MetricsPayload, StoredUser, FilterState } from "../types";
import type { Section } from "./Sidebar";

import SeverityBarChart from "./charts/SeverityBarChart";
import SeverityPieChart from "./charts/SeverityPieChart";
import SeverityAreaChart from "./charts/SeverityAreaChart";
import ProjectSeverityChart from "./charts/ProjectSeverityChart";
import MonthlyUsageChart from "./charts/MonthlyUsageChart";
import AssistantUsageChart from "./charts/AssistantUsageChart";
import ReviewUsageChart from "./charts/ReviewUsageChart";
import { QualityLineChart, SeverityLineChart } from "./charts/QualityTrendChart";
import ProjectUserCountChart from "./charts/ProjectUserCountChart";
import ProjectUserTable from "./ProjectUserTable";
import FilterBar from "./FilterBar";

interface Props {
  user: StoredUser;
  section: Section;
}

/* Which filter keys each metric method accepts */
const METRIC_FILTER_SUPPORT: Record<string, { project_name?: true; month?: true }> = {
  issue_severity_distribution:         { project_name: true },
  issue_severity_pie_chart_data:       { project_name: true },
  issue_severity_area_chart_data:      { project_name: true },
  issue_severity_frequency_by_project: { month: true },
  assistant_usage_data:                { project_name: true, month: true },
  review_usage_data:                   { project_name: true, month: true },
  avg_code_quality:                    { project_name: true },
  avg_code_severity:                   { project_name: true },
};

async function applyFilters(
  user: StoredUser,
  base: MetricsPayload,
  filters: FilterState
): Promise<MetricsPayload> {
  const active: Record<string, string> = {};
  if (filters.project_name) active.project_name = filters.project_name;
  if (filters.month) active.month = filters.month;

  if (Object.keys(active).length === 0) return base;

  const jobs = Object.entries(METRIC_FILTER_SUPPORT)
    .map(async ([metricName, supported]) => {
      /* Only pass filter keys this metric actually accepts */
      const metricFilters: Record<string, string> = {};
      if (supported.project_name && active.project_name)
        metricFilters.project_name = active.project_name;
      if (supported.month && active.month)
        metricFilters.month = active.month;

      if (Object.keys(metricFilters).length === 0) return null;

      try {
        const res = await fetchFilteredMetric(user, metricName, metricFilters);
        const value = res.metrics[metricName as keyof MetricsPayload];
        return value === undefined ? null : ([metricName, value] as [string, unknown]);
      } catch {
        /* If a filtered fetch fails, fall back to the base value silently */
        return null;
      }
    });

  const results = await Promise.all(jobs);
  const overrides = Object.fromEntries(
    results.filter((r): r is [string, unknown] => r !== null)
  );

  return { ...base, ...overrides } as MetricsPayload;
}

function StatChips({ m }: Readonly<{ m: MetricsPayload }>) {
  const dist = m.issue_severity_distribution?.data ?? [];
  const get = (sev: string) => dist.find((d) => d.severity === sev)?.count ?? 0;
  const total = dist.reduce((s, d) => s + d.count, 0);

  const chips = [
    { label: "Total Issues", value: total, mod: "" },
    { label: "Critical", value: get("critical"), mod: "--critical" },
    { label: "Major",    value: get("major"),    mod: "--major" },
    { label: "Minor",    value: get("minor"),    mod: "--minor" },
    { label: "Cosmetic", value: get("cosmetic"), mod: "--cosmetic" },
  ];

  return (
    <div className="stat-row">
      {chips.map(({ label, value, mod }) => (
        <div className={mod ? `stat-chip stat-chip${mod}` : "stat-chip"} key={label}>
          <div className="stat-chip__label">{label}</div>
          <div className="stat-chip__value">{value.toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}

export default function Dashboard({ user, section }: Readonly<Props>) {
  const [baseMetrics, setBaseMetrics]       = useState<MetricsPayload | null>(null);
  const [displayMetrics, setDisplayMetrics] = useState<MetricsPayload | null>(null);
  const [loading, setLoading]               = useState(true);
  const [filterLoading, setFilterLoading]   = useState(false);
  const [error, setError]                   = useState("");
  const [filters, setFilters]               = useState<FilterState>({ project_name: "", month: "" });

  /* Extract project names from the base metrics for the dropdown */
  const projects = baseMetrics?.project_user_mapping?.map((p) => p.project_name) ?? [];

  /* Initial load — fetch all metrics without filters */
  useEffect(() => {
    setLoading(true);
    setError("");
    setFilters({ project_name: "", month: "" });
    fetchMetrics(user)
      .then((r) => {
        setBaseMetrics(r.metrics);
        setDisplayMetrics(r.metrics);
      })
      .catch((e) => setError(e instanceof Error ? e.message : String(e)))
      .finally(() => setLoading(false));
  }, [user]);

  /* Re-apply filters whenever filter state or base metrics change */
  const handleFilterChange = useCallback(
    async (next: FilterState) => {
      setFilters(next);
      if (!baseMetrics) return;
      setFilterLoading(true);
      try {
        const result = await applyFilters(user, baseMetrics, next);
        setDisplayMetrics(result);
      } finally {
        setFilterLoading(false);
      }
    },
    [user, baseMetrics]
  );

  if (loading) {
    return (
      <div className="state-center">
        <span className="spinner spinner--blue" style={{ width: 36, height: 36 }} />
        <div className="state-center__title">Loading metrics…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-center">
        <div className="state-center__title">Failed to load metrics</div>
        <div className="state-center__sub error-banner">{error}</div>
      </div>
    );
  }

  if (!displayMetrics) return null;

  const SECTION_META: Record<Section, { title: string; sub: string }> = {
    overview: {
      title: "Review Activity",
      sub: "How your team is using CodeGenie across all projects — issues found, AI features used, and quality trends.",
    },
    severity: {
      title: "Issue Severity",
      sub: "Issues detected by CodeGenie reviews — broken down by severity, trend over time, and distribution per project.",
    },
    usage: {
      title: "AI Feature Usage",
      sub: "Which CodeGenie AI capabilities your team relies on — code generation, unit tests, refactoring, and more.",
    },
    quality: {
      title: "Code Quality",
      sub: "Quality and severity scores measured by CodeGenie, month-over-month, showing the impact of consistent reviews.",
    },
    projects: {
      title: "Projects & Users",
      sub: "Who on your team is using CodeGenie and on which projects — adoption at a glance.",
    },
  };

  const meta = SECTION_META[section];

  return (
    <>
      <div className="page-header">
        <div className="page-header__breadcrumb">
          CodeGenie <span>/</span> Metrics <span>/</span> {meta.title}
        </div>
        <h1 className="page-header__title">{meta.title}</h1>
        <p className="page-header__subtitle">{meta.sub}</p>
      </div>

      <FilterBar
        projects={projects}
        value={filters}
        onChange={handleFilterChange}
        loading={filterLoading}
      />

      {section === "overview" && (
        <>
          <StatChips m={displayMetrics} />
          <div className="metrics-grid">
            {displayMetrics.issue_severity_distribution && (
              <SeverityBarChart data={displayMetrics.issue_severity_distribution} />
            )}
            {displayMetrics.issue_severity_pie_chart_data && (
              <SeverityPieChart data={displayMetrics.issue_severity_pie_chart_data} />
            )}
            {displayMetrics.monthly_usage && (
              <MonthlyUsageChart data={displayMetrics.monthly_usage} />
            )}
            {displayMetrics.avg_code_quality && (
              <QualityLineChart data={displayMetrics.avg_code_quality} />
            )}
          </div>
        </>
      )}

      {section === "severity" && (
        <>
          <StatChips m={displayMetrics} />
          <div className="metrics-grid">
            {displayMetrics.issue_severity_distribution && (
              <SeverityBarChart data={displayMetrics.issue_severity_distribution} />
            )}
            {displayMetrics.issue_severity_pie_chart_data && (
              <SeverityPieChart data={displayMetrics.issue_severity_pie_chart_data} />
            )}
            {displayMetrics.issue_severity_area_chart_data && (
              <SeverityAreaChart data={displayMetrics.issue_severity_area_chart_data} />
            )}
            {displayMetrics.issue_severity_frequency_by_project && (
              <ProjectSeverityChart data={displayMetrics.issue_severity_frequency_by_project} />
            )}
          </div>
        </>
      )}

      {section === "usage" && (
        <div className="metrics-grid">
          {displayMetrics.monthly_usage && (
            <MonthlyUsageChart data={displayMetrics.monthly_usage} />
          )}
          {displayMetrics.assistant_usage_data && (
            <AssistantUsageChart data={displayMetrics.assistant_usage_data} />
          )}
          {displayMetrics.review_usage_data && (
            <ReviewUsageChart data={displayMetrics.review_usage_data} />
          )}
          {displayMetrics.monthly_usage && !displayMetrics.review_usage_data && <div />}
        </div>
      )}

      {section === "quality" && (
        <div className="metrics-grid">
          {displayMetrics.avg_code_quality && (
            <QualityLineChart data={displayMetrics.avg_code_quality} />
          )}
          {displayMetrics.avg_code_severity && (
            <SeverityLineChart data={displayMetrics.avg_code_severity} />
          )}
        </div>
      )}

      {section === "projects" && (
        <>
          <div className="metrics-grid">
            {displayMetrics.project_user_count && (
              <ProjectUserCountChart data={displayMetrics.project_user_count} />
            )}
            <div />
          </div>
          {displayMetrics.project_user_mapping && (
            <ProjectUserTable data={displayMetrics.project_user_mapping} />
          )}
        </>
      )}
    </>
  );
}
