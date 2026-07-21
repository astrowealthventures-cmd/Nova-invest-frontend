import { useEffect, useState } from "react";
import { http, money } from "@/lib/api";
import { StatusBadge } from "@/pages/dashboard/Overview";
import { ArrowDownRight, ArrowUpRight, TrendUp } from "@phosphor-icons/react";

export default function Transactions() {
  const [txs, setTxs] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    http.get("/transactions").then(({ data }) => setTxs(data));
  }, []);

  const filtered = filter === "all" ? txs : txs.filter((t) => t.type === filter);

  return (
    <div className="space-y-8" data-testid="page-transactions">
      <div>
        <h1 className="font-display font-bold text-4xl tracking-tight">Transactions</h1>
        <p className="text-zinc-400 mt-2">All account activity, on-chain and off.</p>
      </div>

      <div className="flex gap-2">
        {[
          ["all", "All"],
          ["deposit", "Deposits"],
          ["withdraw", "Withdrawals"],
          ["invest", "Investments"],
        ].map(([k, v]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            data-testid={`filter-${k}`}
            className={`px-4 py-2 text-sm border transition-colors font-mono ${
              filter === k
                ? "bg-[#C8102E] text-white border-[#C8102E]"
                : "border-white/10 hover:border-white/30 text-zinc-300"
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="hairline bg-[#0F0F0F] overflow-hidden" data-testid="transactions-table">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-zinc-500">No transactions match.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-zinc-500 font-mono border-b border-white/5">
                <th className="p-4">Type</th>
                <th className="p-4">Asset</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr key={t.id} className="border-b border-white/5 last:border-b-0 hover:bg-white/2 transition-colors" data-testid={`tx-${t.id}`}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {t.type === "deposit" && <ArrowDownRight size={18} className="text-[#C8102E]" />}
                      {t.type === "withdraw" && <ArrowUpRight size={18} className="text-[#FF9500]" />}
                      {t.type === "invest" && <TrendUp size={18} className="text-blue-400" />}
                      <span className="capitalize">{t.type}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono">{t.asset}</td>
                  <td className="p-4 font-mono font-semibold">{money(t.amount_usd)}</td>
                  <td className="p-4"><StatusBadge status={t.status} /></td>
                  <td className="p-4 text-zinc-400 font-mono text-xs">{new Date(t.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
