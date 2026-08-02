import StaticPageLayout from "@/components/StaticPageLayout";
import { Handshake, Buildings, Code, Envelope } from "@phosphor-icons/react";
import { Link } from "react-router-dom";

const TRACKS = [
    { icon: Buildings, title: "Institutional & custody", body: "Exchanges, custodians, and liquidity providers looking to integrate settlement or custody infrastructure." },
    { icon: Code, title: "Technology & API", body: "Fintech platforms building on top of our market data, portfolio, or reporting APIs." },
    { icon: Handshake, title: "Referral & affiliate", body: "Creators, communities, and advisors who want to introduce their audience to the platform." },
];

export default function Partners() {
    return (
        <StaticPageLayout
            eyebrow="Partners"
            title="Let's build something together."
            subtitle="We work with custodians, exchanges, and technology partners to keep the platform fast, liquid, and secure."
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {TRACKS.map((t) => {
                    const Icon = t.icon;
                    return (
                        <div key={t.title} className="hairline bg-[#0A0A0A] p-8">
                            <Icon size={28} weight="duotone" className="text-[#C8102E] mb-4" />
                            <div className="font-display font-bold text-lg">{t.title}</div>
                            <p className="text-zinc-400 mt-3 text-sm leading-relaxed">{t.body}</p>
                        </div>
                    );
                })}
            </div>

            <div className="mt-16 hairline bg-[#0A0A0A] p-10 text-center">
                <Envelope size={32} weight="duotone" className="text-[#C8102E] mx-auto mb-4" />
                <div className="font-display font-bold text-2xl">Get in touch</div>
                <p className="text-zinc-400 mt-3 max-w-md mx-auto text-sm leading-relaxed">
                    Tell us a bit about your organization and what you're looking to build.
                    We reply to every partnership inquiry within a few business days.
                </p>
                <a
                    href="mailto:partners@astrowealthventures.com"
                    className="mt-6 inline-flex items-center gap-2 bg-[#C8102E] text-black font-semibold px-6 py-3 hover:bg-[#E01B3D] transition-colors"
                >
                    partners@astrowealthventures.com
                </a>
            </div>

            <p className="mt-10 text-center text-sm text-zinc-500">
                Looking to open an account instead?{" "}
                <Link to="/signup" className="text-[#C8102E] hover:text-[#E01B3D]">Sign up here</Link>.
            </p>
        </StaticPageLayout>
    );
}