import StaticPageLayout, { Prose } from "@/components/StaticPageLayout";
import { Warning } from "@phosphor-icons/react";

export default function Disclosures() {
    return (
        <StaticPageLayout eyebrow="Legal" title="Risk Disclosures" subtitle="Last updated: August 1, 2026">
            <div className="hairline bg-[#0A0A0A] p-6 flex gap-4 mb-10">
                <Warning size={24} weight="duotone" className="text-[#C8102E] shrink-0" />
                <p className="text-sm text-zinc-300 leading-relaxed">
                    Digital asset investing carries significant risk, including the risk
                    of total loss of principal. Please read this page in full before
                    depositing funds.
                </p>
            </div>

            <Prose>
                <h2>1. No guaranteed returns</h2>
                <p>
                    Daily and total ROI figures shown for each investment plan describe
                    the plan's terms, not a guarantee of profit. Digital asset markets
                    are highly volatile, and strategy performance can vary or be
                    interrupted by market conditions outside our control.
                </p>

                <h2>2. Not investment advice</h2>
                <p>
                    Nothing on this Platform constitutes financial, investment, tax, or
                    legal advice. You should independently evaluate whether an
                    investment plan is suitable for your circumstances, and consult a
                    licensed financial advisor if you are unsure.
                </p>

                <h2>3. Custody risk</h2>
                <p>
                    While client assets are held using cold storage and multi-signature
                    controls as described on our{" "}
                    <a href="/security" className="text-[#C8102E]">Security</a> page, no
                    custody arrangement fully eliminates risk of loss due to
                    extraordinary events, including but not limited to critical
                    infrastructure failure or force majeure events.
                </p>

                <h2>4. Regulatory status</h2>
                <p>
                    Digital asset regulation varies by jurisdiction and continues to
                    evolve. The Platform may not be registered as a regulated
                    investment adviser, broker-dealer, or money services business in
                    every jurisdiction in which it is accessible. It is your
                    responsibility to determine whether your use of the Platform is
                    permitted under the laws of your country of residence.
                </p>

                <h2>5. Liquidity and lock-up terms</h2>
                <p>
                    Each plan has a defined duration and, in some cases, a lock-up
                    period during which withdrawal is restricted. Review these terms
                    carefully on the Plans page before depositing, as early withdrawal
                    may not be available or may be subject to conditions.
                </p>

                <h2>6. Market and counterparty risk</h2>
                <p>
                    Strategy performance is subject to broader digital asset market
                    conditions, exchange and counterparty risk, and network conditions
                    (e.g. blockchain congestion or fees) that can affect settlement
                    timing.
                </p>

                <h2>7. No FDIC/SIPC insurance</h2>
                <p>
                    Digital assets held on the Platform are not deposits and are not
                    insured by any government deposit insurance scheme (such as FDIC or
                    SIPC in the United States, or equivalent schemes elsewhere).
                </p>

                <h2>8. Your responsibility</h2>
                <p>
                    Only invest funds you can afford to lose. Diversify appropriately
                    and do not treat any single platform, including this one, as your
                    sole investment vehicle.
                </p>
            </Prose>
        </StaticPageLayout>
    );
}