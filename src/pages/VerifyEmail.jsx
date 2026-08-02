import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { http } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import BrandMark from "@/components/BrandMark";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const { refreshUser } = useAuth(); // see note below if this doesn't exist yet

    const [status, setStatus] = useState("loading"); // loading | success | error
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setError("Missing verification token.");
            return;
        }

        http
            .get(`/auth/verify?token=${encodeURIComponent(token)}`)
            .then(async () => {
                setStatus("success");
                // the verify call sets the auth cookies, so refresh the user in context
                if (refreshUser) await refreshUser();
                setTimeout(() => navigate("/dashboard"), 1800);
            })
            .catch((err) => {
                setStatus("error");
                setError(
                    err?.response?.data?.detail ||
                    err?.response?.data ||
                    "This link is invalid or has expired."
                );
            });
    }, [token]);

    return (
        <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
            <div className="w-full max-w-md text-center">
                <Link to="/" className="flex items-center gap-2 justify-center mb-10">
                    <BrandMark className="w-7 h-7" />
                    <span className="font-display font-bold text-lg text-[#C8102E]">
                        AstroWealthVentures
                    </span>
                </Link>

                <div className="hairline bg-[#0A0A0A] p-8">
                    {status === "loading" && (
                        <div className="font-mono text-sm text-zinc-500 pulse-glow" data-testid="verify-email-loading">
                            Verifying your email…
                        </div>
                    )}

                    {status === "success" && (
                        <div data-testid="verify-email-success">
                            <CheckCircle size={40} weight="duotone" className="text-[#C8102E] mx-auto mb-4" />
                            <h1 className="font-display font-bold text-2xl">Email verified</h1>
                            <p className="text-zinc-400 mt-3 text-sm">Taking you to your dashboard…</p>
                        </div>
                    )}

                    {status === "error" && (
                        <div data-testid="verify-email-error">
                            <WarningCircle size={40} weight="duotone" className="text-[#E01B3D] mx-auto mb-4" />
                            <h1 className="font-display font-bold text-2xl">Verification failed</h1>
                            <p className="text-zinc-400 mt-3 text-sm">{error}</p>
                            <Link
                                to="/login"
                                className="mt-8 inline-block text-sm text-[#C8102E] hover:text-[#E01B3D] transition-colors"
                            >
                                Back to login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}