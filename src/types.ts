export interface GithubUser {
  id: number;
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
}

export interface StoredUser {
  id: number;
  login: string;
  name: string;
  email: string;
  avatar_url: string;
  access_token: string;
}

// ── Device-flow auth ────────────────────────────────────────────────────────

export interface DeviceCodeResponse {
  device_code?: string;
  user_code?: string;
  verification_uri?: string;
  expires_in?: number;
  interval?: number;
  error?: string;
  error_description?: string;
}

export interface TokenResponse {
  access_token?: string;
  token_type?: string;
  scope?: string;
  error?: string;
  error_description?: string;
  interval?: number;
}

// ── Metric shapes returned by /genieapi/metrics ─────────────────────────────

export interface SeverityEntry {
  severity: "critical" | "major" | "minor" | "cosmetic";
  count: number;
  percentage: number;
}

export interface SeverityDistribution {
  title: string;
  graph_type: string;
  data: SeverityEntry[];
}

export interface SeverityAreaEntry {
  date: string;
  critical: number;
  major: number;
  minor: number;
  cosmetic: number;
}

export interface SeverityAreaData {
  title: string;
  graph_type: string;
  data: SeverityAreaEntry[];
}

export interface ProjectSeverityEntry {
  project: string;
  critical: number;
  major: number;
  minor: number;
  cosmetic: number;
}

export interface ProjectSeverityData {
  title: string;
  graph_type: string;
  data: ProjectSeverityEntry[];
}

export interface MonthCount {
  month: string;
  count: number;
}

export interface MonthlyUsageData {
  title: string;
  graph_type: string;
  data: [{ review: MonthCount[] }, { assistant: MonthCount[] }];
}

export interface AssistantUsageEntry {
  assistant_name: string;
  count: number;
}

export interface AssistantUsageData {
  title: string;
  graph_type: string;
  data: AssistantUsageEntry[];
}

export interface ReviewUsageEntry {
  review_name: string;
  count: number;
}

export interface ReviewUsageData {
  title: string;
  graph_type: string;
  data: ReviewUsageEntry[];
}

export interface QualityEntry {
  month: string;
  average_quality: number;
}

export interface AvgQualityData {
  title: string;
  graph_type: string;
  data: QualityEntry[];
}

export interface SeverityTrendEntry {
  month: string;
  average_severity: number;
}

export interface AvgSeverityData {
  title: string;
  graph_type: string;
  data: SeverityTrendEntry[];
}

export interface ProjectUserCountEntry {
  project: string;
  count: number;
}

export interface ProjectUserCountData {
  title: string;
  graph_type: string;
  data: ProjectUserCountEntry[];
}

export interface UserDetail {
  user_id: string;
  username: string | null;
  full_name: string | null;
}

export interface ProjectUserMapping {
  project_name: string;
  users: UserDetail[];
}

export interface MetricsPayload {
  issue_severity_distribution?: SeverityDistribution;
  issue_severity_by_user_and_project?: SeverityDistribution;
  issue_severity_pie_chart_data?: SeverityDistribution;
  issue_severity_area_chart_data?: SeverityAreaData;
  issue_severity_frequency_by_project?: ProjectSeverityData;
  monthly_usage?: MonthlyUsageData;
  assistant_usage_data?: AssistantUsageData;
  review_usage_data?: ReviewUsageData;
  avg_code_quality?: AvgQualityData;
  avg_code_severity?: AvgSeverityData;
  project_user_count?: ProjectUserCountData;
  project_user_mapping?: ProjectUserMapping[];
}

export interface MetricsResponse {
  metrics: MetricsPayload;
}

export interface FilterState {
  project_name: string;
  month: string;
}
