import { useEffect, useState } from "react";
import { http, money, fmtError } from "@/lib/api";
import { toast } from "sonner";
import {
  ArrowUpRight,
  CaretDown,
  Clock,
  Receipt,
  Wallet,
  Warning,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { StatusBadge } from "@/pages/dashboard/Overview";

const ASSETS = [
  { id: "BTC", label: "BTC — Bitcoin", symbol: "₿", tint: "bg-orange-500/10 text-orange-400" },
  { id: "ETH", label: "ETH — Ethereum (ERC-20)", symbol: "Ξ", tint: "bg-indigo-500/10 text-indigo-400" },
  { id: "USDT", label: "USDT — Tether (TRC-20)", symbol: "₮", tint: "bg-emerald-500/10 text-emerald-400" },
];

const assetMeta = (id) =>
  ASSETS.find((a) => a.id === id) || { symbol: "•", tint: "bg-white/5 text-zinc-400" };

export default function Withdraw() {
  const [balance, setBalance] = useState(0);
  const [withdrawals, setWithdrawals] = useState([]);
  const [asset, setAsset] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [s, w] = await Promise.all([http.get("/portfolio/summary"), http.get("/withdrawals")]);
    setBalance(s.data.balance);
    setWithdrawals(w.data);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await http.post("/withdrawals", {
        asset,
        amount_usd: parseFloat(amount),
        wallet_address: address,
      });
      toast.success("Withdrawal requested");
      setAmount("");
      setAddress("");
      load();
    } catch (e) {
      toast.error(fmtError(e.response?.data?.detail) || "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8" data-testid="page-withdraw">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl md:text-5xl tracking-tight">Withdraw</h1>
        <p className="text-zinc-400 mt-2 text-sm md:text-base">
          Send funds to your external wallet. Processed within 24 hours.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Available balance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#161616] to-[#0C0C0C] p-6 md:p-8"
        >
          <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#C8102E] to-transparent" />
          <div className="absolute -top-24 left-1/2 h-40 w-2/3 -translate-x-1/2 rounded-full bg-[#C8102E]/20 blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8102E]/15 text-[#C8102E]">
                <Wallet size={20} weight="duotone" />
              </div>
              <div className="text-xs uppercase tracking-[0.25em] text-zinc-400 font-mono">
                Available balance
              </div>
            </div>

            <div
              className="mt-5 font-mono text-4xl md:text-5xl font-bold tracking-tight"
              data-testid="withdraw-available-balance"
            >
              {money(balance)}
            </div>

            <button
              type="button"
              onClick={() => setAmount(String(balance))}
              data-testid="withdraw-max-btn"
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#C8102E]/30 bg-[#C8102E]/10 px-3 py-1.5 text-xs font-mono font-semibold text-[#C8102E] transition-colors hover:bg-[#C8102E]/20"
            >
              <ArrowUpRight size={12} weight="bold" />
              Withdraw max
            </button>

            <div className="mt-6 space-y-2 border-t border-white/5 pt-5">
              <div className="flex items-start gap-2 text-xs text-zinc-500 leading-relaxed">
                <Clock size={14} weight="bold" className="mt-0.5 shrink-0 text-zinc-600" />
                Withdrawals are processed within 24 hours.
              </div>
              <div className="flex items-start gap-2 text-xs text-zinc-500 leading-relaxed">
                <Warning size={14} weight="bold" className="mt-0.5 shrink-0 text-zinc-600" />
                Double-check the destination address and network before submitting.
              </div>
            </div>
          </div>
        </motion.div>

        {/* Withdraw form */}
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-3 rounded-3xl border border-white/5 bg-[#101010] p-5 md:p-6 space-y-5"
          data-testid="withdraw-form"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8102E]/10 text-[#C8102E]">
              <ArrowUpRight size={20} weight="duotone" />
            </div>
            <div className="text-sm uppercase tracking-widest text-zinc-400 font-mono font-semibold">
              Request withdrawal
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-widest text-zinc-500 font-mono">
                Asset
              </span>
              <div className="relative">
                <select
                  value={asset}
                  onChange={(e) => setAsset(e.target.value)}
                  data-testid="withdraw-asset-select"
                  className="w-full appearance-none rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 pr-10 font-mono outline-none transition-colors focus:border-[#C8102E]"
                >
                  {ASSETS.map((a) => (
                    <option key={a.id} value={a.id}>{a.label}</option>
                  ))}
                </select>
                <CaretDown
                  size={16}
                  weight="bold"
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500"
                />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs uppercase tracking-widest text-zinc-500 font-mono">
                Amount (USD)
              </span>
              <input
                type="number"
                step="0.01"
                min="1"
                max={balance}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                data-testid="withdraw-amount-input"
                className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 font-mono outline-none transition-colors focus:border-[#C8102E]"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-widest text-zinc-500 font-mono">
              Destination wallet
            </span>
            <input
              type="text"
              required
              minLength={6}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={asset === "BTC" ? "bc1..." : asset === "ETH" ? "0x..." : "T..."}
              data-testid="withdraw-address-input"
              className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 font-mono text-sm outline-none transition-colors focus:border-[#C8102E] placeholder:text-zinc-700"
            />
          </label>

          <button
            type="submit"
            disabled={loading || balance <= 0}
            data-testid="withdraw-submit-btn"
            className="w-full rounded-xl bg-[#C8102E] py-3.5 font-semibold text-white transition-colors hover:bg-[#E01B3D] disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Request withdrawal"}
          </button>
        </motion.form>
      </div>

      {/* Withdrawal history */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl border border-white/5 bg-[#101010] p-5 md:p-6"
        data-testid="withdraw-history"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-zinc-400">
            <Receipt size={20} weight="duotone" />
          </div>
          <div className="text-sm uppercase tracking-widest text-zinc-400 font-mono font-semibold">
            Withdrawal history
          </div>
        </div>

        {withdrawals.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 py-10 text-center">
            <div className="mb-3 flex justify-center text-zinc-600">

            </div>
            <div className="text-sm text-zinc-500">No withdrawals yet.</div>
          </div>
        ) : (
          <div className="space-y-2">
            {withdrawals.map((w) => {
              const m = assetMeta(w.asset);
              return (
                <div
                  key={w.id}
                  data-testid={`withdraw-row-${w.id}`}
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
    </div>
  );
}