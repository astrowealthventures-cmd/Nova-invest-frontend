import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight } from "@phosphor-icons/react";
import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      await login(email, password);
      toast.success("Welcome back");
      navigate("/dashboard");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return <AuthShell title="Welcome back">
    <form onSubmit={submit} className="mt-10 space-y-5" data-testid="login-form">
      <Field label="Email" type="email" value={email} onChange={setEmail} testid="login-email" required />
      <Field label="Password" type="password" value={password} onChange={setPassword} testid="login-password" required />
      {err && <div className="text-sm text-[#FF3B30] font-mono" data-testid="login-error">{err}</div>}
      <button
        type="submit"
        disabled={loading}
        data-testid="login-submit-btn"
        className="w-full bg-[#F0A83E] text-black font-semibold py-4 flex items-center justify-center gap-2 hover:bg-[#FFBC5C] transition-colors disabled:opacity-50 glow-btn"
      >
        {loading ? "Signing in..." : "Sign in"} <ArrowRight size={18} weight="bold" />
      </button>
    </form>
    <p className="mt-8 text-sm text-zinc-500">
      New here?{" "}
      <Link to="/signup" className="text-[#F0A83E] hover:underline" data-testid="login-to-signup-link">
        Create an account →
      </Link>
    </p>
  </AuthShell>;
}

function Field({ label, type, value, onChange, testid, required }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest text-zinc-500 font-mono mb-2">
        {label}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        data-testid={testid}
        className="w-full bg-[#0F0F0F] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#F0A83E] focus:ring-1 focus:ring-[#F0A83E]/50 transition-colors font-mono text-sm"
      />
    </label>
  );
}

export function AuthShell({ title, children }) {
  return (
    <div className="min-h-screen bg-[#050505] text-white grid md:grid-cols-2">
      <div className="hidden md:flex relative flex-col justify-between p-12 bg-[#020202] overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 grid-lines opacity-40" />
        <div className="absolute -left-24 top-1/2 -translate-y-1/2 w-96 h-96 bg-[#F0A83E]/20 blur-[120px]" />
        <Link to="/" className="relative font-display font-bold text-2xl tracking-tight" data-testid="auth-logo">
          <span className="text-[#F0A83E]">AstroWealthVentures</span>
        </Link>
        <div className="relative">
          <div className="text-xs uppercase tracking-widest text-[#F0A83E] font-mono mb-4">
            ◆ Since 2019
          </div>
          <div className="font-display font-bold text-5xl leading-tight">
            $2.4B<br /><span className="text-zinc-500">under management</span>
          </div>
          <p className="mt-6 text-zinc-400 max-w-sm">
            Join 48,000+ investors compounding wealth on the world's most trusted digital-asset platform.
          </p>
        </div>
        <div className="relative text-xs text-zinc-600 font-mono">
          Regulated · Audited · Insured
        </div>
      </div>
      <div className="flex flex-col items-stretch justify-center px-6 md:px-16 py-16">
        <div className="md:hidden mb-8">
          <Link to="/" className="font-display font-bold text-xl">
            NOVA<span className="text-[#F0A83E]">·</span>INVEST
          </Link>
        </div>
        <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight">
          {title}
        </h1>
        {children}
      </div>
    </div>
  );
}
