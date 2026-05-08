import { useState, useEffect, useRef } from "react";
import { requestDeviceCode, pollForToken, fetchGithubUser, saveUser } from "../api";
import type { StoredUser } from "../types";
import GenieLogo from "./GenieLogo";

interface Props {
  onLogin: (user: StoredUser) => void;
}

type Phase = "idle" | "waiting" | "polling" | "error";

const GITHUB_ICON = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.09-.744.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.382 1.235-3.222-.123-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.29-1.552 3.297-1.23 3.297-1.23.653 1.653.241 2.873.118 3.176.77.84 1.234 1.912 1.234 3.222 0 4.61-2.807 5.625-5.48 5.92.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const FEATURES = [
  {
    title: "Issue Severity Analytics",
    desc: "Track critical, major, minor and cosmetic issues across every review cycle with distribution and trend charts.",
  },
  {
    title: "AI Assistant Usage Metrics",
    desc: "Monitor which assistant features your team uses most — code generation, unit tests, refactoring and more.",
  },
  {
    title: "Code Quality Trends",
    desc: "Visualise average code quality and severity scores month-over-month to measure continuous improvement.",
  },
  {
    title: "Project and User Mapping",
    desc: "See which engineers are active on which projects and how review activity is distributed across the team.",
  },
];

export default function LoginPage({ onLogin }: Props) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [userCode, setUserCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const deviceCodeRef = useRef("");
  const intervalRef = useRef(5);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  async function startDeviceFlow() {
    setPhase("waiting");
    setErrorMsg("");
    setCopied(false);
    try {
      const dc = await requestDeviceCode();
      if (!dc.device_code) {
        throw new Error(dc.error_description ?? "Failed to get device code. Check that GITHUB_COPILOT_CLIENT_ID is set in .env.");
      }
      const code = dc.device_code;
      const ucode = dc.user_code ?? "";
      deviceCodeRef.current = code;
      intervalRef.current = dc.interval ?? 5;
      setUserCode(ucode);
      setPhase("polling");

      // Auto-open the verification URL and copy the code
      window.open(dc.verification_uri ?? "", "_blank", "noopener,noreferrer");
      try {
        await navigator.clipboard.writeText(ucode);
        setCopied(true);
      } catch {
        /* clipboard blocked — user can copy manually */
      }

      startPolling(code, dc.interval ?? 5);
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : String(e));
      setPhase("error");
    }
  }

  function startPolling(code: string, interval: number) {
    pollRef.current = setInterval(async () => {
      try {
        const tok = await pollForToken(code);
        if (tok.error === "authorization_pending") return;
        if (tok.error === "slow_down") {
          intervalRef.current += 5;
          clearInterval(pollRef.current!);
          startPolling(code, intervalRef.current);
          return;
        }
        if (tok.error) {
          clearInterval(pollRef.current!);
          setErrorMsg(tok.error_description ?? tok.error ?? "Authorisation failed.");
          setPhase("error");
          return;
        }
        if (tok.access_token) {
          clearInterval(pollRef.current!);
          const gh = await fetchGithubUser(tok.access_token);
          const user: StoredUser = {
            id: gh.id,
            login: gh.login,
            name: gh.name ?? gh.login,
            email: gh.email ?? "",
            avatar_url: gh.avatar_url,
            access_token: tok.access_token,
          };
          saveUser(user);
          onLogin(user);
        }
      } catch (e) {
        clearInterval(pollRef.current!);
        setErrorMsg(e instanceof Error ? e.message : String(e));
        setPhase("error");
      }
    }, interval * 1000);
  }

  return (
    <div className="lp-root">
      {/* ── Left: hero / product description ────────────────────────────── */}
      <div className="lp-hero">
        <div className="lp-hero__inner">
          <div className="lp-brand">
            <div className="lp-brand__icon">
              <GenieLogo size={28} color="#ffffff" />
            </div>
            <span className="lp-brand__name">CodeGenie</span>
          </div>

          <div className="lp-hero__copy">
            <h1 className="lp-hero__headline">
              Code review intelligence,<br />
              <span className="lp-hero__headline--accent">built for your team.</span>
            </h1>
            <p className="lp-hero__lead">
              CodeGenie connects to your VS Code extension and surfaces actionable
              metrics on code quality, issue severity, and AI assistant adoption —
              all in one place.
            </p>
          </div>

          <ul className="lp-features">
            {FEATURES.map((f) => (
              <li key={f.title} className="lp-feature">
                <div className="lp-feature__bar" />
                <div>
                  <div className="lp-feature__title">{f.title}</div>
                  <div className="lp-feature__desc">{f.desc}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Right: sign-in card ─────────────────────────────────────────── */}
      <div className="lp-panel">
        <div className="lp-card">
          <div className="lp-card__logo">
            <GenieLogo size={40} color="#0052cc" />
          </div>
          <h2 className="lp-card__title">Sign in to CodeGenie</h2>
          <p className="lp-card__sub">
            Use your GitHub account to access your team&rsquo;s metrics dashboard.
          </p>

          {/* Idle */}
          {phase === "idle" && (
            <button className="lp-btn-gh" onClick={startDeviceFlow}>
              {GITHUB_ICON}
              Continue with GitHub
            </button>
          )}

          {/* Requesting device code */}
          {phase === "waiting" && (
            <button className="lp-btn-gh" disabled>
              <span className="lp-spinner" />
              Requesting authorisation&hellip;
            </button>
          )}

          {/* Polling */}
          {phase === "polling" && (
            <>
              <button className="lp-btn-gh" disabled>
                <span className="lp-spinner" />
                Waiting for you to authorise&hellip;
              </button>

              <div className="lp-otp-box">
                <p className="lp-otp-box__step">
                  GitHub has opened in a new tab. Paste this code to complete sign-in:
                </p>
                <div className="lp-otp-code">{userCode}</div>
                <p className="lp-otp-box__hint">
                  {copied
                    ? "Code copied to clipboard — just press Ctrl V (or Cmd V) in the GitHub tab."
                    : "Copy the code above and paste it in the GitHub tab."}
                </p>
              </div>
            </>
          )}

          {/* Error */}
          {phase === "error" && (
            <>
              <button className="lp-btn-gh" onClick={startDeviceFlow}>
                {GITHUB_ICON}
                Try again
              </button>
              <div className="lp-error">{errorMsg}</div>
            </>
          )}

          <p className="lp-card__footer">
            By signing in you agree to GitHub&rsquo;s Terms of Service. CodeGenie
            only reads your public profile and email address.
          </p>
        </div>
      </div>
    </div>
  );
}
