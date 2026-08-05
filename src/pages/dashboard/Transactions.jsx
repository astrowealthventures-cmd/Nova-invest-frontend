import { useEffect, useState } from "react";
import { http, money } from "@/lib/api";
import { StatusBadge } from "@/pages/dashboard/Overview";
import {
  ArrowDownRight,
  ArrowUpRight,
  TrendUp,
  Receipt,
  Funnel
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "deposit", label: "Deposits" },
  { key: "withdraw", label: "Withdrawals" },
  { key: "invest", label: "Investments" },
];

export default function Transactions() {
  const [txs, setTxs] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    http.get("/transactions").then(({ data }) => setTxs(data));
  }, []);

  const filtered = filter === "all" ? txs : txs.filter((t) => t.type === filter);

  return (
    <div className="space-y-6 md:space-y-8" data-testid="page-transactions">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="font-display font-bold text-3xl md:text-5xl tracking-tight">
          Transactions
        </h1>
        <p className="text-zinc-400 mt-2 text-sm md:text-base">
          All account activity, on-chain and off.
        </p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-zinc-400">
          <Funnel size={18} weight="duotone" />
        </div>
        {FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            data-testid={`filter-${key}`}
            className={`shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${filter === key
              ? "bg-[#C8102E] text-white shadow-lg shadow-[#C8102E]/20"
              : "border border-white/10 bg-white/5 text-zinc-300 hover:border-white/30 hover:bg-white/10"
              }`}
          >
            {label}
          </button>
        ))}
      </motion.div>

      {/* Transactions list */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-3xl border border-white/5 bg-[#101010] p-5 md:p-6"
        data-testid="transactions-table"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8102E]/10 text-[#C8102E]">
            <Receipt size={20} weight="duotone" />
          </div>
          <div className="text-sm uppercase tracking-widest text-zinc-400 font-mono font-semibold">
            Activity Log
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 py-16 text-center">
            <div className="mb-3 flex justify-center text-zinc-600">

            </div>
            <div className="text-sm text-zinc-500">No transactions match.</div>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {filtered.map((t, idx) => {
                const typeConfig = {
                  deposit: {
                    icon: <ArrowDownRight size={20} weight="duotone" />,
                    tint: "bg-green-500/10 text-green-400",
                  },
                  withdraw: {
                    icon: <ArrowUpRight size={20} weight="duotone" />,
                    tint: "bg-amber-500/10 text-amber-400",
                  },
                  invest: {
                    icon: <TrendUp size={20} weight="duotone" />,
                    tint: "bg-blue-500/10 text-blue-400",
                  },
                };
                const config = typeConfig[t.type] || {
                  icon: <Receipt size={20} weight="duotone" />,
                  tint: "bg-white/5 text-zinc-400",
                };

                return (
                  <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: idx * 0.03 }}
                    data-testid={`tx-${t.id}`}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-white/5 bg-[#0C0C0C] p-4 transition-colors hover:border-white/15"
                  >
                    {/* Icon + Type */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${config.tint}`}>
                        {config.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-semibold capitalize">{t.type}</div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-zinc-500 font-mono">
                          {t.asset && <span>{t.asset}</span>}
                          {t.asset && <span className="h-1 w-1 rounded-full bg-zinc-700" />}
                          <span className="truncate">
                            {new Date(t.created_at).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Amount + Status */}
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <div className="text-right">
                        <div className="font-mono text-base font-semibold">
                          {money(t.amount_usd)}
                        </div>
                      </div>
                      <StatusBadge status={t.status} />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
}