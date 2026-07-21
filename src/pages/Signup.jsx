import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight } from "@phosphor-icons/react";
import { AuthShell } from "@/pages/Login";
import { toast } from "sonner";

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      await register(name, email, password);
      toast.success("Account created");
      navigate("/dashboard");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell title="Open account">
      <p className="mt-3 text-zinc-400">60 seconds. No paperwork.</p>
      <form onSubmit={submit} className="mt-10 space-y-5" data-testid="signup-form">
        <F label="Full name" type="text" value={name} onChange={setName} testid="signup-name" />
        <F label="Email" type="email" value={email} onChange={setEmail} testid="signup-email" />
        <F label="Password" type="password" value={password} onChange={setPassword} testid="signup-password" />
        {err && <div className="text-sm text-[#FF3B30] font-mono" data-testid="signup-error">{err}</div>}
        <button
          type="submit"
          disabled={loading}
          data-testid="signup-submit-btn"
          className="w-full bg-[#C8102E] text-black font-semibold py-4 flex items-center justify-center gap-2 hover:bg-[#E01B3D] transition-colors disabled:opacity-50 glow-btn"
        >
          {loading ? "Creating..." : "Create account"} <ArrowRight size={18} weight="bold" />
        </button>
      </form>
      <p className="mt-8 text-sm text-zinc-500">
        Already have an account?{" "}
        <Link to="/login" className="text-[#C8102E] hover:underline" data-testid="signup-to-login-link">
          Sign in →
        </Link>
      </p>
    </AuthShell>
  );
}

function F({ label, type, value, onChange, testid }) {
  return (
    <label className="block">
      <span className="block text-xs uppercase tracking-widest text-zinc-500 font-mono mb-2">
        {label}
      </span>
      <input
        type={type}
        value={value}
        required
        minLength={type === "password" ? 6 : undefined}
        onChange={(e) => onChange(e.target.value)}
        data-testid={testid}
        className="w-full bg-[#0F0F0F] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]/50 transition-colors font-mono text-sm"
      />
    </label>
  );
}
