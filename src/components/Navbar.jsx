import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import BrandMark from "@/components/BrandMark";

export default function Navbar({ transparent = false }) {
  const { user, logout } = useAuth();

  return (
    <header
      data-testid="site-navbar"
      className={`fixed top-0 left-0 right-0 z-40 ${transparent ? "glass" : "bg-[#050505] border-b border-white/5"
        }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 h-16">
        <Link
          to="/"
          className="flex items-center gap-2 font-display font-bold text-xl tracking-tight"
          data-testid="nav-logo"
        >
          <BrandMark className="w-7 h-7" />
          <span className="text-[#F0A83E]">AstroWealthVentures</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-400">
          <a href="#plans" className="hover:text-white transition-colors" data-testid="nav-plans">
            Plans
          </a>
          <a href="#features" className="hover:text-white transition-colors" data-testid="nav-features">
            Features
          </a>
          <a href="#stats" className="hover:text-white transition-colors" data-testid="nav-stats">
            Markets
          </a>
          <a href="#testimonials" className="hover:text-white transition-colors" data-testid="nav-testimonials">
            Clients
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {user && user !== false ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm text-zinc-300 hover:text-white"
                data-testid="nav-dashboard-link"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="text-sm px-4 py-2 border border-white/15 hover:border-white/40 transition-colors"
                data-testid="nav-logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-zinc-300 hover:text-white"
                data-testid="nav-login-link"
              >
                Login
              </Link>
              <Link
                to="/signup"
                data-testid="nav-signup-btn"
                className="text-sm font-semibold bg-[#F0A83E] text-black px-4 py-2 hover:bg-[#FFBC5C] transition-colors glow-btn"
              >
                Get Started →
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
