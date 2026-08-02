import { useLocation, Link } from "react-router-dom";
import { useState } from "react";
import { http, fmtError } from "@/lib/api";
import { AuthShell } from "@/pages/Login";
import { toast } from "sonner";

export default function VerifyEmailPending() {
    const location = useLocation();
    const email = location.state?.email;
    const [sending, setSending] = useState(false);

    const resend = async () => {
        if (!email) return;
        setSending(true);
        try {
            await http.post("/auth/resend-verification", { email });
            toast.success("Verification email resent");
        } catch (e) {
            toast.error(fmtError(e.response?.data?.detail) || e.message);
        } finally {
            setSending(false);
        }
    };

    return (
        <AuthShell title="Check your email">
            <p className="mt-3 text-zinc-400">
                {email
                    ? <>We sent a verification link to <span className="text-white">{email}</span>.</>
                    : "We sent you a verification link."}
                {" "}Click it to activate your account.
            </p>

            <button
                onClick={resend}
                disabled={sending || !email}
                data-testid="resend-verification-btn"
                className="mt-8 w-full bg-white/5 border border-white/10 text-white font-semibold py-4 hover:bg-white/10 transition-colors disabled:opacity-50"
            >
                {sending ? "Resending..." : "Resend email"}
            </button>

            <p className="mt-8 text-sm text-zinc-500">
                Already verified?{" "}
                <Link to="/login" className="text-[#C8102E] hover:underline">
                    Sign in →
                </Link>
            </p>
        </AuthShell>
    );
}