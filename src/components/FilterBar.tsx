import { useState } from "react";
import type { FilterState } from "../types";

interface Props {
  projects: string[];
  value: FilterState;
  onChange: (f: FilterState) => void;
  loading?: boolean;
}

function formatMonth(ym: string): string {
  const [y, m] = ym.split("-");
  return new Date(Number(y), Number(m) - 1).toLocaleString("default", {
    month: "short", year: "numeric",
  });
}

const FUNNEL_ICON = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor"
    strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 3h14M4 8h8M7 13h2" />
  </svg>
);

const CHEVRON_DOWN = (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 4l4 4 4-4" />
  </svg>
);

const CHEVRON_UP = (
  <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 8l4-4 4 4" />
  </svg>
);

const X_ICON = (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M1 1l8 8M9 1L1 9" />
  </svg>
);

export default function FilterBar({ projects, value, onChange, loading = false }: Readonly<Props>) {
  const [open, setOpen] = useState(false);
  const isActive = value.project_name !== "" || value.month !== "";
  const activeCount = [value.project_name, value.month].filter(Boolean).length;

  function set(key: keyof FilterState, val: string) {
    onChange({ ...value, [key]: val });
  }

  function clear() {
    onChange({ project_name: "", month: "" });
    setOpen(false);
  }

  return (
    <div className={`filter-bar${isActive ? " filter-bar--active" : ""}`}>

      {/* ── Toggle row ─────────────────────────────────────────────── */}
      <div className="filter-bar__row">
        <button
          className={`filter-bar__toggle${open ? " filter-bar__toggle--open" : ""}`}
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="filter-panel"
        >
          {FUNNEL_ICON}
          <span>Filters</span>
          {isActive && (
            <span className="filter-bar__badge">{activeCount}</span>
          )}
          {open ? CHEVRON_UP : CHEVRON_DOWN}
        </button>

        {/* Active chips shown in the row (visible even when panel is closed) */}
        {isActive && (
          <div className="filter-bar__chips">
            {value.project_name && (
              <span className="filter-chip">
                <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <path d="M1 3h14M4 8h8M7 13h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>
                </svg>
                {value.project_name}
                <button
                  className="filter-chip__remove"
                  onClick={() => set("project_name", "")}
                  aria-label={`Remove project filter: ${value.project_name}`}
                >
                  {X_ICON}
                </button>
              </span>
            )}
            {value.month && (
              <span className="filter-chip">
                <svg width="10" height="10" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                  <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.8" fill="none"/>
                  <path d="M5 1v3M11 1v3M2 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
                </svg>
                {formatMonth(value.month)}
                <button
                  className="filter-chip__remove"
                  onClick={() => set("month", "")}
                  aria-label={`Remove month filter: ${value.month}`}
                >
                  {X_ICON}
                </button>
              </span>
            )}
          </div>
        )}

        <div className="filter-bar__row-right">
          {loading && (
            <span className="filter-bar__spinner" aria-label="Applying filters" title="Applying filters…" />
          )}
          {isActive && !loading && (
            <button className="filter-bar__clear-all" onClick={clear}>
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* ── Collapsible panel ──────────────────────────────────────── */}
      {open && (
        <fieldset className="filter-panel" id="filter-panel">
          <div className="filter-panel__grid">

            {/* Project */}
            <div className="filter-panel__field">
              <label className="filter-panel__label" htmlFor="fp-project">
                Project
              </label>
              <div className="filter-panel__select-wrap">
                <select
                  id="fp-project"
                  className="filter-panel__select"
                  value={value.project_name}
                  onChange={(e) => set("project_name", e.target.value)}
                >
                  <option value="">All projects</option>
                  {projects.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <span className="filter-panel__select-arrow" aria-hidden="true">
                  {CHEVRON_DOWN}
                </span>
              </div>
            </div>

            {/* Month */}
            <div className="filter-panel__field">
              <label className="filter-panel__label" htmlFor="fp-month">
                Month
              </label>
              <input
                id="fp-month"
                type="month"
                className="filter-panel__input"
                value={value.month}
                onChange={(e) => set("month", e.target.value)}
              />
            </div>

          </div>

          {/* Panel footer */}
          <div className="filter-panel__footer">
            <p className="filter-panel__hint">
              Project and month filters apply to charts that support them.
              Charts without filter support always show all-time data.
            </p>
            {isActive && (
              <button className="filter-panel__clear" onClick={clear} disabled={loading}>
                {X_ICON}
                Clear all filters
              </button>
            )}
          </div>
        </fieldset>
      )}
    </div>
  );
}
