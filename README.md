# Genie Dashboard

A React + TypeScript frontend for the CodeGenie Copilot platform. Provides an analytics dashboard with GitHub Copilot OAuth authentication and usage insights.

## Tech Stack

- **React 18** with TypeScript
- **Vite 5** — dev server and bundler
- **Recharts** — data visualization
- **Node.js auth proxy** — handles GitHub Copilot OAuth device flow (avoids CORS)

## Project Structure

```
src/
  components/
    AuthModal.tsx        # GitHub OAuth login modal
    Dashboard.tsx        # Main dashboard view
    FilterBar.tsx        # Data filtering controls
    GenieLogo.tsx        # Brand logo component
    Header.tsx           # Top navigation bar
    LandingPage.tsx      # Pre-auth landing page
    LoginPage.tsx        # Login page
    ProjectUserTable.tsx # Project/user data table
    Sidebar.tsx          # Navigation sidebar
    ThemeToggle.tsx      # Light/dark theme switcher
    charts/              # Recharts-based chart components
  App.tsx                # Root component, auth + routing state
  api.ts                 # API client
  types.ts               # Shared TypeScript types
  index.css              # Global styles
auth-proxy.js            # GitHub OAuth device-flow proxy (port 3001)
vite.config.ts           # Vite config with API proxy rules
```

## Getting Started

### Prerequisites

- Node.js 18+
- A GitHub OAuth App (or Copilot Client ID)

### Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**

   Create a `.env` file in the project root:

   ```env
   GITHUB_COPILOT_CLIENT_ID=your_client_id_here
   ```

3. **Start development servers**

   ```bash
   npm run dev
   ```

   This runs both the Vite dev server (port 5173) and the auth proxy (port 3001) concurrently.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server + auth proxy |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build locally |
| `npm run proxy` | Run only the auth proxy |

## How Authentication Works

Authentication uses the [GitHub Device Flow](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps#device-flow):

1. User clicks sign in — the frontend requests a device code via the local auth proxy
2. User visits GitHub and enters the displayed code
3. The app polls for an access token; on success, user profile is fetched and stored locally

The auth proxy (`auth-proxy.js`) runs on port 3001 and proxies requests to `github.com` to avoid CORS issues in the browser.

## API Proxying

Vite proxies two paths in development:

| Path | Target |
|---|---|
| `/genieapi/*` | `http://localhost:3000` (backend) |
| `/auth/*` | `http://localhost:3001` (auth proxy) |
