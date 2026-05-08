import { useState } from "react";
import { loadUser } from "./api";
import type { StoredUser } from "./types";
import LandingPage from "./components/LandingPage";
import AuthModal from "./components/AuthModal";
import Header from "./components/Header";
import Sidebar, { type Section } from "./components/Sidebar";
import Dashboard from "./components/Dashboard";

export default function App() {
  const [user, setUser] = useState<StoredUser | null>(() => loadUser());
  const [section, setSection] = useState<Section>("overview");
  const [modalOpen, setModalOpen] = useState(false);

  if (!user) {
    return (
      <>
        <LandingPage onSignInClick={() => setModalOpen(true)} />
        <AuthModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onLogin={(u) => { setModalOpen(false); setUser(u); }}
        />
      </>
    );
  }

  return (
    <>
      <Header user={user} onSignOut={() => setUser(null)} />
      <Sidebar active={section} onChange={setSection} />
      <main className="main">
        <Dashboard user={user} section={section} />
      </main>
    </>
  );
}
