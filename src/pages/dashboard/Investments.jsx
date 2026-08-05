import { useEffect, useState } from "react";
import { http, money } from "@/lib/api";
import { StatusBadge } from "@/pages/dashboard/Overview";
import { Link } from "react-router-dom";
import {
  Plus,
  Rocket,
  ChartLineUp,
  Lightning,
  Coins,
  Clock,
  CheckCircle,
  Target,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";

export default function Investments() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    http.get("/investments").then(({ data }) => setItems(data));
  }, []);

  return (
    <div className="space-y-6 md:space-y-8" data-testid="page-investments">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
      >
        <div>
          <h1 className="font-display font-bold text-3xl md:text-5xl tracking-tight">
            Investments
          </h1>
          <p className="text-zinc-400 mt-2 text-sm md:text-base">
            All your active and completed positions.
          </p>
        </div>
        <Link
          to="/dashboard/plans"
          data-testid="investments-new-btn"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C8102E] px-5 py-3 font-semibold text-white transition-colors hover:bg-[#E01B3D]"
        >
          <Plus size={18} weight="bold" />
          New investment
        </Link>
      </motion.div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-3xl border border-dashed border-white/10 bg-[#101010] p-12 md:p-16 text-center"
        >
          <div className="mb-4 flex justify-center text-zinc-600">
            <Rocket size={56} weight="light" />
          </div>
          <div className="text-lg font-semibold text-zinc-300 mb-2">
            No investments yet
          </div>
          <div className="text-sm text-zinc-500 mb-6">
            Start building wealth with one of our curated strategies.
          </div>
          <Link
            to="/dashboard/plans"
            className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-5 py-3 text-sm font-semibold transition-colors hover:border-white/30"
          >
            <Target size={18} weight="duotone" />
            Explore plans
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {items.map((inv, idx) => (
            <motion.div
              key={inv.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              data-testid={`investment-${inv.id}`}
              className="rounded-3xl border border-white/5 bg-[#101010] p-5 md:p-6 transition-colors hover:border-white/15"
            >
              {/* Header row */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#C8102E]/10 text-[#C8102E]">
                    <Rocket size={24} weight="duotone" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-display font-bold text-xl md:text-2xl truncate">
                      {inv.plan_name}
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-zinc-500 font-mono">
                      <Clock size={12} weight="bold" />
                      Started {new Date(inv.started_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <StatusBadge status={inv.status} />
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-3 rounded-2xl border border-white/5 bg-[#0A0A0A] p-4 mb-5">
                <div className="text-center">
                  <div className="mb-2 flex justify-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                      <Coins size={16} weight="duotone" />
                    </div>
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono mb-1">
                    Principal
                  </div>
                  <div className="font-mono font-bold text-sm md:text-base">
                    {money(inv.amount_usd)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="mb-2 flex justify-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C8102E]/10 text-[#C8102E]">
                      <ChartLineUp size={16} weight="duotone" />
                    </div>
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono mb-1">
                    Earnings
                  </div>
                  <div className="font-mono font-bold text-sm md:text-base text-[#C8102E]">
                    +{money(inv.earnings)}
                  </div>
                </div>
                <div className="text-center">
                  <div className="mb-2 flex justify-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                      <Lightning size={16} weight="duotone" />
                    </div>
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono mb-1">
                    Daily ROI
                  </div>
                  <div className="font-mono font-bold text-sm md:text-base">
                    {inv.daily_roi}%
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-2">
                  <span className="flex items-center gap-1">
                    <Target size={12} weight="bold" />
                    Progress
                  </span>
                  <span>
                    {inv.progress_pct}% · Day {Math.floor(inv.days_elapsed)}/
                    {inv.duration_days}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, inv.progress_pct)}%` }}
                    transition={{ duration: 1, delay: idx * 0.08 + 0.3, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-[#C8102E] to-[#E01B3D]"
                  />
                </div>
                {inv.status === "completed" && (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-green-400 font-mono">
                    <CheckCircle size={14} weight="fill" />
                    Investment completed
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}