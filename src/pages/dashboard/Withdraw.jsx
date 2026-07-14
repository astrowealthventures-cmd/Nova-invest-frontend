import { useEffect, useState } from "react";
import { http, money, fmtError } from "@/lib/api";
import { toast } from "sonner";
import { StatusBadge } from "@/pages/dashboard/Overview";

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
    <div className="space-y-8" data-testid="page-withdraw">
      <div>
        <h1 className="font-display font-bold text-4xl tracking-tight">Withdraw</h1>
        <p className="text-zinc-400 mt-2">Send funds to your external wallet. Processed within 24 hours.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="hairline bg-[#0F0F0F] p-6">
          <div className="text-xs uppercase tracking-widest text-zinc-500 font-mono">Available balance</div>
          <div className="font-mono font-bold text-5xl mt-2" data-testid="withdraw-available-balance">{money(balance)}</div>
          <button
            type="button"
            onClick={() => setAmount(String(balance))}
            className="mt-4 text-xs text-[#F0A83E] hover:underline font-mono"
            data-testid="withdraw-max-btn"
          >
            Withdraw max →
          </button>
        </div>

        <form onSubmit={submit} className="hairline bg-[#0F0F0F] p-6 space-y-5" data-testid="withdraw-form">
          <label className="block">
            <span className="block text-xs uppercase tracking-widest text-zinc-500 font-mono mb-2">Asset</span>
            <select
              value={asset}
              onChange={(e) => setAsset(e.target.value)}
              data-testid="withdraw-asset-select"
              className="w-full bg-[#050505] border border-white/10 px-4 py-3 outline-none focus:border-[#F0A83E] font-mono"
            >
              <option value="BTC">BTC — Bitcoin</option>
              <option value="ETH">ETH — Ethereum (ERC-20)</option>
              <option value="USDT">USDT — Tether (TRC-20)</option>
            </select>
          </label>
          <label className="block">
            <span className="block text-xs uppercase tracking-widest text-zinc-500 font-mono mb-2">Amount (USD)</span>
            <input
              type="number"
              step="0.01"
              min="1"
              max={balance}
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              data-testid="withdraw-amount-input"
              className="w-full bg-[#050505] border border-white/10 px-4 py-3 outline-none focus:border-[#F0A83E] font-mono"
            />
          </label>
          <label className="block">
            <span className="block text-xs uppercase tracking-widest text-zinc-500 font-mono mb-2">Destination wallet</span>
            <input
              type="text"
              required
              minLength={6}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={asset === "BTC" ? "bc1..." : asset === "ETH" ? "0x..." : "T..."}
              data-testid="withdraw-address-input"
              className="w-full bg-[#050505] border border-white/10 px-4 py-3 outline-none focus:border-[#F0A83E] font-mono text-sm"
            />
          </label>
          <button
            type="submit"
            disabled={loading || balance <= 0}
            data-testid="withdraw-submit-btn"
            className="w-full bg-[#F0A83E] text-black font-semibold py-3 hover:bg-[#FFBC5C] transition-colors disabled:opacity-50 glow-btn"
          >
            {loading ? "Submitting..." : "Request withdrawal"}
          </button>
        </form>
      </div>

      <div className="hairline bg-[#0F0F0F] p-6" data-testid="withdraw-history">
        <div className="text-xs uppercase tracking-widest text-zinc-500 font-mono mb-4">◆ Withdrawal history</div>
        {withdrawals.length === 0 ? (
          <div className="py-8 text-center text-sm text-zinc-500">No withdrawals yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-zinc-500 font-mono">
                <th className="pb-3">Date</th>
                <th className="pb-3">Asset</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Address</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {withdrawals.map((w) => (
                <tr key={w.id} className="border-t border-white/5" data-testid={`withdraw-row-${w.id}`}>
                  <td className="py-3 text-zinc-400">{new Date(w.created_at).toLocaleDateString()}</td>
                  <td className="py-3">{w.asset}</td>
                  <td className="py-3">{money(w.amount_usd)}</td>
                  <td className="py-3 text-zinc-400 truncate max-w-[200px]">{w.wallet_address}</td>
                  <td className="py-3"><StatusBadge status={w.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
