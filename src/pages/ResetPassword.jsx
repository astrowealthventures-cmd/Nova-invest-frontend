import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, ArrowRight, CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { http } from "@/lib/api";
import BrandMark from "@/components/BrandMark";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [done, setDone] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!token) {
            setError("Missing or invalid reset link. Please request a new one.");
            return;
        }
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }
        if (newPassword !== confirm) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            await http.patch(
                `/auth/verify-forgotten-password?token=${encodeURIComponent(token)}`,
                { new_password: newPassword }
            );
            setDone(true);
            setTimeout(() => navigate("/login"), 2500);
        } catch (err) {
            setError(
                err?.response?.data?.detail ||
                err?.response?.data ||
                "This link is invalid or has expired. Please request a new one."
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
                    {!token ? (
                        <div className="text-center" data-testid="reset-password-missing-token">
                            <WarningCircle size={40} weight="duotone" className="text-[#E01B3D] mx-auto mb-4" />
                            <h1 className="font-display font-bold text-2xl">Invalid link</h1>
                            <p className="text-zinc-400 mt-3 text-sm">
                                This reset link is missing or malformed.
                            </p>
                            <Link
                                to="/forgot-password"
                                className="mt-8 inline-block text-sm text-[#C8102E] hover:text-[#E01B3D] transition-colors"
                            >
                                Request a new link
                            </Link>
                        </div>
                    ) : done ? (
                        <div className="text-center" data-testid="reset-password-success">
                            <CheckCircle size={40} weight="duotone" className="text-[#C8102E] mx-auto mb-4" />
                            <h1 className="font-display font-bold text-2xl">Password updated</h1>
                            <p className="text-zinc-400 mt-3 text-sm">Redirecting you to login...</p>
                        </div>
                    ) : (
                        <>
                            <h1 className="font-display font-bold text-2xl">Set a new password</h1>
                            <p className="text-zinc-400 mt-2 text-sm">Choose a strong password for your account.</p>

                            <form onSubmit={onSubmit} className="mt-8 space-y-4">
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-zinc-500 font-mono">
                                        New password
                                    </label>
                                    <div className="mt-2 flex items-center gap-2 border border-white/10 focus-within:border-[#C8102E] px-3 py-3 transition-colors">
                                        <Lock size={18} className="text-zinc-500 shrink-0" />
                                        <input
                                            type="password"
                                            required
                                            minLength={8}
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="••••••••"
                                            data-testid="reset-password-new-input"
                                            className="bg-transparent w-full text-sm outline-none placeholder:text-zinc-600"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs uppercase tracking-widest text-zinc-500 font-mono">
                                        Confirm password
                                    </label>
                                    <div className="mt-2 flex items-center gap-2 border border-white/10 focus-within:border-[#C8102E] px-3 py-3 transition-colors">
                                        <Lock size={18} className="text-zinc-500 shrink-0" />
                                        <input
                                            type="password"
                                            required
                                            minLength={8}
                                            value={confirm}
                                            onChange={(e) => setConfirm(e.target.value)}
                                            placeholder="••••••••"
                                            data-testid="reset-password-confirm-input"
                                            className="bg-transparent w-full text-sm outline-none placeholder:text-zinc-600"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="text-sm text-[#E01B3D]" data-testid="reset-password-error">
                                        {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading}
                                    data-testid="reset-password-submit-btn"
                                    className="group w-full inline-flex items-center justify-center gap-2 bg-[#C8102E] text-black font-semibold py-3 hover:bg-[#E01B3D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Updating..." : "Update password"}
                                    {!loading && (
                                        <ArrowRight size={16} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                                    )}
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}