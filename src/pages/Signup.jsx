import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ArrowRight } from "@phosphor-icons/react";
import { AuthShell } from "@/pages/Login";

const CURRENCIES = ["USD", "EUR", "GBP", "NGN"]; // adjust to whatever you support
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MIN_AGE = 18; // set to 0 to remove the age check

const inputCls =
  "w-full bg-[#0F0F0F] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]/50 transition-colors font-mono text-sm";

const pad = (n) => String(n).padStart(2, "0");

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // Years from (this year - MIN_AGE) back 100 years, newest first
  const years = useMemo(() => {
    const latest = new Date().getFullYear() - MIN_AGE;
    return Array.from({ length: 101 }, (_, i) => latest - i);
  }, []);

  const passwordsMatch = confirmPassword === "" || password === confirmPassword;

  const submit = async (e) => {
    e.preventDefault();
    setErr("");

    // --- Frontend validation (the backend never sees confirmPassword) ---
    if (password !== confirmPassword) {
      setErr("Passwords do not match.");
      return;
    }
    if (!dobDay || !dobMonth || !dobYear) {
      setErr("Please select your full date of birth.");
      return;
    }

    const d = Number(dobDay);
    const m = Number(dobMonth);
    const y = Number(dobYear);
    const dob = new Date(y, m - 1, d);
    // Catches impossible dates like 31 February
    if (dob.getFullYear() !== y || dob.getMonth() !== m - 1 || dob.getDate() !== d) {
      setErr("That date doesn't exist. Please check the day and month.");
      return;
    }

    if (MIN_AGE > 0) {
      const cutoff = new Date();
      cutoff.setFullYear(cutoff.getFullYear() - MIN_AGE);
      if (dob > cutoff) {
        setErr(`You must be at least ${MIN_AGE} years old to open an account.`);
        return;
      }
    }

    // Same YYYY-MM-DD format the date input used, so the backend needs no change
    const dateOfBirth = `${y}-${pad(m)}-${pad(d)}`;

    setLoading(true);
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
        <div>
          <F
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            testid="signup-confirm-password"
          />
          {!passwordsMatch && (
            <p className="mt-2 text-xs text-[#FF3B30] font-mono" data-testid="signup-password-mismatch">
              Passwords do not match.
            </p>
          )}
        </div>

        <fieldset>
          <legend className="block text-xs uppercase tracking-widest text-zinc-500 font-mono mb-2">
            Date of birth
          </legend>
          <div className="grid grid-cols-[1fr_1.6fr_1.2fr] gap-3">
            <select
              value={dobDay}
              onChange={(e) => setDobDay(e.target.value)}
              required
              aria-label="Day"
              data-testid="signup-dob-day"
              className={inputCls}
            >
              <option value="" disabled>Day</option>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <select
              value={dobMonth}
              onChange={(e) => setDobMonth(e.target.value)}
              required
              aria-label="Month"
              data-testid="signup-dob-month"
              className={inputCls}
            >
              <option value="" disabled>Month</option>
              {MONTHS.map((name, i) => (
                <option key={name} value={i + 1}>{name}</option>
              ))}
            </select>
            <select
              value={dobYear}
              onChange={(e) => setDobYear(e.target.value)}
              required
              aria-label="Year"
              data-testid="signup-dob-year"
              className={inputCls}
            >
              <option value="" disabled>Year</option>
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </fieldset>

        <label className="block">
          <span className="block text-xs uppercase tracking-widest text-zinc-500 font-mono mb-2">
            Currency
          </span>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
            data-testid="signup-currency"
            className={inputCls}
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
        className={inputCls}
      />
    </label>
  );
}