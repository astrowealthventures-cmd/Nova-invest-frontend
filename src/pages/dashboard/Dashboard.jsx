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

  useEffect(() => {
    const load = () =>
      http.get("/portfolio/summary").then(({ data }) => setSummary(data)).catch(() => { });
    load();
    const id = setInterval(load, 20000);
    return () => clearInterval(id);
  }, []);

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
      {/* Sidebar */}
      <aside className="w-64 shrink-0 bg-[#050505] border-r border-white/5 flex flex-col sticky top-0 h-screen" data-testid="dashboard-sidebar">
        <Link to="/" className="px-6 h-16 flex items-center gap-2 font-display font-bold text-lg tracking-tight border-b border-white/5">
          <BrandMark className="w-6 h-6" />
          <span className="text-[#F0A83E]">AstroWealthVentures</span>
        </Link>

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

        <nav className="flex-1 px-2 mt-4 space-y-1">
          {links.map((l) => {
            const Icon = l.icon;
            return (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                data-testid={l.testid}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 text-sm transition-colors ${isActive
                    ? "bg-[#F0A83E]/10 text-[#F0A83E] border-l-2 border-[#F0A83E]"
                    : "text-zinc-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                  }`
                }
              >
                <Icon size={18} weight="regular" />
                {l.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 bg-[#F0A83E]/20 border border-[#F0A83E]/40 flex items-center justify-center text-[#F0A83E] font-mono font-bold">
              {(user?.name || "?").slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-sm truncate" data-testid="sidebar-user-name">{user?.name}</div>
              <div className="text-xs text-zinc-500 truncate font-mono">{user?.email}</div>
            </div>
          </div>
          <button
            onClick={onLogout}
            data-testid="sidebar-logout-btn"
            className="w-full flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors py-2"
          >
            <SignOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0">
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
