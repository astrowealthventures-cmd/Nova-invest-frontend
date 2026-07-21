import { useEffect, useState } from "react";
import { http, money } from "@/lib/api";
import { StatusBadge } from "@/pages/dashboard/Overview";
import { Link } from "react-router-dom";

export default function Investments() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    http.get("/investments").then(({ data }) => setItems(data));
  }, []);

  return (
    <div className="space-y-8" data-testid="page-investments">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display font-bold text-4xl tracking-tight">Investments</h1>
          <p className="text-zinc-400 mt-2">All your active and completed positions.</p>
        </div>
        <Link
          to="/dashboard/plans"
          data-testid="investments-new-btn"
          className="bg-[#C8102E] text-white font-semibold px-4 py-2.5 hover:bg-[#E01B3D] transition-colors glow-btn"
        >
          + New investment
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="hairline bg-[#0F0F0F] p-16 text-center">
          <div className="text-zinc-400">You don't have any investments yet.</div>
          <Link to="/dashboard/plans" className="mt-4 inline-block text-[#C8102E] hover:underline font-mono text-sm">
            Explore plans →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((inv) => (
            <div key={inv.id} className="hairline bg-[#0F0F0F] p-6" data-testid={`investment-${inv.id}`}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="font-display font-bold text-2xl">{inv.plan_name}</div>
                  <div className="text-xs text-zinc-500 font-mono mt-1">
                    Started {new Date(inv.started_at).toLocaleDateString()}
                  </div>
                </div>
                <StatusBadge status={inv.status} />
              </div>
              <div className="grid grid-cols-3 gap-4 text-center py-4 border-y border-white/5">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Principal</div>
                  <div className="font-mono font-bold mt-1">{money(inv.amount_usd)}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Earnings</div>
                  <div className="font-mono font-bold mt-1 text-[#C8102E]">+{money(inv.earnings)}</div>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-mono">Daily ROI</div>
                  <div className="font-mono font-bold mt-1">{inv.daily_roi}%</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-1">
                  <span>Progress</span>
                  <span>{inv.progress_pct}% · Day {Math.floor(inv.days_elapsed)}/{inv.duration_days}</span>
                </div>
                <div className="h-1.5 bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-[#C8102E] transition-all"
                    style={{ width: `${Math.min(100, inv.progress_pct)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
