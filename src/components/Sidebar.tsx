type Section = "overview" | "severity" | "usage" | "quality" | "projects";

interface Props {
  active: Section;
  onChange: (s: Section) => void;
}

const NAV: { id: Section; label: string; icon: React.ReactNode }[] = [
  {
    id: "overview",
    label: "Review Activity",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
        <rect x="1" y="9" width="4" height="6" rx="1" />
        <rect x="6" y="5" width="4" height="10" rx="1" />
        <rect x="11" y="1" width="4" height="14" rx="1" />
      </svg>
    ),
  },
  {
    id: "severity",
    label: "Severity",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 1L15 14H1L8 1Z" />
      </svg>
    ),
  },
  {
    id: "usage",
    label: "AI Feature Usage",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
        <path d="M1 13 L5 7 L9 10 L13 3 L15 3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "quality",
    label: "Code Quality",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
        <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M5 8.5l2 2 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "projects",
    label: "Projects & Users",
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
        <rect x="1" y="3" width="14" height="2" rx="1" />
        <rect x="1" y="7" width="10" height="2" rx="1" />
        <rect x="1" y="11" width="12" height="2" rx="1" />
      </svg>
    ),
  },
];

import React from "react";

export default function Sidebar({ active, onChange }: Props) {
  return (
    <nav className="sidebar">
      <span className="sidebar__section-label">CodeGenie Metrics</span>
      {NAV.map(({ id, label, icon }) => (
        <button
          key={id}
          type="button"
          className={`sidebar__item${active === id ? " active" : ""}`}
          onClick={() => onChange(id)}
        >
          <span className="sidebar__item-icon">{icon}</span>
          {label}
        </button>
      ))}
    </nav>
  );
}

export type { Section };
