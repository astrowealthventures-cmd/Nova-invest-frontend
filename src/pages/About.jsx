import StaticPageLayout from "@/components/StaticPageLayout";
import { ChartLineUp, Users, Target, Globe } from "@phosphor-icons/react";

const VALUES = [
    { icon: Target, title: "Discipline", body: "Every strategy is rules-based and risk-managed — no discretionary gambles with client capital." },
    { icon: ChartLineUp, title: "Transparency", body: "Real-time dashboards, daily settlement logs, and clear fee disclosure at every step." },
    { icon: Users, title: "Accessibility", body: "Institutional-grade infrastructure, opened up to individual investors with no account minimums beyond plan tiers." },
    { icon: Globe, title: "Reach", body: "Built to serve investors across 180+ countries, with custody and compliance designed for cross-border operation." },
];

export default function About() {
    return (
        <StaticPageLayout
            eyebrow="Company"
            title="Building the infrastructure of modern wealth."
            subtitle="AstroWealthVentures was founded to make institutional-grade digital asset strategies accessible to everyday investors — without the opacity that usually comes with it."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {VALUES.map((v) => {
                    const Icon = v.icon;
                    return (
                        <div key={v.title} className="hairline bg-[#0A0A0A] p-8">
                            <Icon size={28} weight="duotone" className="text-[#C8102E] mb-4" />
                            <div className="font-display font-bold text-xl">{v.title}</div>
                            <p className="text-zinc-400 mt-3 text-sm leading-relaxed">{v.body}</p>
                        </div>
                    );
                })}
            </div>

            <div className="mt-16 space-y-6 text-zinc-400 leading-relaxed">
                <p>
                    We started AstroWealthVentures with a simple observation: the tools used by
                    professional trading desks to manage risk and generate consistent returns
                    were rarely available to individual investors. Custody was fragmented, fee
                    structures were unclear, and reporting was an afterthought.
                </p>
                <p>
                    Our platform is built around three things — segregated custody, algorithmic
                    strategy execution, and daily transparency. Every deposit is tracked from the
                    moment it lands to the moment it's withdrawn, with a full audit trail
                    available to the account holder at any time.
                </p>
                <p>
                    We're a small, focused team of engineers, risk analysts, and operators —
                    not a trading floor, and not a marketing shop. If you have questions about
                    how any part of the platform works, we'd rather you ask than guess.
                </p>
            </div>
        </StaticPageLayout>
    );
}