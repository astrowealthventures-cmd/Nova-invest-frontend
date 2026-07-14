import { useEffect, useState } from "react";
import { http, money } from "@/lib/api";
import { toast } from "sonner";
import { StatusBadge } from "@/pages/dashboard/Overview";

export default function AdminPanel() {
  const [deposits, setDeposits] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

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

  return (
    <div className="space-y-8" data-testid="page-admin">
      <div>
        <h1 className="font-display font-bold text-4xl tracking-tight">Admin Panel</h1>
        <p className="text-zinc-400 mt-2">Approve pending deposits and view platform activity.</p>
      </div>

      <div className="hairline bg-[#0F0F0F] p-6">
        <div className="text-xs uppercase tracking-widest text-zinc-500 font-mono mb-4">◆ Pending deposits</div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-widest text-zinc-500 font-mono">
              <th className="pb-3">Date</th>
              <th className="pb-3">User</th>
              <th className="pb-3">Asset</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">TX Hash</th>
              <th className="pb-3">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody className="font-mono">
            {deposits.map((d) => (
              <tr key={d.id} className="border-t border-white/5" data-testid={`admin-deposit-${d.id}`}>
                <td className="py-3 text-zinc-400">{new Date(d.created_at).toLocaleDateString()}</td>
                <td className="py-3 text-xs truncate max-w-[120px]">{d.user_id.slice(0, 8)}…</td>
                <td className="py-3">{d.asset}</td>
                <td className="py-3">{money(d.amount_usd)}</td>
                <td className="py-3 text-zinc-400 truncate max-w-[150px]">{d.tx_hash}</td>
                <td className="py-3"><StatusBadge status={d.status} /></td>
                <td className="py-3">
                  {d.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => act(d.id, "approve")}
                        data-testid={`admin-approve-${d.id}`}
                        className="px-3 py-1 bg-[#F0A83E] text-black text-xs font-semibold hover:bg-[#FFBC5C]"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => act(d.id, "reject")}
                        data-testid={`admin-reject-${d.id}`}
                        className="px-3 py-1 border border-[#FF3B30]/40 text-[#FF3B30] text-xs hover:bg-[#FF3B30]/10"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {deposits.length === 0 && (
          <div className="py-8 text-center text-sm text-zinc-500">No deposits.</div>
        )}
      </div>

      <div className="hairline bg-[#0F0F0F] p-6">
        <div className="text-xs uppercase tracking-widest text-zinc-500 font-mono mb-4">◆ All withdrawals</div>
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
              <tr key={w.id} className="border-t border-white/5">
                <td className="py-3 text-zinc-400">{new Date(w.created_at).toLocaleDateString()}</td>
                <td className="py-3">{w.asset}</td>
                <td className="py-3">{money(w.amount_usd)}</td>
                <td className="py-3 text-zinc-400 truncate max-w-[200px]">{w.wallet_address}</td>
                <td className="py-3"><StatusBadge status={w.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
        {withdrawals.length === 0 && (
          <div className="py-8 text-center text-sm text-zinc-500">No withdrawals.</div>
        )}
      </div>
    </div>
  );
}
