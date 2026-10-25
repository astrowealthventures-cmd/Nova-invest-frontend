import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, useLocation, Link } from "react-router-dom";
import { http, fmtError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { AuthShell } from "@/pages/Login";

function ResendBox({ initialEmail }) {
    const [email, setEmail] = useState(initialEmail || "");
    const [msg, setMsg] = useState("");
    const [busy, setBusy] = useState(false);

    const resend = async () => {
        if (!email.trim()) return setMsg("Enter your email first.");
        setBusy(true);
        setMsg("");
        try {
            await http.post("/auth/resend-verification", { email: email.trim() });
            setMsg("If that account still needs verifying, a new link is on its way.");
        } catch (e) {
            setMsg(fmtError(e.response?.data?.detail) || "Could not resend. Try again shortly.");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="mt-8 space-y-3" data-testid="resend-box">
            {!initialEmail && (
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-[#0F0F0F] border border-white/10 px-4 py-3 text-white outline-none focus:border-[#C8102E] font-mono text-sm"
                />
            )}
            <button
                onClick={resend}
                disabled={busy}
                className="w-full bg-[#C8102E] text-white font-semibold py-4 hover:bg-[#E01B3D] transition-colors disabled:opacity-50"
            >
                {busy ? "Sending..." : "Resend verification email"}
            </button>
            {msg && <p className="text-sm text-zinc-400 font-mono">{msg}</p>}
        </div>
    );
}

export default function VerifyEmailPending() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { refresh } = useAuth();
    const token = params.get("token");
    const email = location.state?.email;

    // pending (no token, just signed up) | loading | success | error
    const [status, setStatus] = useState(token ? "loading" : "pending");
    const [message, setMessage] = useState("");
    const called = useRef(false); // Strict Mode guard: the token is single-use

    useEffect(() => {
        if (!token || called.current) return;
        called.current = true;

        http.get("/auth/verify", { params: { token } })
            .then(async () => {
                await refresh();
                setStatus("success");
                setTimeout(() => navigate("/dashboard/overview", { replace: true }), 1500);
            })
            .catch((e) => {
                const data = e.response?.data;
                setStatus("error");
                setMessage(
                    fmtError(data?.detail) ||
                    (typeof data === "string" ? data : "") ||
                    data?.message ||
                    "This link is invalid, expired, or already used."
                );
            });
    }, [token, navigate, refresh]);

    const titles = {
        pending: "Check your email",
        loading: "Verifying your email...",
        success: "Email verified",
        error: "Verification failed",
    };

    return (
        <AuthShell title={titles[status]}>
            {status === "pending" && (
                <div data-testid="verify-pending">
                    <p className="mt-3 text-zinc-400">
                        We've sent a verification link
                        {email ? <> to <span className="text-white">{email}</span></> : " to your email"}.
                        Open it to activate your account.
                    </p>
                    <ResendBox initialEmail={email} />
                    <Link to="/login" className="mt-4 block text-center text-sm text-zinc-500 hover:text-white">
                        Back to sign in
                    </Link>
                </div>
            )}

            {status === "loading" && (
                <div className="mt-6 flex items-center gap-3 text-zinc-400" data-testid="verify-loading">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/10 border-t-[#C8102E]" aria-hidden="true" />
                    <p>Please wait while we confirm your email.</p>
                </div>
            )}

            {status === "success" && (
                <div data-testid="verify-success">
                    <p className="mt-3 text-zinc-400">Your account is active. Taking you to your dashboard...</p>
                    <Link
                        to="/dashboard/overview"
                        className="mt-8 block w-full bg-[#C8102E] text-white text-center font-semibold py-4 hover:bg-[#E01B3D] transition-colors"
                    >
                        Go to dashboard
                    </Link>
                </div>
            )}

            {status === "error" && (
                <div data-testid="verify-error">
                    <p className="mt-3 text-zinc-400">{message}</p>
                    <ResendBox initialEmail={email} />
                    <Link to="/login" className="mt-4 block text-center text-sm text-zinc-500 hover:text-white">
                        Back to sign in
                    </Link>
                </div>
            )}
        </AuthShell>
    );
}