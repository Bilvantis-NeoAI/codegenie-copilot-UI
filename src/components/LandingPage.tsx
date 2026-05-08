import GenieLogo from "./GenieLogo";

interface Props {
  onSignInClick: () => void;
}

const GITHUB_ICON = (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.744.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.382 1.235-3.222-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.241 2.873.118 3.176.77.84 1.234 1.912 1.234 3.222 0 4.61-2.807 5.625-5.48 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const FEATURES = [
  {
    title: "Issue Severity Analytics",
    desc: "Track critical, major, minor and cosmetic issues across every review cycle with distribution and trend charts.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2L2 19.5h20L12 2zm0 3.5l7.5 13H4.5L12 5.5zM11 10v4h2v-4h-2zm0 5v2h2v-2h-2z" />
      </svg>
    ),
  },
  {
    title: "AI Assistant Usage Metrics",
    desc: "Monitor which assistant features your team uses most — code generation, unit tests, refactoring and more.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16zm-1-5h2v2h-2v-2zm0-8h2v6h-2V7z" />
      </svg>
    ),
  },
  {
    title: "Code Quality Trends",
    desc: "Visualise average code quality and severity scores month-over-month to measure continuous improvement.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M3 17l5-5 4 4 5-6 4 4V20H3v-3zm0-10l5-5 4 4 5-6 4 4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Project and User Mapping",
    desc: "See which engineers are active on which projects and how review activity is distributed across the team.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <circle cx="9" cy="7" r="4" /><path d="M1 21v-2a7 7 0 0 1 14 0v2" /><circle cx="17" cy="9" r="3" /><path d="M23 21v-2a5 5 0 0 0-4-4.9" />
      </svg>
    ),
  },
];

export default function LandingPage({ onSignInClick }: Readonly<Props>) {
  return (
    <div className="lp-root">
      {/* ── Navbar ────────────────────────────────────────────────────────────── */}
      <nav className="lp-nav">
        <span className="lp-nav__brand" aria-label="CodeGenie">
          <div className="lp-nav__brand-icon">
            <GenieLogo size={20} color="#ffffff" />
          </div>
          <span className="lp-nav__brand-name">CodeGenie</span>
        </span>

        <div className="lp-nav__spacer" />

        <button className="lp-nav__signin" onClick={onSignInClick}>
          {GITHUB_ICON}
          Sign in with GitHub
        </button>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero__logo">
          <GenieLogo size={120} color="#4c9aff" />
        </div>

        <h1 className="lp-hero__headline">
          Code review intelligence,<br />
          <span className="lp-hero__headline-grad">built for your team.</span>
        </h1>

        <p className="lp-hero__sub">
          CodeGenie connects to your VS Code extension and surfaces actionable
          metrics on code quality, issue severity, and AI assistant adoption —
          all in one place.
        </p>

        <button className="lp-hero__cta" onClick={onSignInClick}>
          {GITHUB_ICON}
          Get started with GitHub
        </button>

        <div className="lp-hero__scroll-hint" aria-hidden="true">
          Explore features
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────────── */}
      <section className="lp-features">
        <h2 className="lp-features__heading">Everything your team needs</h2>
        <p className="lp-features__sub">
          One dashboard to track code quality, review patterns, and AI adoption across all projects.
        </p>

        <div className="lp-features__grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="lp-feature-card">
              <div className="lp-feature-card__icon" aria-hidden="true">
                {f.icon}
              </div>
              <div className="lp-feature-card__title">{f.title}</div>
              <div className="lp-feature-card__desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
