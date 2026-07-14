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
import { ArrowUpRight, ArrowDownRight, TrendUp } from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";

export default function Overview() {
  const { user } = useAuth();
  const [summary, setSummary] = useState({ balance: 0, invested: 0, earnings: 0, total_deposits: 0, active_investments: 0 });
  const [chart, setChart] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [txs, setTxs] = useState([]);

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

  return (
    <div className="space-y-8" data-testid="dashboard-overview">
      <div>
        <div className="text-xs uppercase tracking-widest text-zinc-500 font-mono">
          {new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
        </div>
        <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight mt-1">
          Welcome back, <span className="text-[#F0A83E]">{user?.name?.split(" ")[0]}</span>
        </h1>
      </div>

      {/* Top row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Total Balance" value={money(summary.balance)} accent big testid="stat-balance" />
        <StatCard label="Total Invested" value={money(summary.invested)} testid="stat-invested" />
        <StatCard label="Total Earnings" value={money(summary.earnings)} positive testid="stat-earnings" />
      </div>

      {/* Chart */}
      <div className="hairline bg-[#0F0F0F] p-6" data-testid="portfolio-chart-card">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Portfolio value</div>
            <div className="font-mono text-3xl font-bold mt-1">{money(summary.balance + summary.invested + summary.earnings)}</div>
          </div>
          <div className="flex items-center gap-1 text-[#F0A83E] font-mono text-sm">
            <TrendUp size={16} weight="bold" /> +{summary.total_deposits > 0 ? ((summary.earnings / (summary.total_deposits || 1)) * 100).toFixed(2) : "0.00"}% all-time
          </div>
        </div>
        <div className="h-64 min-h-[256px]" style={{ width: "100%" }}>
          <ResponsiveContainer width="100%" height="100%" minWidth={0}>
            <AreaChart data={chart} margin={{ left: 0, right: 0, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F0A83E" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#F0A83E" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fill: "#52525b", fontSize: 11, fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
              <YAxis tick={{ fill: "#52525b", fontSize: 11, fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${(v/1000).toFixed(1)}k`} width={50} />
              <Tooltip
                contentStyle={{
                  background: "#0A0A0A",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 0,
                  fontFamily: "JetBrains Mono",
                  fontSize: 12,
                }}
                labelStyle={{ color: "#a1a1aa" }}
                formatter={(v) => [`$${Number(v).toLocaleString()}`, "Value"]}
              />
              <Area type="monotone" dataKey="value" stroke="#F0A83E" strokeWidth={2} fill="url(#chartGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 2-col: active investments + recent transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Active Investments" cta={{ to: "/dashboard/plans", label: "New investment →", testid: "goto-plans" }} testid="active-investments-panel">
          {investments.filter((i) => i.status === "active").length === 0 && (
            <EmptyState msg="No active investments yet." cta="/dashboard/plans" label="Explore plans" />
          )}
          <div className="space-y-3">
            {investments.filter((i) => i.status === "active").slice(0, 4).map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-3 border border-white/5 hover:border-white/20 transition-colors" data-testid={`inv-${inv.id}`}>
                <div>
                  <div className="text-sm font-semibold">{inv.plan_name}</div>
                  <div className="text-xs text-zinc-500 font-mono">{inv.daily_roi}% daily · {inv.duration_days}d</div>
                </div>
                <div className="text-right">
                  <div className="font-mono text-sm">{money(inv.amount_usd)}</div>
                  <div className="text-xs text-[#F0A83E] font-mono">+{money(inv.earnings)}</div>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Recent Transactions" cta={{ to: "/dashboard/transactions", label: "View all →", testid: "goto-transactions" }} testid="recent-tx-panel">
          {txs.length === 0 && <EmptyState msg="No transactions yet." cta="/dashboard/deposit" label="Make a deposit" />}
          <div className="space-y-1">
            {txs.slice(0, 5).map((t) => (
              <div key={t.id} className="flex items-center justify-between py-2 text-sm border-b border-white/5 last:border-b-0" data-testid={`tx-row-${t.id}`}>
                <div className="flex items-center gap-3">
                  {t.type === "deposit" && <ArrowDownRight size={16} className="text-[#F0A83E]" />}
                  {t.type === "withdraw" && <ArrowUpRight size={16} className="text-[#FF9500]" />}
                  {t.type === "invest" && <TrendUp size={16} className="text-blue-400" />}
                  <div>
                    <div className="capitalize">{t.type}</div>
                    <div className="text-xs text-zinc-500 font-mono">{new Date(t.created_at).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono">{money(t.amount_usd)}</div>
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

function StatCard({ label, value, positive, accent, big, testid }) {
  return (
    <div className={`hairline p-6 transition-colors ${accent ? "bg-gradient-to-br from-[#F0A83E]/10 to-transparent" : "bg-[#0F0F0F]"}`} data-testid={testid}>
      <div className="text-xs uppercase tracking-widest text-zinc-500 font-mono">{label}</div>
      <div className={`font-mono font-bold mt-2 ${big ? "text-4xl" : "text-3xl"} ${positive ? "text-[#F0A83E]" : "text-white"}`}>
        {value}
      </div>
    </div>
  );
}

function Panel({ title, cta, children, testid }) {
  return (
    <div className="hairline bg-[#0F0F0F] p-6" data-testid={testid}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-xs uppercase tracking-widest text-zinc-400 font-mono">{title}</div>
        {cta && (
          <Link to={cta.to} data-testid={cta.testid} className="text-xs text-[#F0A83E] hover:underline font-mono">
            {cta.label}
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

export function StatusBadge({ status }) {
  const styles = {
    pending: "text-[#FF9500] border-[#FF9500]/30 bg-[#FF9500]/5",
    approved: "text-[#F0A83E] border-[#F0A83E]/30 bg-[#F0A83E]/5",
    completed: "text-[#F0A83E] border-[#F0A83E]/30 bg-[#F0A83E]/5",
    rejected: "text-[#FF3B30] border-[#FF3B30]/30 bg-[#FF3B30]/5",
    active: "text-[#F0A83E] border-[#F0A83E]/30 bg-[#F0A83E]/5",
  };
  return (
    <span className={`inline-block text-[10px] font-mono uppercase px-1.5 py-0.5 border ${styles[status] || "text-zinc-400 border-white/10"}`}>
      {status}
    </span>
  );
}

function EmptyState({ msg, cta, label }) {
  return (
    <div className="py-8 text-center">
      <div className="text-sm text-zinc-500">{msg}</div>
      {cta && (
        <Link to={cta} className="mt-2 inline-block text-[#F0A83E] text-sm hover:underline font-mono">
          {label} →
        </Link>
      )}
    </div>
  );
}
