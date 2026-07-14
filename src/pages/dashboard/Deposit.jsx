import { useEffect, useState } from "react";
import { http, money, fmtError } from "@/lib/api";
import { toast } from "sonner";
import { Copy, CheckCircle } from "@phosphor-icons/react";
import { StatusBadge } from "@/pages/dashboard/Overview";

const ASSETS = [
  { id: "BTC", name: "Bitcoin", network: "BTC · Native" },
  { id: "ETH", name: "Ethereum", network: "ERC-20" },
  { id: "USDT", name: "Tether", network: "TRC-20" },
];

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

  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&bgcolor=0F0F0F&color=00C805&data=${encodeURIComponent(wallets[asset] || "")}`;

  return (
    <div className="space-y-8" data-testid="page-deposit">
      <div>
        <h1 className="font-display font-bold text-4xl tracking-tight">Deposit</h1>
        <p className="text-zinc-400 mt-2">Fund your account with crypto — confirmed on-chain.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 hairline bg-[#0F0F0F] p-6">
          <div className="text-xs uppercase tracking-widest text-zinc-500 font-mono mb-4">
            ◆ Choose asset
          </div>
          <div className="grid grid-cols-3 gap-2">
            {ASSETS.map((a) => (
              <button
                key={a.id}
                onClick={() => setAsset(a.id)}
                data-testid={`asset-btn-${a.id}`}
                className={`p-4 border transition-all text-left ${
                  asset === a.id
                    ? "border-[#F0A83E] bg-[#F0A83E]/10"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <div className="font-mono font-bold text-lg">{a.id}</div>
                <div className="text-xs text-zinc-500">{a.name}</div>
                <div className="text-[10px] text-zinc-600 font-mono mt-1">{a.network}</div>
              </button>
            ))}
          </div>

          <div className="mt-8 flex flex-col md:flex-row gap-6 items-start">
            <div className="w-full md:w-auto flex justify-center">
              <img src={qr} alt="QR" className="border border-white/10 p-2 bg-[#0F0F0F]" width={200} height={200} />
            </div>
            <div className="flex-1 w-full">
              <div className="text-xs uppercase tracking-widest text-zinc-500 font-mono mb-2">
                {asset} Wallet Address
              </div>
              <div className="p-4 border border-white/10 bg-[#050505] font-mono text-sm break-all" data-testid="deposit-wallet-address">
                {wallets[asset]}
              </div>
              <button
                onClick={copy}
                data-testid="copy-address-btn"
                className="mt-3 inline-flex items-center gap-2 border border-white/15 hover:border-[#F0A83E] hover:text-[#F0A83E] px-4 py-2 text-sm transition-colors"
              >
                {copied ? <CheckCircle size={16} weight="fill" /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy address"}
              </button>
              <div className="mt-4 text-xs text-zinc-500 leading-relaxed">
                Send only {asset} to this address. After sending, submit the transaction hash below to credit your account.
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="hairline bg-[#0F0F0F] p-6 space-y-5" data-testid="deposit-form">
          <div className="text-xs uppercase tracking-widest text-[#F0A83E] font-mono">
            ◆ Confirm deposit
          </div>
          <label className="block">
            <span className="block text-xs uppercase tracking-widest text-zinc-500 font-mono mb-2">
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
              className="w-full bg-[#050505] border border-white/10 px-4 py-3 outline-none focus:border-[#F0A83E] font-mono"
            />
          </label>
          <label className="block">
            <span className="block text-xs uppercase tracking-widest text-zinc-500 font-mono mb-2">
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
              className="w-full bg-[#050505] border border-white/10 px-4 py-3 outline-none focus:border-[#F0A83E] font-mono text-sm"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            data-testid="deposit-submit-btn"
            className="w-full bg-[#F0A83E] text-black font-semibold py-3 hover:bg-[#FFBC5C] transition-colors disabled:opacity-50 glow-btn"
          >
            {loading ? "Submitting..." : "Submit deposit"}
          </button>
          <div className="text-xs text-zinc-500 leading-relaxed">
            Deposits are typically approved within 15 minutes after network confirmations.
          </div>
        </form>
      </div>

      <div className="hairline bg-[#0F0F0F] p-6" data-testid="deposit-history">
        <div className="text-xs uppercase tracking-widest text-zinc-500 font-mono mb-4">
          ◆ Deposit history
        </div>
        {deposits.length === 0 ? (
          <div className="py-8 text-center text-sm text-zinc-500">No deposits yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-zinc-500 font-mono">
                <th className="pb-3">Date</th>
                <th className="pb-3">Asset</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">TX Hash</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="font-mono">
              {deposits.map((d) => (
                <tr key={d.id} className="border-t border-white/5" data-testid={`deposit-row-${d.id}`}>
                  <td className="py-3 text-zinc-400">{new Date(d.created_at).toLocaleDateString()}</td>
                  <td className="py-3">{d.asset}</td>
                  <td className="py-3">{money(d.amount_usd)}</td>
                  <td className="py-3 text-zinc-400 truncate max-w-[200px]">{d.tx_hash}</td>
                  <td className="py-3"><StatusBadge status={d.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
