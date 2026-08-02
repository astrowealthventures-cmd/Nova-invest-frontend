import StaticPageLayout from "@/components/StaticPageLayout";
import { Vault, Lock, ShieldCheck, Eye, Fingerprint, Warning } from "@phosphor-icons/react";

const PILLARS = [
    { icon: Vault, title: "Cold storage custody", body: "The substantial majority of client assets are held in offline, multi-signature cold storage via Fireblocks-secured infrastructure." },
    { icon: Lock, title: "Encryption in transit and at rest", body: "All traffic is encrypted via TLS 1.2+. Sensitive account data is encrypted at rest using industry-standard AES-256." },
    { icon: Fingerprint, title: "Access controls", body: "Internal systems require multi-factor authentication and role-based access. Withdrawal approvals require multi-signature sign-off above defined thresholds." },
    { icon: Eye, title: "Continuous monitoring", body: "Automated anomaly detection flags unusual login or withdrawal patterns for manual review before funds move." },
    { icon: ShieldCheck, title: "Independent audits", body: "Infrastructure and controls are reviewed against SOC 2-aligned practices, with periodic third-party penetration testing." },
];

export default function Security() {
    return (
        <StaticPageLayout
            eyebrow="Security"
            title="Security isn't a feature. It's the foundation."
            subtitle="A look at how we protect client assets and account data — in plain language, without the marketing gloss."
        >
            <div className="space-y-4">
                {PILLARS.map((p) => {
                    const Icon = p.icon;
                    return (
                        <div key={p.title} className="hairline bg-[#0A0A0A] p-6 flex gap-5">
                            <Icon size={28} weight="duotone" className="text-[#C8102E] shrink-0 mt-1" />
                            <div>
                                <div className="font-display font-bold text-lg">{p.title}</div>
                                <p className="text-zinc-400 mt-2 text-sm leading-relaxed">{p.body}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-16 hairline bg-[#0A0A0A] p-8 flex gap-4">
                <Warning size={24} weight="duotone" className="text-[#C8102E] shrink-0" />
                <div className="text-sm text-zinc-400 leading-relaxed">
                    <span className="text-white font-semibold">Responsible disclosure:</span> if you
                    believe you've found a security vulnerability in our platform, please report it to{" "}
                    <a href="mailto:security@astrowealthventures.com" className="text-[#C8102E] hover:text-[#E01B3D]">
                        security@astrowealthventures.com
                    </a>{" "}
                    rather than disclosing it publicly. We investigate all reports and will credit
                    responsible researchers where appropriate.
                </div>
            </div>
        </StaticPageLayout>
    );
}