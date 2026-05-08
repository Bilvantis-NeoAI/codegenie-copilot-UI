import type { StoredUser } from "../types";
import { clearUser } from "../api";
import GenieLogo from "./GenieLogo";
import ThemeToggle from "./ThemeToggle";

interface Props {
  user: StoredUser;
  onSignOut: () => void;
}

export default function Header({ user, onSignOut }: Readonly<Props>) {
  function handleSignOut() {
    clearUser();
    onSignOut();
  }

  return (
    <header className="topbar">
      <div className="topbar__logo">
        <div className="topbar__logo-icon">
          <GenieLogo size={18} color="#ffffff" />
        </div>
        CodeGenie
      </div>
      <div className="topbar__divider" />
      <span className="topbar__space">Code Review Metrics</span>

      <div className="topbar__right">
        <ThemeToggle className="topbar__theme-toggle" />
        {user.avatar_url && (
          <img className="topbar__avatar" src={user.avatar_url} alt={user.login} />
        )}
        <span className="topbar__user-name">{user.name || user.login}</span>
        <button className="topbar__signout" onClick={handleSignOut}>
          Sign out
        </button>
      </div>
    </header>
  );
}
