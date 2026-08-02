import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight } from "@phosphor-icons/react";
import { AuthShell } from "@/pages/Login";
import { toast } from "sonner";

const CURRENCIES = ["USD", "EUR", "GBP", "NGN"]; // adjust to whatever you support

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      await register({ firstName, lastName, email, password, currency, dateOfBirth });
      navigate("/verify-email", { state: { email } });
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
        <div className="grid grid-cols-2 gap-4">
          <F label="First name" type="text" value={firstName} onChange={setFirstName} testid="signup-firstname" />
          <F label="Last name" type="text" value={lastName} onChange={setLastName} testid="signup-lastname" />
        </div>
        <F label="Email" type="email" value={email} onChange={setEmail} testid="signup-email" />
        <F label="Password" type="password" value={password} onChange={setPassword} testid="signup-password" />
        <F
          label="Date of birth"
          type="date"
          value={dateOfBirth}
          onChange={setDateOfBirth}
          testid="signup-dob"
        />
        <label className="block">
          <span className="block text-xs uppercase tracking-widest text-zinc-500 font-mono mb-2">
            Currency
          </span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
            data-testid="signup-currency"
            className="w-full bg-[#0F0F0F] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]/50 transition-colors font-mono text-sm"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </label>
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
      <div className="mt-8 border-t border-white/10 pt-6 text-sm text-zinc-400 space-y-3">
        <p className="max-w-md">
         
        </p>
        <p className="max-w-md">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-[#C8102E] hover:text-[#E01B3D] transition-colors" data-testid="signup-to-login-link">
            Login →
          </Link>
        </p>
      </div>
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