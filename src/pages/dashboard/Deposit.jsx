import { useEffect, useRef, useState } from "react";
import { http, money, fmtError } from "@/lib/api";
import { toast } from "sonner";
import {
  ArrowDownLeft,
  CheckCircle,
  Clock,
  Coins,
  Copy,
  Image as ImageIcon,
  QrCode,
  Receipt,
  Upload,
  X,
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Uploads a file directly to Cloudinary using a signature issued by the backend.
// Returns the Cloudinary secure_url to be saved on the deposit record.
async function uploadToCloudinary(file) {
  // 1. Ask Spring Boot for a signed upload signature
  const sigRes = await http.get("/cloudinary/signature");
  console.log(sigRes);
  const { signature, timestamp, apiKey, cloudName, folder } = sigRes.data;

  // 2. Upload the file directly to Cloudinary (never touches our backend)
  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Screenshot upload failed. Please try again.");
  }

  const data = await res.json();
  return data.secure_url;
}

export default function Deposit() {
  const [wallets, setWallets] = useState({});
  const [asset, setAsset] = useState("USDT");
  const [amount, setAmount] = useState("");
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Screenshot upload state
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

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

  const handleFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image (PNG, JPG, or WEBP).");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("File too large. Max 5MB.");
      return;
    }
    setProofFile(file);
    setProofPreview(URL.createObjectURL(file));
  };

  const clearProof = () => {
    if (proofPreview) URL.revokeObjectURL(proofPreview);
    setProofFile(null);
    setProofPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) handleFile(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!proofFile) {
      toast.error("Please upload a screenshot of your transaction.");
      return;
    }
    setLoading(true);
    try {
      // 1. Upload screenshot to Cloudinary first, get back a URL
      const receiptUrl = await uploadToCloudinary(proofFile);

      // 2. Send deposit data + the Cloudinary URL to the backend as JSON
      await http.post("/deposits", {
        asset,
        amount_usd: parseFloat(amount),
        receipt_url: receiptUrl,
      });

      toast.success("Deposit submitted. Awaiting admin approval.");
      setAmount("");
      clearProof();
      load();
    } catch (e) {
      toast.error(fmtError(e.response?.data?.detail) || e.message || "Failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (proofPreview) URL.revokeObjectURL(proofPreview);
    };
  }, [proofPreview]);

  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&bgcolor=0F0F0F&color=C8102E&data=${encodeURIComponent(wallets[asset] || "")}`;

  return (
    <div className="space-y-6 md:space-y-8" data-testid="page-deposit">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display font-bold text-3xl md:text-5xl tracking-tight">Deposit</h1>
        <p className="text-zinc-400 mt-2 text-sm md:text-base">
          Fund your account with crypto — upload a screenshot to confirm your transfer.
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
                Send {asset} to this address, then upload a screenshot of the transaction on the right to confirm.
              </div>
            </div>
          </div>
        </motion.div>

        {/* Confirm deposit form with file upload */}
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

          {/* Screenshot upload */}
          <div>
            <span className="mb-2 block text-xs uppercase tracking-widest text-zinc-500 font-mono">
              Transaction proof
            </span>

            {proofPreview ? (
              <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A]">
                <img
                  src={proofPreview}
                  alt="Proof preview"
                  className="h-48 w-full object-cover"
                  data-testid="deposit-proof-preview"
                />
                <button
                  type="button"
                  onClick={clearProof}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition-colors hover:bg-[#C8102E]"
                  aria-label="Remove image"
                >
                  <X size={16} weight="bold" />
                </button>
                <div className="flex items-center justify-between border-t border-white/5 px-3 py-2 text-xs font-mono text-zinc-400">
                  <span className="truncate max-w-[70%]">{proofFile?.name}</span>
                  <span>{proofFile ? Math.round(proofFile.size / 1024) : 0} KB</span>
                </div>
              </div>
            ) : (
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                data-testid="deposit-proof-dropzone"
                className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-4 py-8 text-center transition-all ${isDragging
                  ? "border-[#C8102E] bg-[#C8102E]/10"
                  : "border-white/10 bg-[#0A0A0A] hover:border-white/30 hover:bg-[#0F0F0F]"
                  }`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${isDragging ? "bg-[#C8102E]/20 text-[#C8102E]" : "bg-white/5 text-zinc-400"
                  }`}>
                  <Upload size={22} weight="duotone" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    Drop screenshot here
                  </div>
                  <div className="mt-1 text-xs text-zinc-500">
                    or <span className="text-[#C8102E]">browse files</span> · PNG, JPG, WEBP · Max 5MB
                  </div>
                </div>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/jpg"
              onChange={(e) => handleFile(e.target.files?.[0])}
              data-testid="deposit-proof-input"
              className="hidden"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !proofFile}
            data-testid="deposit-submit-btn"
            className="w-full rounded-xl bg-[#C8102E] py-3.5 font-semibold text-white transition-colors hover:bg-[#E01B3D] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit deposit"}
          </button>

          <div className="flex items-start gap-2 text-xs text-zinc-500 leading-relaxed">
            <Clock size={14} weight="bold" className="mt-0.5 shrink-0 text-zinc-600" />
            Deposits are typically approved within 15 minutes after admin reviews your proof.
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
              <ImageIcon size={40} weight="light" />
            </div>
            <div className="text-sm text-zinc-500">No deposits yet.</div>
          </div>
        ) : (
          <div className="space-y-2">
            {deposits.map((d) => {
              const m = assetMeta(d.asset);
              const proofUrl = d.receipt_url || d.proof_url || d.tx_hash_url;
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
                    {proofUrl ? (
                      <a
                        href={proofUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-zinc-300 transition-colors hover:border-[#C8102E] hover:text-[#C8102E]"
                      >
                        <ImageIcon size={14} weight="bold" />
                        View proof
                      </a>
                    ) : (
                      <span className="text-xs font-mono text-zinc-600">—</span>
                    )}
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