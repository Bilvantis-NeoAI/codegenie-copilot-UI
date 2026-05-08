import type {
  DeviceCodeResponse,
  TokenResponse,
  GithubUser,
  MetricsResponse,
  StoredUser,
} from "./types";

// ── Auth helpers ─────────────────────────────────────────────────────────────

export async function requestDeviceCode(): Promise<DeviceCodeResponse> {
  const res = await fetch("/auth/device", { method: "POST" });
  if (!res.ok) throw new Error(`Device code request failed: ${res.status}`);
  return res.json();
}

export async function pollForToken(deviceCode: string): Promise<TokenResponse> {
  const res = await fetch(`/auth/token?device_code=${encodeURIComponent(deviceCode)}`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(`Token poll failed: ${res.status}`);
  return res.json();
}

export async function fetchGithubUser(accessToken: string): Promise<GithubUser> {
  const res = await fetch("/auth/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error(`User fetch failed: ${res.status}`);
  return res.json();
}

// ── Metrics ──────────────────────────────────────────────────────────────────

function userContextHeader(user: StoredUser): string {
  return JSON.stringify({
    id: user.id,
    login: user.login,
    name: user.name,
    email: user.email,
  });
}

export async function fetchMetrics(user: StoredUser): Promise<MetricsResponse> {
  const res = await fetch("/genieapi/metrics", {
    headers: {
      "X-User-Context": userContextHeader(user),
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`Metrics fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchFilteredMetric(
  user: StoredUser,
  metricName: string,
  filters: Record<string, string | number>
): Promise<MetricsResponse> {
  const params = new URLSearchParams({
    filter: "true",
    metric_name: metricName,
    filters: JSON.stringify(filters),
  });
  const res = await fetch(`/genieapi/metrics?${params}`, {
    headers: {
      "X-User-Context": userContextHeader(user),
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error(`Filtered metric fetch failed: ${res.status}`);
  return res.json();
}

// ── Local storage ────────────────────────────────────────────────────────────

const USER_KEY = "genie_user";

export function saveUser(user: StoredUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function loadUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

export function clearUser(): void {
  localStorage.removeItem(USER_KEY);
}
