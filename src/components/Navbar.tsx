import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../ThemeContext";

const navLinks = [
  { label: "ABOUT", hash: "#about" },
  { label: "EXPERIENCE", hash: "#experience" },
  { label: "PROJECTS", hash: "#projects" },
  { label: "TESTIMONIALS", hash: "#testimonials" },
  { label: "SKILLS", hash: "#skills" },
];

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isAwareness = location.pathname.includes("Cybersecurity_Awareness");

  const closeMenu = () => setIsMenuOpen(false);

  const getHashHref = (hash: string) => {
    if (isAwareness) {
      return `${import.meta.env.BASE_URL}${hash}`;
    }
    return hash;
  };

  return (
    <nav className="nav-container">
      <div className="nav-logo">
        <Link to="/" onClick={closeMenu}>
          PhilopaterSh<span className="cursor">_</span>
        </Link>
      </div>
      <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
        {navLinks.map((link) => (
          <a
            key={link.hash}
            href={isAwareness ? getHashHref(link.hash) : link.hash}
            onClick={closeMenu}
          >
            {link.label}
          </a>
        ))}
        <Link
          to="/Cybersecurity_Awareness"
          className={isAwareness ? "nav-cta active" : "nav-cta-link"}
          onClick={closeMenu}
        >
          AWARENESS
        </Link>
        <a
          href={isAwareness ? `${import.meta.env.BASE_URL}#contact` : "#contact"}
          className={isAwareness ? undefined : "nav-cta-link"}
          onClick={closeMenu}
        >
          GET IN TOUCH
        </a>
      </div>

      <div className="nav-actions">
        <div className="topbar-status">
          <div className="topbar-theme-mode" role="group" aria-label="Color mode">
            <button
              type="button"
              className={`topbar-theme-mode__btn ${theme === "system" ? "topbar-theme-mode__btn--active" : ""}`}
              title="System"
              aria-label="Color mode: System"
              onClick={() => setTheme("system")}
            >
              <svg viewBox="0 0 24 24">
                <rect width="20" height="14" x="2" y="3" rx="2"></rect>
                <line x1="8" x2="16" y1="21" y2="21"></line>
                <line x1="12" x2="12" y1="17" y2="21"></line>
              </svg>
            </button>
            <button
              type="button"
              className={`topbar-theme-mode__btn ${theme === "light" ? "topbar-theme-mode__btn--active" : ""}`}
              title="Light"
              aria-label="Color mode: Light"
              onClick={() => setTheme("light")}
            >
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
                <path d="m4.93 4.93 1.41 1.41"></path>
                <path d="m17.66 17.66 1.41 1.41"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="m6.34 17.66-1.41 1.41"></path>
                <path d="m19.07 4.93-1.41 1.41"></path>
              </svg>
            </button>
            <button
              type="button"
              className={`topbar-theme-mode__btn ${theme === "dark" ? "topbar-theme-mode__btn--active" : ""}`}
              title="Dark"
              aria-label="Color mode: Dark"
              onClick={() => setTheme("dark")}
            >
              <svg viewBox="0 0 24 24">
                <path d="M12 3a6.5 6.5 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
              </svg>
            </button>
          </div>
        </div>
        <button
          className={`nav-toggle ${isMenuOpen ? "active" : ""}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
