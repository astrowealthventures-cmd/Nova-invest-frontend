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
  Wallet,
  TrendUp,
  Coins,
  ArrowUpRight,
  ArrowDownRight,
  Lightning,
  Clock,
  CheckCircle,
  XCircle,
  CircleNotch,
  Rocket,
  ChartLineUp,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

export default function Overview() {
  const { user } = useAuth();
  const [summary, setSummary] = useState({ balance: 0, invested: 0, earnings: 0, total_deposits: 0, active_investments: 0 });
  const [chart, setChart] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [txs, setTxs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
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
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const allTimeReturn = summary.total_deposits > 0
    ? ((summary.earnings / (summary.total_deposits || 1)) * 100).toFixed(2)
    : "0.00";

  return (
    <div className="space-y-8" data-testid="dashboard-overview">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 font-mono mb-2">
          <Clock size={14} weight="duotone" />
          {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </div>
        <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight">
          Welcome back, <span className="text-[#C8102E]">{user?.name?.split(" ")[0]}</span>
        </h1>
      </motion.div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <StatCard
            icon={<Wallet size={28} weight="duotone" />}
            label="Total Balance"
            value={money(summary.balance)}
            accent
            big
            testid="stat-balance"
            trend={allTimeReturn}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <StatCard
            icon={<Coins size={28} weight="duotone" />}
            label="Total Invested"
            value={money(summary.invested)}
            testid="stat-invested"
            activeInvestments={summary.active_investments}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <StatCard
            icon={<TrendUp size={28} weight="duotone" />}
            label="Total Earnings"
            value={money(summary.earnings)}
            positive
            testid="stat-earnings"
            trend={allTimeReturn}
          />
        </motion.div>
      </div>

      {/* Portfolio Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative hairline bg-gradient-to-br from-[#0F0F0F] via-[#0A0A0A] to-[#0F0F0F] p-6 md:p-8 overflow-hidden"
        data-testid="portfolio-chart-card"
      >
        {/* Decorative grid */}
        <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />

        <div className="relative">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500 font-mono mb-2">
                <ChartLineUp size={14} weight="duotone" />
                Portfolio Value
              </div>
              <div className="font-mono text-4xl md:text-5xl font-bold tracking-tight">
                {money(summary.balance + summary.invested + summary.earnings)}
              </div>
              <div className="mt-2 text-sm text-zinc-400">
                Across {summary.active_investments || 0} active position{summary.active_investments !== 1 ? 's' : ''}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <div className="text-xs text-zinc-500 font-mono mb-1">All-time return</div>
                <div className="flex items-center gap-2">
                  {Number(allTimeReturn) >= 0 ? (
                    <>
                      <ArrowUpRight size={24} weight="bold" className="text-[#C8102E]" />
                      <span className="font-mono text-2xl font-bold text-[#C8102E]">
                        +{allTimeReturn}%
                      </span>
                    </>
                  ) : (
                    <>
                      <ArrowDownRight size={24} weight="bold" className="text-red-500" />
                      <span className="font-mono text-2xl font-bold text-red-500">
                        {allTimeReturn}%
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="h-72 md:h-80 min-h-[288px]">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <AreaChart data={chart} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C8102E" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#C8102E" stopOpacity={0.05} />
                  </linearGradient>
                  <linearGradient id="chartStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#C8102E" />
                    <stop offset="50%" stopColor="#E01B3D" />
                    <stop offset="100%" stopColor="#C8102E" />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#71717a", fontSize: 11, fontFamily: "JetBrains Mono" }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fill: "#71717a", fontSize: 11, fontFamily: "JetBrains Mono" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  width={50}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(10, 10, 10, 0.95)",
                    border: "1px solid rgba(200, 16, 46, 0.3)",
                    borderRadius: "8px",
                    fontFamily: "JetBrains Mono",
                    fontSize: 12,
                    backdropFilter: "blur(10px)",
                  }}
                  labelStyle={{ color: "#a1a1aa", marginBottom: 4 }}
                  formatter={(v) => [`$${Number(v).toLocaleString()}`, "Value"]}
                  cursor={{ stroke: "rgba(200, 16, 46, 0.2)", strokeWidth: 1 }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="url(#chartStroke)"
                  strokeWidth={3}
                  fill="url(#chartGrad)"
                  activeDot={{ r: 6, fill: "#C8102E", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* 2-col: Active Investments + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Panel
            icon={<Rocket size={20} weight="duotone" />}
            title="Active Investments"
            cta={{ to: "/dashboard/plans", label: "New investment →", testid: "goto-plans" }}
            testid="active-investments-panel"
          >
            {investments.filter((i) => i.status === "active").length === 0 ? (
              <EmptyState
                icon={<Rocket size={48} weight="light" />}
                msg="No active investments yet."
                cta="/dashboard/plans"
                label="Explore plans"
              />
            ) : (
              <div className="space-y-3">
                {investments
                  .filter((i) => i.status === "active")
                  .slice(0, 4)
                  .map((inv, idx) => (
                    <motion.div
                      key={inv.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className="group relative p-4 border border-white/5 hover:border-[#C8102E]/50 bg-[#0A0A0A] hover:bg-[#0F0F0F] transition-all duration-300"
                      data-testid={`inv-${inv.id}`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-[#C8102E]/0 via-[#C8102E]/5 to-[#C8102E]/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                      <div className="relative flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#C8102E] animate-pulse" />
                            <div className="text-sm font-semibold">{inv.plan_name}</div>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-zinc-500 font-mono">
                            <span className="flex items-center gap-1">
                              <Lightning size={12} weight="bold" />
                              {inv.daily_roi}% daily
                            </span>
                            <span className="w-px h-3 bg-white/10" />
                            <span className="flex items-center gap-1">
                              <Clock size={12} weight="bold" />
                              {inv.duration_days}d
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-mono text-base font-semibold">{money(inv.amount_usd)}</div>
                          <div className="flex items-center justify-end gap-1 text-xs text-[#C8102E] font-mono">
                            <ArrowUpRight size={12} weight="bold" />
                            +{money(inv.earnings)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            )}
          </Panel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Panel
            icon={<ArrowsClockwise size={20} weight="duotone" />}
            title="Recent Transactions"
            cta={{ to: "/dashboard/transactions", label: "View all →", testid: "goto-transactions" }}
            testid="recent-tx-panel"
          >
            {txs.length === 0 ? (
              <EmptyState
                icon={<Wallet size={48} weight="light" />}
                msg="No transactions yet."
                cta="/dashboard/deposit"
                label="Make a deposit"
              />
            ) : (
              <div className="space-y-1">
                {txs.slice(0, 5).map((t, idx) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="group flex items-center justify-between p-3 border-b border-white/5 last:border-b-0 hover:bg-[#0A0A0A] transition-colors"
                    data-testid={`tx-row-${t.id}`}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${t.type === "deposit"
                        ? "bg-[#C8102E]/10 text-[#C8102E]"
                        : t.type === "withdraw"
                          ? "bg-orange-500/10 text-orange-500"
                          : "bg-blue-500/10 text-blue-400"
                        }`}>
                        {t.type === "deposit" && <ArrowDownRight size={18} weight="bold" />}
                        {t.type === "withdraw" && <ArrowUpRight size={18} weight="bold" />}
                        {t.type === "invest" && <TrendUp size={18} weight="bold" />}
                      </div>

                      <div className="flex-1">
                        <div className="text-sm font-semibold capitalize">{t.type}</div>
                        <div className="text-xs text-zinc-500 font-mono flex items-center gap-1 mt-0.5">
                          <Clock size={10} weight="bold" />
                          {new Date(t.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono text-base font-semibold">{money(t.amount_usd)}</div>
                      <StatusBadge status={t.status} />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </Panel>
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, positive, accent, big, testid, trend, activeInvestments }) {
  return (
    <div
      className={`relative group hairline p-6 transition-all duration-300 overflow-hidden ${accent
        ? "bg-gradient-to-br from-[#C8102E]/10 via-[#0F0F0F] to-[#0A0A0A] hover:from-[#C8102E]/20"
        : "bg-[#0F0F0F] hover:bg-[#121212]"
        }`}
      data-testid={testid}
    >
      {/* Decorative corner accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none ${accent ? "bg-[#C8102E]/20" : "bg-white/5"
        } blur-3xl -translate-y-1/2 translate-x-1/2 rounded-full`} />

      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className={`flex items-center justify-center w-12 h-12 rounded-lg ${accent
            ? "bg-[#C8102E]/20 text-[#C8102E]"
            : positive
              ? "bg-[#C8102E]/10 text-[#C8102E]"
              : "bg-white/5 text-zinc-400"
            }`}>
            {icon}
          </div>

          {trend && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-mono ${Number(trend) >= 0
              ? "bg-[#C8102E]/10 text-[#C8102E]"
              : "bg-red-500/10 text-red-500"
              }`}>
              {Number(trend) >= 0 ? (
                <ArrowUpRight size={12} weight="bold" />
              ) : (
                <ArrowDownRight size={12} weight="bold" />
              )}
              {trend}%
            </div>
          )}
        </div>

        <div className="text-xs uppercase tracking-widest text-zinc-500 font-mono mb-2">
          {label}
        </div>

        <div className={`font-mono font-bold tracking-tight ${big ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"
          } ${positive ? "text-[#C8102E]" : "text-white"}`}>
          {value}
        </div>

        {activeInvestments !== undefined && (
          <div className="mt-2 text-xs text-zinc-500 font-mono">
            {activeInvestments} active position{activeInvestments !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}

function Panel({ icon, title, cta, children, testid }) {
  return (
    <div className="relative hairline bg-gradient-to-br from-[#0F0F0F] via-[#0A0A0A] to-[#0F0F0F] p-6 overflow-hidden" data-testid={testid}>
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 grid-lines opacity-10 pointer-events-none" />

      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 text-zinc-400">
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
              className="group flex items-center gap-1 text-xs text-[#C8102E] hover:text-[#E01B3D] font-mono transition-colors"
            >
              {cta.label}
              <ArrowUpRight
                size={14}
                weight="bold"
                className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
              />
            </Link>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}

export function StatusBadge({ status }) {
  const config = {
    pending: {
      icon: <CircleNotch size={10} weight="bold" />,
      styles: "text-[#FF9500] border-[#FF9500]/30 bg-[#FF9500]/10",
    },
    approved: {
      icon: <CheckCircle size={10} weight="bold" />,
      styles: "text-[#C8102E] border-[#C8102E]/30 bg-[#C8102E]/10",
    },
    completed: {
      icon: <CheckCircle size={10} weight="bold" />,
      styles: "text-[#C8102E] border-[#C8102E]/30 bg-[#C8102E]/10",
    },
    rejected: {
      icon: <XCircle size={10} weight="bold" />,
      styles: "text-[#FF3B30] border-[#FF3B30]/30 bg-[#FF3B30]/10",
    },
    active: {
      icon: <CheckCircle size={10} weight="bold" />,
      styles: "text-[#C8102E] border-[#C8102E]/30 bg-[#C8102E]/10",
    },
  };

  const { icon, styles } = config[status] || {
    icon: null,
    styles: "text-zinc-400 border-white/10 bg-white/5",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-0.5 border ${styles}`}
    >
      {icon}
      {status}
    </span>
  );
}

function EmptyState({ icon, msg, cta, label }) {
  return (
    <div className="py-12 text-center">
      <div className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-full bg-white/5 text-zinc-600">
        {icon}
      </div>
      <div className="text-sm text-zinc-500 mb-4">{msg}</div>
      {cta && (
        <Link
          to={cta}
          className="inline-flex items-center gap-2 text-[#C8102E] hover:text-[#E01B3D] text-sm font-mono transition-colors"
        >
          {label}
          <ArrowUpRight size={14} weight="bold" />
        </Link>
      )}
    </div>
  );
}