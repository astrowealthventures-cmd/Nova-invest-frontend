import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  ChartPieSlice,
  Stack,
  ArrowDownRight,
  ArrowUpRight,
  ClockCounterClockwise,
  ChartLine,
  ShieldStar,
  SignOut,
  CaretLeft,
  CaretRight,
  List,
  X,
} from "@phosphor-icons/react";
import CryptoTicker from "@/components/CryptoTicker";
import BrandMark from "@/components/BrandMark";
import { money } from "@/lib/api";
import { useEffect, useState } from "react";
import { http } from "@/lib/api";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState({ balance: 0, invested: 0, earnings: 0 });
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem("sidebarCollapsed") === "true"
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", String(collapsed));
  }, [collapsed]);

  useEffect(() => {
    const load = () =>
      http.get("/portfolio/summary").then(({ data }) => setSummary(data)).catch(() => { });
    load();
    const id = setInterval(load, 20000);
    return () => clearInterval(id);
  }, []);

  // lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const onLogout = async () => {
    await logout();
    navigate("/");
  };

  const links = [
    { to: "/dashboard", label: "Overview", icon: ChartPieSlice, end: true, testid: "sidenav-overview" },
    { to: "/dashboard/plans", label: "Plans", icon: Stack, testid: "sidenav-plans" },
    { to: "/dashboard/investments", label: "Investments", icon: ChartLine, testid: "sidenav-investments" },
    { to: "/dashboard/deposit", label: "Deposit", icon: ArrowDownRight, testid: "sidenav-deposit" },
    { to: "/dashboard/withdraw", label: "Withdraw", icon: ArrowUpRight, testid: "sidenav-withdraw" },
    { to: "/dashboard/transactions", label: "Transactions", icon: ClockCounterClockwise, testid: "sidenav-transactions" },
  ];
  if (user?.role === "admin") {
    links.push({ to: "/dashboard/admin", label: "Admin", icon: ShieldStar, testid: "sidenav-admin" });
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 inset-x-0 h-14 z-30 bg-[#050505] border-b border-white/5 flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg tracking-tight">
          <BrandMark className="w-6 h-6 shrink-0" />
          <span className="text-[#C8102E]">AstroWealthVentures</span>
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          data-testid="mobile-nav-toggle-btn"
          className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white"
        >
          <List size={22} />
        </button>
      </div>

      {/* Backdrop, mobile only, shown while drawer is open */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
          data-testid="mobile-nav-backdrop"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          ${collapsed ? "md:w-20" : "md:w-64"} w-72 shrink-0 bg-[#050505] border-r border-white/5
          flex flex-col fixed md:sticky top-0 h-screen z-50
          transition-transform duration-200 md:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        data-testid="dashboard-sidebar"
      >
        <div className="h-16 flex items-center justify-between border-b border-white/5 px-4">
          <Link
            to="/"
            className="flex items-center gap-2 font-display font-bold text-lg tracking-tight overflow-hidden"
          >
            <BrandMark className="w-6 h-6 shrink-0" />
            {!collapsed && (
              <span className="whitespace-nowrap">
                <span className="text-[#C8102E]">AstroWealthVentures</span>
              </span>
            )}
          </Link>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed((c) => !c)}
            data-testid="sidebar-toggle-btn"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden md:flex shrink-0 w-7 h-7 items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
          >
            {collapsed ? <CaretRight size={14} /> : <CaretLeft size={14} />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            data-testid="mobile-nav-close-btn"
            className="md:hidden shrink-0 w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {!collapsed && (
          <div className="p-4">
            <div className="text-xs uppercase tracking-widest text-zinc-600 font-mono mb-1">
              Total balance
            </div>
            <div className="font-mono text-2xl font-bold" data-testid="sidebar-balance">
              {money(summary.balance)}
            </div>
            <div className="mt-1 text-xs text-zinc-500 font-mono">
              +{money(summary.earnings)} earned
            </div>
          </div>
        )}

        <nav className="flex-1 px-2 mt-4 space-y-1">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                data-testid={l.testid}
                title={collapsed ? l.label : undefined}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-sm transition-colors ${collapsed ? "md:justify-center md:px-0" : ""
                  } ${isActive
                    ? "bg-[#C8102E]/10 text-[#C8102E] border-l-2 border-[#C8102E]"
                    : "text-zinc-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                  }`
                }
              >
                <Icon size={18} weight="regular" />
                {(!collapsed || mobileOpen) && l.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className={`flex items-center gap-3 mb-4 ${collapsed ? "md:justify-center" : ""}`}>
            <div
              className="w-9 h-9 shrink-0 bg-[#C8102E]/20 border border-[#C8102E]/40 flex items-center justify-center text-[#C8102E] font-mono font-bold"
              title={collapsed ? user?.name : undefined}
            >
              {(user?.name || "?").slice(0, 1).toUpperCase()}
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="min-w-0">
                <div className="text-sm truncate" data-testid="sidebar-user-name">{user?.firtName}</div>
                <div className="text-xs text-zinc-500 truncate font-mono">{user?.email}</div>
              </div>
            )}
          </div>
          <button
            onClick={onLogout}
            data-testid="sidebar-logout-btn"
            title={collapsed ? "Logout" : undefined}
            className={`w-full flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors py-2 ${collapsed ? "md:justify-center" : ""
              }`}
          >
            <SignOut size={16} /> {(!collapsed || mobileOpen) && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 pt-14 md:pt-0">
        <div className="border-b border-white/5">
          <CryptoTicker />
        </div>
        <div className="p-6 md:p-10 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}