import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { http, money } from "@/lib/api";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUp,
  ArrowUpRight,
  CaretRight,
  ChartLineUp,
  ChartPieSlice,
  Clock,
  Lightning,
  Megaphone,
  Plus,
  Receipt,
  Rocket,
  TrendUp,
  Wallet,
  Warning,
  X,
} from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function Overview() {
  const { user } = useAuth();
  const [summary, setSummary] = useState({ balance: 0, invested: 0, earnings: 0, total_deposits: 0, active_investments: 0 });
  const [chart, setChart] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [txs, setTxs] = useState([]);
  const [showBonus, setShowBonus] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [s, c, inv, t] = await Promise.all([
        http.get("/portfolio/summary"),
        http.get("/portfolio/chart"),
        http.get("/investments"),
        http.get("/transactions"),
      ]);
      setSummary(s.data);
      setChart(c.data);
      setInvestments(inv.data);
      setTxs(t.data);
    };
    load();
  }, []);

  const withdrawn = txs
    .filter((t) => t.type === "withdraw" && t.status !== "rejected")
    .reduce((sum, t) => sum + Number(t.amount_usd || 0), 0);

  const allTimeReturn = summary.total_deposits > 0
    ? ((summary.earnings / (summary.total_deposits || 1)) * 100).toFixed(2)
    : "0.00";

  console.log(user);
  return (
    <div className="space-y-6 md:space-y-8" data-testid="dashboard-overview">
      {/* Welcome bonus banner */}
      {showBonus && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative flex items-center gap-4 rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-400/10 via-amber-400/5 to-transparent p-4 md:p-5"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-amber-400/15 text-amber-400">
            <Megaphone size={24} weight="duotone" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-amber-400">Welcome Bonus Available!</div>
            <div className="mt-0.5 text-sm text-zinc-400">
              Deposit now and earn up to 15% bonus on your first investment!
            </div>
          </div>
          <button
            onClick={() => setShowBonus(false)}
            className="text-zinc-500 transition-colors hover:text-white"
            aria-label="Dismiss"
          >
            <X size={18} weight="bold" />
          </button>
        </motion.div>
      )}

      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <h1 className="font-display font-bold text-3xl md:text-5xl tracking-tight">
          Welcome back, <span className="text-[#C8102E]">{user?.first_name}</span>
        </h1>
        <div className="mt-2 text-sm md:text-base text-zinc-500">
          {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </div>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
          Markets Live
        </div>
      </motion.div>



      {/* Balance card + stat tiles */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Account balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-3 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#161616] to-[#0C0C0C] p-6 md:p-8"
          data-testid="stat-balance"
        >
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#C8102E] to-transparent" />
          <div className="absolute -top-24 left-1/2 h-40 w-2/3 -translate-x-1/2 rounded-full bg-[#C8102E]/20 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8102E]/15 text-[#C8102E]">
                <Wallet size={20} weight="duotone" />
              </div>
              <div className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-mono">
                Account Balance
              </div>
            </div>

            <div className="mt-5 font-mono text-5xl md:text-6xl font-bold tracking-tight">
              {money(summary.balance)}
            </div>
            <div className="mt-2 text-sm text-zinc-500">
              Last updated:{" "}
              {new Date().toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" })}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span data-testid="stat-invested" className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-zinc-300">
                Invested {money(summary.invested)}
              </span>
              <span className="rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-mono text-green-400">
                Earned {money(summary.earnings)}
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Link
                to="/dashboard/deposit"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#C8102E] py-3.5 font-semibold text-white transition-colors hover:bg-[#E01B3D]"
              >
                <Plus size={18} weight="bold" /> Deposit
              </Link>
              <Link
                to="/dashboard/withdraw"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-3.5 font-semibold transition-colors hover:border-white/30"
              >
                <ArrowUp size={18} weight="bold" /> Withdraw
              </Link>
            </div>
          </div>
        </motion.div>

        {/* 2x2 stat tiles */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-3 md:gap-4 content-start">
          <Link to={"/dashboard/"}>
            <StatTile
              icon={<ChartLineUp size={24} weight="duotone" />}
              tint="bg-green-500/10 text-green-400"
              value={money(summary.earnings)}
              label="Total Profits"
              testid="stat-earnings"
              delay={0.2}
            />
          </Link>
          <Link to={"/dashboard/plans"}>
            <StatTile
              icon={<ChartPieSlice size={24} weight="duotone" />}
              tint="bg-blue-500/10 text-blue-400"
              value={summary.active_investments}
              label="Active Plans"
              delay={0.25}
            />
          </Link>

          <Link to={"/dashboard/deposit"}>
            <StatTile
              icon={<ArrowDownRight size={24} weight="duotone" />}
              tint="bg-emerald-500/10 text-emerald-400"
              value={money(summary.total_deposits)}
              label="Deposited"
              delay={0.3}
            />
          </Link>
          <Link to={"/dashboard/withdraw"}>
            <StatTile
              icon={<ArrowUpRight size={24} weight="duotone" />}
              tint="bg-red-500/10 text-red-400"
              value={money(withdrawn)}
              label="Withdrawn"
              delay={0.35}
            />
          </Link>
        </div>
      </div>

      {/* Portfolio chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-3xl border border-white/5 bg-[#101010] p-6 md:p-8"
        data-testid="portfolio-chart-card"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Portfolio value</div>
            <div className="font-mono text-3xl md:text-4xl font-bold mt-1">
              {money(summary.balance + summary.invested + summary.earnings)}
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C8102E]/30 bg-[#C8102E]/10 px-3 py-1.5 text-sm font-mono text-[#C8102E]">
            <TrendUp size={16} weight="bold" />
            +{allTimeReturn}% all-time
          </div>
        </div>

        <div className="h-64 md:h-72 min-h-[256px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={chart} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C8102E" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#C8102E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: "#52525b", fontSize: 11, fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: "#52525b", fontSize: 11, fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} width={50} />
              <Tooltip
                contentStyle={{
                  background: "#0A0A0A",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  fontFamily: "JetBrains Mono",
                  fontSize: 12,
                }}
                labelStyle={{ color: "#a1a1aa" }}
                formatter={(v) => [`$${Number(v).toLocaleString()}`, "Value"]}
              />
              <Area type="monotone" dataKey="value" stroke="#C8102E" strokeWidth={2.5} fill="url(#chartGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Active investments + recent transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel
          icon={<Rocket size={20} weight="duotone" />}
          title="Active Investments"
          cta={{ to: "/dashboard/plans", label: "New investment", testid: "goto-plans" }}
          testid="active-investments-panel"
          delay={0.3}
        >
          {investments.filter((i) => i.status === "active").length === 0 && (
            <EmptyState
              icon={<Rocket size={40} weight="light" />}
              msg="No active investments yet."
              cta="/dashboard/plans"
              label="Explore plans"
            />
          )}
          <div className="space-y-3">
            {investments.filter((i) => i.status === "active").slice(0, 4).map((inv) => (
              <div
                key={inv.id}
                className="rounded-2xl border border-white/5 bg-[#0C0C0C] p-4 transition-colors hover:border-[#C8102E]/40"
                data-testid={`inv-${inv.id}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                      <div className="text-sm font-semibold">{inv.plan_name}</div>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                      <span className="flex items-center gap-1 rounded-md bg-white/5 px-2 py-1">
                        <Lightning size={12} weight="bold" className="text-amber-400" />
                        {inv.daily_roi}% daily
                      </span>
                      <span className="flex items-center gap-1 rounded-md bg-white/5 px-2 py-1">
                        <Clock size={12} weight="bold" className="text-zinc-500" />
                        {inv.duration_days}d
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm font-semibold">{money(inv.amount_usd)}</div>
                    <div className="mt-1 flex items-center justify-end gap-1 text-xs font-mono text-green-400">
                      <ArrowUpRight size={12} weight="bold" />
                      +{money(inv.earnings)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel
          icon={<Receipt size={20} weight="duotone" />}
          title="Recent Transactions"
          cta={{ to: "/dashboard/transactions", label: "View all", testid: "goto-transactions" }}
          testid="recent-tx-panel"
          delay={0.35}
        >
          {txs.length === 0 && (
            <EmptyState
              icon={<Receipt size={40} weight="light" />}
              msg="No transactions yet."
              cta="/dashboard/deposit"
              label="Make a deposit"
            />
          )}
          <div className="space-y-2">
            {txs.slice(0, 5).map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between rounded-2xl border border-white/5 bg-[#0C0C0C] p-3 transition-colors hover:border-white/15"
                data-testid={`tx-row-${t.id}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${t.type === "deposit"
                    ? "bg-green-500/10 text-green-400"
                    : t.type === "withdraw"
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-blue-500/10 text-blue-400"
                    }`}>
                    {t.type === "deposit" && <ArrowDownRight size={20} weight="duotone" />}
                    {t.type === "withdraw" && <ArrowUpRight size={20} weight="duotone" />}
                    {t.type === "invest" && <TrendUp size={20} weight="duotone" />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold capitalize">{t.type}</div>
                    <div className="text-xs text-zinc-500 font-mono">{new Date(t.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm font-semibold">{money(t.amount_usd)}</div>
                  <StatusBadge status={t.status} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function StatTile({ icon, tint, value, label, testid, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="flex items-center gap-3 md:gap-4 rounded-2xl border border-white/5 bg-[#101010] p-4 md:p-5 transition-colors hover:border-white/15"
      data-testid={testid}
    >
      <div className={`flex h-12 w-12 md:h-14 md:w-14 shrink-0 items-center justify-center rounded-xl ${tint}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <div className="font-mono text-lg md:text-2xl font-bold truncate">{value}</div>
        <div className="mt-0.5 text-[10px] md:text-xs uppercase tracking-widest text-zinc-500 font-mono">
          {label}
        </div>
      </div>
    </motion.div>
  );
}

function Panel({ icon, title, cta, children, testid, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-3xl border border-white/5 bg-[#101010] p-5 md:p-6"
      data-testid={testid}
    >
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8102E]/10 text-[#C8102E]">
            {icon}
          </div>
          <div className="text-sm uppercase tracking-widest text-zinc-400 font-mono font-semibold">
            {title}
          </div>
        </div>
        {cta && (
          <Link
            to={cta.to}
            data-testid={cta.testid}
            className="flex items-center gap-1 text-xs font-mono text-[#C8102E] transition-colors hover:text-[#E01B3D]"
          >
            {cta.label} <ArrowUpRight size={14} weight="bold" />
          </Link>
        )}
      </div>
      {children}
    </motion.div>
  );
}

export function StatusBadge({ status }) {
  const styles = {
    pending: "text-amber-400 border-amber-400/30 bg-amber-400/10",
    approved: "text-green-400 border-green-400/30 bg-green-400/10",
    completed: "text-green-400 border-green-400/30 bg-green-400/10",
    rejected: "text-red-400 border-red-400/30 bg-red-400/10",
    active: "text-green-400 border-green-400/30 bg-green-400/10",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-mono uppercase ${styles[status] || "text-zinc-400 border-white/10 bg-white/5"}`}>
      <span className="h-1 w-1 rounded-full bg-current" />
      {status}
    </span>
  );
}

function EmptyState({ icon, msg, cta, label }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 py-10 text-center">
      <div className="flex justify-center text-zinc-600 mb-3">{icon}</div>
      <div className="text-sm text-zinc-500">{msg}</div>
      {cta && (
        <Link to={cta} className="mt-3 inline-flex items-center gap-1 text-sm font-mono text-[#C8102E] hover:text-[#E01B3D]">
          {label} <ArrowUpRight size={14} weight="bold" />
        </Link>
      )}
    </div>
  );
}