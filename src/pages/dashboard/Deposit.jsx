import { useEffect, useState } from "react";
import { http, money, fmtError } from "@/lib/api";
import { toast } from "sonner";
import {
  ArrowDownLeft,
  CheckCircle,
  Clock,
  Coins,
  Copy,
  QrCode,
  Receipt,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { StatusBadge } from "@/pages/dashboard/Overview";

const ASSETS = [
  { id: "BTC", name: "Bitcoin", network: "BTC · Native", symbol: "₿", tint: "bg-orange-500/10 text-orange-400" },
  { id: "ETH", name: "Ethereum", network: "ERC-20", symbol: "Ξ", tint: "bg-indigo-500/10 text-indigo-400" },
  { id: "USDT", name: "Tether", network: "TRC-20", symbol: "₮", tint: "bg-emerald-500/10 text-emerald-400" },
];

const assetMeta = (id) =>
  ASSETS.find((a) => a.id === id) || { symbol: "•", tint: "bg-white/5 text-zinc-400" };

export default function Deposit() {
  const [wallets, setWallets] = useState({});
  const [asset, setAsset] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const load = async () => {
    const [w, d] = await Promise.all([http.get("/deposits/wallets"), http.get("/deposits")]);
    setWallets(w.data);
    setDeposits(d.data);
  };
  useEffect(() => { load(); }, []);

  const copy = () => {
    navigator.clipboard.writeText(wallets[asset] || "");
    setCopied(true);
    toast.success("Address copied");
    setTimeout(() => setCopied(false), 1500);
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await http.post("/deposits", {
        asset,
        amount_usd: parseFloat(amount),
        tx_hash: txHash,
      });
      toast.success("Deposit submitted. Awaiting admin approval.");
      setAmount("");
      setTxHash("");
      load();
    } catch (e) {
      toast.error(fmtError(e.response?.data?.detail) || "Failed");
    } finally {
      setLoading(false);
    }
  };

  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&bgcolor=0F0F0F&color=C8102E&data=${encodeURIComponent(wallets[asset] || "")}`;
  const meta = assetMeta(asset);

  return (
    <div className="space-y-6 md:space-y-8" data-testid="page-deposit">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl md:text-5xl tracking-tight">Deposit</h1>
        <p className="text-zinc-400 mt-2 text-sm md:text-base">
          Fund your account with crypto — confirmed on-chain.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Asset + wallet card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 rounded-3xl border border-white/5 bg-[#101010] p-5 md:p-6 space-y-8"
        >
          {/* Choose asset */}
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8102E]/10 text-[#C8102E]">
                <Coins size={20} weight="duotone" />
              </div>
              <div className="text-sm uppercase tracking-widest text-zinc-400 font-mono font-semibold">
                Choose asset
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
              {ASSETS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAsset(a.id)}
                  data-testid={`asset-btn-${a.id}`}
                  className={`relative rounded-2xl border p-4 text-left transition-all ${asset === a.id
                    ? "border-[#C8102E] bg-[#C8102E]/10"
                    : "border-white/5 bg-[#0C0C0C] hover:border-white/20"
                    }`}
                >
                  {asset === a.id && (
                    <span className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#C8102E] text-white">
                      <CheckCircle size={12} weight="bold" />
                    </span>
                  )}
                  <div className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl text-xl font-mono font-bold ${a.tint}`}>
                    {a.symbol}
                  </div>
                  <div className="font-mono font-bold text-lg">{a.id}</div>
                  <div className="text-xs text-zinc-500">{a.name}</div>
                  <div className="mt-1 text-[10px] text-zinc-600 font-mono">{a.network}</div>
                </button>
              ))}
            </div>
          </div>

          {/* QR + address */}
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="shrink-0 rounded-2xl border border-white/10 bg-[#0F0F0F] p-3">
              {wallets[asset] ? (
                <img src={qr} alt="QR" className="rounded-xl" width={180} height={180} />
              ) : (
                <div className="flex h-[180px] w-[180px] items-center justify-center rounded-xl bg-white/5 text-zinc-600">
                  <QrCode size={40} weight="light" />
                </div>
              )}
            </div>

            <div className="w-full min-w-0 flex-1">
              <div className="mb-2 text-xs uppercase tracking-widest text-zinc-500 font-mono">
                {asset} wallet address
              </div>
              <div
                className="rounded-xl border border-white/10 bg-[#050505] p-4 font-mono text-sm break-all"
                data-testid="deposit-wallet-address"
              >
                {wallets[asset]}
              </div>

              <button
                onClick={copy}
                data-testid="copy-address-btn"
                className={`mt-3 inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors ${copied
                  ? "border-green-500/40 bg-green-500/10 text-green-400"
                  : "border-white/10 bg-white/5 hover:border-[#C8102E] hover:text-[#C8102E]"
                  }`}
              >
                {copied ? <CheckCircle size={16} weight="fill" /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy address"}
              </button>

              <div className="mt-4 flex items-start gap-2 text-xs text-zinc-500 leading-relaxed">
                <Clock size={14} weight="bold" className="mt-0.5 shrink-0 text-zinc-600" />
                Send only {asset} to this address. After sending, submit the transaction hash to credit your account.
              </div>
            </div>
          </div>
        </motion.div>

        {/* Confirm deposit form */}
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-3xl border border-white/5 bg-[#101010] p-5 md:p-6 space-y-5 h-fit"
          data-testid="deposit-form"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8102E]/10 text-[#C8102E]">
              <ArrowDownLeft size={20} weight="duotone" />
            </div>
            <div className="text-sm uppercase tracking-widest text-zinc-400 font-mono font-semibold">
              Confirm deposit
            </div>
          </div>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-widest text-zinc-500 font-mono">
              Amount (USD)
            </span>
            <input
              type="number"
              step="0.01"
              min="10"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              data-testid="deposit-amount-input"
              className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 font-mono outline-none transition-colors focus:border-[#C8102E]"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs uppercase tracking-widest text-zinc-500 font-mono">
              Transaction hash
            </span>
            <input
              type="text"
              required
              minLength={6}
              value={txHash}
              onChange={(e) => setTxHash(e.target.value)}
              placeholder="0x..."
              data-testid="deposit-txhash-input"
              className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 font-mono text-sm outline-none transition-colors focus:border-[#C8102E] placeholder:text-zinc-700"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            data-testid="deposit-submit-btn"
            className="w-full rounded-xl bg-[#C8102E] py-3.5 font-semibold text-white transition-colors hover:bg-[#E01B3D] disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit deposit"}
          </button>

          <div className="flex items-start gap-2 text-xs text-zinc-500 leading-relaxed">
            <Clock size={14} weight="bold" className="mt-0.5 shrink-0 text-zinc-600" />
            Deposits are typically approved within 15 minutes after network confirmations.
          </div>
        </motion.form>
      </div>

      {/* Deposit history */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-3xl border border-white/5 bg-[#101010] p-5 md:p-6"
        data-testid="deposit-history"
      >
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-zinc-400">
            <Receipt size={20} weight="duotone" />
          </div>
          <div className="text-sm uppercase tracking-widest text-zinc-400 font-mono font-semibold">
            Deposit history
          </div>
        </div>

        {deposits.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 py-10 text-center">
            <div className="mb-3 flex justify-center text-zinc-600">
            </div>
            <div className="text-sm text-zinc-500">No deposits yet.</div>
          </div>
        ) : (
          <div className="space-y-2">
            {deposits.map((d) => {
              const m = assetMeta(d.asset);
              return (
                <div
                  key={d.id}
                  data-testid={`deposit-row-${d.id}`}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-white/5 bg-[#0C0C0C] p-4 transition-colors hover:border-white/15"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-mono font-bold ${m.tint}`}>
                      {m.symbol}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold">
                        {d.asset}
                        <span className="ml-2 font-mono text-xs text-zinc-500">{money(d.amount_usd)}</span>
                      </div>
                      <div className="mt-0.5 text-xs text-zinc-500 font-mono">
                        {new Date(d.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 min-w-0">
                    <div
                      className="font-mono text-xs text-zinc-500 truncate max-w-[140px] md:max-w-[220px]"
                      title={d.tx_hash}
                    >
                      {d.tx_hash}
                    </div>
                    <StatusBadge status={d.status} />
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