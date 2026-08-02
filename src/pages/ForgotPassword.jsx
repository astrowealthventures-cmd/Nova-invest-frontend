import { useState } from "react";
import { Link } from "react-router-dom";
import { EnvelopeSimple, ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { http } from "@/lib/api";
import BrandMark from "@/components/BrandMark";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [sent, setSent] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await http.post("/auth/forgotten-password", { email });
            // Always show the same success state regardless of whether the
            // email exists — don't leak account existence to the client.
            setSent(true);
        } catch (err) {
            setError(
                err?.response?.data?.detail ||
                err?.response?.data ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
            <div className="w-full max-w-md">
                <Link to="/" className="flex items-center gap-2 justify-center mb-10">
                    <BrandMark className="w-7 h-7" />
                    <span className="font-display font-bold text-lg text-[#C8102E]">
                        AstroWealthVentures
                    </span>
                </Link>

                <div className="hairline bg-[#0A0A0A] p-8">
                    {sent ? (
                        <div className="text-center" data-testid="forgot-password-sent">
                            <CheckCircle size={40} weight="duotone" className="text-[#C8102E] mx-auto mb-4" />
                            <h1 className="font-display font-bold text-2xl">Check your inbox</h1>
                            <p className="text-zinc-400 mt-3 text-sm leading-relaxed">
                                If an account exists for <span className="text-white">{email}</span>,
                                we've sent a link to reset your password.
                            </p>
                            <Link
                                to="/login"
                                className="mt-8 inline-block text-sm text-zinc-400 hover:text-white transition-colors"
                            >
                                Back to login
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h1 className="font-display font-bold text-2xl">Forgot password</h1>
                            <p className="text-zinc-400 mt-2 text-sm">
                                Enter the email on your account and we'll send you a reset link.
                            </p>

                            <form onSubmit={onSubmit} className="mt-8 space-y-4">
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-zinc-500 font-mono">
                                        Email
                                    </label>
                                    <div className="mt-2 flex items-center gap-2 border border-white/10 focus-within:border-[#C8102E] px-3 py-3 transition-colors">
                                        <EnvelopeSimple size={18} className="text-zinc-500 shrink-0" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            data-testid="forgot-password-email-input"
                                            className="bg-transparent w-full text-sm outline-none placeholder:text-zinc-600"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="text-sm text-[#E01B3D]" data-testid="forgot-password-error">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    data-testid="forgot-password-submit-btn"
                                    className="group w-full inline-flex items-center justify-center gap-2 bg-[#C8102E] text-black font-semibold py-3 hover:bg-[#E01B3D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Sending..." : "Send reset link"}
                                    {!loading && (
                                        <ArrowRight size={16} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                                    )}
                                </button>
                            </form>

                            <Link
                                to="/login"
                                className="mt-6 block text-center text-sm text-zinc-400 hover:text-white transition-colors"
                            >
                                Back to login
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}