import { useEffect, useState } from "react";
import { http, money, fmtError } from "@/lib/api";
import { toast } from "sonner";
import { Check } from "@phosphor-icons/react";

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [balance, setBalance] = useState(0);
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    const [p, s] = await Promise.all([http.get("/plans"), http.get("/portfolio/summary")]);
    setPlans(p.data);
    setBalance(s.data.balance);
  };
  useEffect(() => {
    load();
  }, []);

  const invest = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await http.post("/investments", {
        plan_id: selected.id,
        amount_usd: parseFloat(amount),
      });
      toast.success(`Invested ${money(amount)} in ${selected.name}`);
      setSelected(null);
      setAmount("");
      load();
    } catch (e) {
      toast.error(fmtError(e.response?.data?.detail) || "Investment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8" data-testid="page-plans">
      <div>
        <h1 className="font-display font-bold text-4xl tracking-tight">Investment Plans</h1>
        <p className="text-zinc-400 mt-2">
          Available balance:{" "}
          <span className="font-mono text-white" data-testid="plans-available-balance">{money(balance)}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {plans.map((p) => (
          <div
            key={p.id}
            data-testid={`plan-card-${p.id}`}
            className={`relative p-6 hairline bg-[#0F0F0F] flex flex-col ${
              p.highlight ? "border-[#C8102E]/50 shadow-[0_0_60px_-20px_rgba(200,16,46,0.5)]" : ""
            }`}
          >
            {p.highlight && (
              <div className="absolute -top-3 left-6 bg-[#C8102E] text-white text-[10px] font-mono font-bold px-2 py-1">
                MOST POPULAR
              </div>
            )}
            <div className="font-display font-bold text-2xl">{p.name}</div>
            <div className="text-xs text-zinc-500 mt-1">{p.tagline}</div>

            <div className="mt-6 flex items-baseline gap-1">
              <span className="font-display font-bold text-4xl text-[#C8102E]">{p.daily_roi}%</span>
              <span className="text-zinc-500 text-sm">/ day</span>
            </div>

            <ul className="mt-6 space-y-2 text-sm text-zinc-300 flex-1">
              <Li>Min: {money(p.min_deposit)}</Li>
              <Li>Max: {money(p.max_deposit)}</Li>
              <Li>Duration: {p.duration_days} days</Li>
              <Li accent>Total ROI: {(p.daily_roi * p.duration_days).toFixed(1)}%</Li>
            </ul>

            <button
              onClick={() => setSelected(p)}
              data-testid={`plan-invest-btn-${p.id}`}
              className={`mt-6 py-3 font-semibold transition-colors ${
                p.highlight
                  ? "bg-[#C8102E] text-white hover:bg-[#E01B3D] glow-btn"
                  : "border border-white/15 hover:border-[#C8102E] hover:text-[#C8102E]"
              }`}
            >
              Invest now
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)} data-testid="invest-modal">
          <div className="bg-[#0F0F0F] hairline max-w-md w-full p-8" onClick={(e) => e.stopPropagation()}>
            <div className="text-xs uppercase tracking-widest text-[#C8102E] font-mono">◆ Confirm investment</div>
            <div className="font-display font-bold text-3xl mt-2">{selected.name}</div>
            <div className="text-sm text-zinc-400 mt-1">{selected.daily_roi}% daily · {selected.duration_days} days</div>

            <form onSubmit={invest} className="mt-6 space-y-4">
              <label className="block">
                <span className="block text-xs uppercase tracking-widest text-zinc-500 font-mono mb-2">
                  Amount (USD)
                </span>
                <input
                  type="number"
                  min={selected.min_deposit}
                  max={selected.max_deposit}
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={`${selected.min_deposit} – ${selected.max_deposit}`}
                  data-testid="invest-amount-input"
                  className="w-full bg-[#050505] border border-white/10 px-4 py-3 outline-none focus:border-[#C8102E] font-mono"
                />
                <div className="text-xs text-zinc-500 mt-1 font-mono">Balance: {money(balance)}</div>
              </label>

              {amount && parseFloat(amount) >= selected.min_deposit && (
                <div className="p-4 border border-white/10 bg-[#C8102E]/5 text-sm">
                  <div className="flex justify-between font-mono">
                    <span className="text-zinc-400">Daily earnings</span>
                    <span className="text-[#C8102E]">+{money((parseFloat(amount) * selected.daily_roi) / 100)}</span>
                  </div>
                  <div className="flex justify-between font-mono mt-1">
                    <span className="text-zinc-400">Total earnings</span>
                    <span className="text-[#C8102E]">+{money((parseFloat(amount) * selected.daily_roi * selected.duration_days) / 100)}</span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="flex-1 border border-white/15 py-3 hover:border-white/40 transition-colors"
                  data-testid="invest-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  data-testid="invest-confirm-btn"
                  className="flex-1 bg-[#C8102E] text-white font-semibold py-3 hover:bg-[#E01B3D] transition-colors disabled:opacity-50"
                >
                  {loading ? "Investing..." : "Confirm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function Li({ children, accent }) {
  return (
    <li className={`flex items-center gap-2 ${accent ? "text-[#C8102E] font-semibold" : ""}`}>
      <Check size={14} weight="bold" className={accent ? "text-[#C8102E]" : "text-zinc-500"} />
      {children}
    </li>
  );
}
