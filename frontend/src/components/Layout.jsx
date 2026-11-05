import { useState } from "react";
import {
  GraduationCap,
  LayoutDashboard,
  Search,
  BookOpen,
  UserRound,
  LogOut,
  Menu,
  X,
  Users,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Layout({ children, page, setPage, pageTitle }) {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const isAdmin =
    user?.role === "admin" || user?.role === "registration_officer";

  const studentNav = [
    ["dashboard", "Dashboard", LayoutDashboard],
    ["search", "Find courses", Search],
    ["mycourses", "My courses", BookOpen],
    ["profile", "My profile", UserRound],
  ];
  const adminNav = [
    ["admin", "Admin overview", LayoutDashboard],
    ["manage", "Manage courses", BookOpen],
    ["students", "Students", Users],
  ];
  const navItems = isAdmin ? adminNav : studentNav;

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <span className="brand-symbol">
            <GraduationCap size={23} />
          </span>
          <span className="brand-name">
            SMRS<small>Portal</small>
          </span>
          <button
            className="close-menu"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X />
          </button>
        </div>
        <nav aria-label="Main navigation">
          {navItems.map(([id, label, Icon]) => (
            <button
              key={id}
              className={`nav-link ${page === id ? "selected" : ""}`}
              onClick={() => {
                setPage(id);
                setMenuOpen(false);
              }}
            >
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <button className="nav-link signout" onClick={logout}>
            <LogOut size={18} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {menuOpen && (
        <button
          className="mobile-overlay"
          onClick={() => setMenuOpen(false)}
          aria-label="Close navigation overlay"
        />
      )}

      <main className="main-area" id="main-content" tabIndex="-1">
        <header className="topbar">
          <button
            className="menu-toggle"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation"
          >
            <Menu />
          </button>
          <div className="topbar-title">
            Student Management <span>/</span> <strong>{pageTitle(page)}</strong>
          </div>
          <div className="topbar-user">
            <span className="avatar">{user?.firstname?.charAt(0) || "U"}</span>
            <div className="user-meta">
              <strong>
                {user?.firstname} {user?.lastName}
              </strong>
              <small>{user?.role}</small>
            </div>
          </div>
        </header>
        <section className="page-content">{children}</section>
      </main>
    </div>
  );
}
