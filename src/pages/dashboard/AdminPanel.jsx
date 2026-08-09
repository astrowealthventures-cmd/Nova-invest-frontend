import { useEffect, useState } from "react";
import { http, money } from "@/lib/api";
import { toast } from "sonner";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Check,
  Image as ImageIcon,
  ShieldStar,
  X,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { StatusBadge } from "@/pages/dashboard/Overview";

const ASSET_META = {
  BTC: { symbol: "₿", tint: "bg-orange-500/10 text-orange-400" },
  ETH: { symbol: "Ξ", tint: "bg-indigo-500/10 text-indigo-400" },
  USDT: { symbol: "₮", tint: "bg-emerald-500/10 text-emerald-400" },
};

const assetMeta = (id) =>
  ASSET_META[id] || { symbol: "•", tint: "bg-white/5 text-zinc-400" };

export default function AdminPanel() {
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [previewUrl, setPreviewUrl] = useState(null);

  const load = async () => {
    const [d, w] = await Promise.all([http.get("/deposits"), http.get("/withdrawals")]);
    setDeposits(d.data);
    setWithdrawals(w.data);
  };
  useEffect(() => { load(); }, []);

  const act = async (id, action) => {
    try {
      await http.post(`/admin/deposits/${id}`, { action });
      toast.success(`Deposit ${action}d`);
      load();
    } catch (e) {
      toast.error("Failed");
    }
  };

  const pendingCount = deposits.filter((d) => d.status === "pending").length;

  return (
    <div className="space-y-6 md:space-y-8" data-testid="page-admin">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C8102E]/10 text-[#C8102E]">
            <ShieldStar size={24} weight="duotone" />
          </div>
          <div>
            <h1 className="font-display font-bold text-3xl md:text-5xl tracking-tight">Admin Panel</h1>
            <p className="text-zinc-400 mt-1 text-sm md:text-base">
              Approve pending deposits and view platform activity.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Pending deposits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-3xl border border-white/5 bg-[#101010] p-5 md:p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
              <ArrowDownLeft size={20} weight="duotone" />
            </div>
            <div className="text-sm uppercase tracking-widest text-zinc-400 font-mono font-semibold">
              Deposits
            </div>
          </div>
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-mono font-semibold text-amber-400">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              {pendingCount} pending
            </span>
          )}
        </div>

        {deposits.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 py-10 text-center">
            <div className="mb-3 flex justify-center text-zinc-600">

            </div>
            <div className="text-sm text-zinc-500">No deposits.</div>
          </div>
        ) : (
          <div className="space-y-2">
            {deposits.map((d) => {
              const m = assetMeta(d.asset);
              const receiptUrl = d.receipt_url || d.proof_url;
              return (
                <div
                  key={d.id}
                  data-testid={`admin-deposit-${d.id}`}
                  className="flex flex-col lg:flex-row lg:items-center gap-4 rounded-2xl border border-white/5 bg-[#0C0C0C] p-4 transition-colors hover:border-white/15"
                >
                  {/* Asset + user */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-mono font-bold ${m.tint}`}>
                      {m.symbol}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">
                        {d.asset}
                        <span className="ml-2 font-mono text-xs text-zinc-500">{money(d.amount_usd)}</span>
                      </div>
                      <div className="mt-0.5 text-xs text-zinc-500 font-mono truncate">
                        {new Date(d.created_at).toLocaleDateString()} · user {d.user_id.slice(0, 8)}…
                      </div>
                    </div>
                  </div>

                  {/* Receipt screenshot thumbnail */}
                  {receiptUrl ? (
                    <button
                      type="button"
                      onClick={() => setPreviewUrl(receiptUrl)}
                      data-testid={`admin-receipt-thumb-${d.id}`}
                      className="shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A] transition-colors hover:border-[#C8102E]"
                      title="View screenshot"
                    >
                      <img
                        src={receiptUrl}
                        alt="Deposit receipt"
                        className="h-16 w-24 object-cover"
                      />
                    </button>
                  ) : (
                    <div className="flex h-16 w-24 shrink-0 items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#0A0A0A] text-zinc-700">
                      <ImageIcon size={20} weight="light" />
                    </div>
                  )}

                  {/* Hash + status + actions */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div
                      className="font-mono text-xs text-zinc-500 truncate max-w-[140px] md:max-w-[180px]"
                      title={d.tx_hash}
                    >
                      {d.tx_hash}
                    </div>
                    <StatusBadge status={d.status} />

                    {d.status === "pending" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => act(d.id, "approve")}
                          data-testid={`admin-approve-${d.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-green-500/30 bg-green-500/15 px-3 py-1.5 text-xs font-semibold text-green-400 transition-colors hover:bg-green-500/25"
                        >
                          <Check size={14} weight="bold" />
                          Approve
                        </button>
                        <button
                          onClick={() => act(d.id, "reject")}
                          data-testid={`admin-reject-${d.id}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-[#FF3B30]/30 bg-[#FF3B30]/10 px-3 py-1.5 text-xs font-semibold text-[#FF3B30] transition-colors hover:bg-[#FF3B30]/20"
                        >
                          <X size={14} weight="bold" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* All withdrawals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-3xl border border-white/5 bg-[#101010] p-5 md:p-6"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
            <ArrowUpRight size={20} weight="duotone" />
          </div>
          <div className="text-sm uppercase tracking-widest text-zinc-400 font-mono font-semibold">
            All withdrawals
          </div>
        </div>

        {withdrawals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 py-10 text-center">
            <div className="mb-3 flex justify-center text-zinc-600">

            </div>
            <div className="text-sm text-zinc-500">No withdrawals.</div>
          </div>
        ) : (
          <div className="space-y-2">
            {withdrawals.map((w) => {
              const m = assetMeta(w.asset);
              return (
                <div
                  key={w.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-white/5 bg-[#0C0C0C] p-4 transition-colors hover:border-white/15"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-mono font-bold ${m.tint}`}>
                      {m.symbol}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">
                        {w.asset}
                        <span className="ml-2 font-mono text-xs text-zinc-500">{money(w.amount_usd)}</span>
                      </div>
                      <div className="mt-0.5 text-xs text-zinc-500 font-mono">
                        {new Date(w.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 min-w-0">
                    <div
                      className="font-mono text-xs text-zinc-500 truncate max-w-[140px] md:max-w-[220px]"
                      title={w.wallet_address}
                    >
                      {w.wallet_address}
                    </div>
                    <StatusBadge status={w.status} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Full-size receipt preview modal */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setPreviewUrl(null)}
        >
          <div className="relative max-h-[85vh] max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute -top-10 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#C8102E]"
              aria-label="Close preview"
            >
              <X size={18} weight="bold" />
            </button>
            <img
              src={previewUrl}
              alt="Deposit receipt full size"
              className="max-h-[85vh] w-auto rounded-2xl border border-white/10 object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}