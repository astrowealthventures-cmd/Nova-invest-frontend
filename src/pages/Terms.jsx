import StaticPageLayout, { Prose } from "@/components/StaticPageLayout";

export default function Terms() {
    return (
        <StaticPageLayout eyebrow="Legal" title="Terms of Service" subtitle="Last updated: August 1, 2026">
            <Prose>
                <p>
                    These Terms of Service ("Terms") govern access to and use of the
                    AstroWealthVentures platform ("Platform," "we," "us"). By creating an
                    account, you agree to be bound by these Terms. If you do not agree,
                    do not use the Platform.
                </p>

                <h2>1. Eligibility</h2>
                <p>
                    You must be at least 18 years old and legally capable of entering into
                    binding contracts in your jurisdiction to use the Platform. You are
                    responsible for ensuring that your use of the Platform complies with
                    the laws applicable to you, including any restrictions on digital
                    asset investment in your country of residence.
                </p>

                <h2>2. Account registration</h2>
                <p>
                    You agree to provide accurate, current information during
                    registration and to keep it up to date. You are responsible for
                    maintaining the confidentiality of your login credentials and for
                    all activity that occurs under your account.
                </p>

                <h2>3. Deposits and investment plans</h2>
                <ul>
                    <li>Deposits are accepted in the digital assets listed on the Platform at the time of deposit.</li>
                    <li>Each investment plan specifies a minimum and maximum deposit, a duration, and a daily rate of return, as shown on the Plans page at the time you invest.</li>
                    <li>Displayed daily/total ROI figures are illustrative of plan terms and are not guaranteed investment returns; digital asset markets are volatile and outcomes are not assured.</li>
                    <li>Withdrawals are processed according to each plan's lock-up terms, as disclosed before you invest.</li>
                </ul>

                <h2>4. Fees</h2>
                <p>
                    Any applicable fees — including network/withdrawal fees — are disclosed
                    before you confirm a transaction. We do not charge hidden platform
                    fees on deposits.
                </p>

                <h2>5. Prohibited use</h2>
                <p>You agree not to use the Platform to:</p>
                <ul>
                    <li>Violate any applicable law, including anti-money-laundering and sanctions regulations;</li>
                    <li>Misrepresent your identity or provide false verification information;</li>
                    <li>Attempt to gain unauthorized access to the Platform or other users' accounts;</li>
                    <li>Interfere with the normal operation of the Platform.</li>
                </ul>

                <h2>6. Account suspension and termination</h2>
                <p>
                    We may suspend or terminate your account if we reasonably believe
                    you have violated these Terms, applicable law, or if required to do
                    so by a regulator or law enforcement request. Where reasonably
                    possible, we will notify you of the reason.
                </p>

                <h2>7. Risk disclosure</h2>
                <p>
                    Digital assets are volatile and investing in them carries risk of
                    loss, including total loss of principal. Past performance of any
                    strategy is not indicative of future results. See our{" "}
                    <a href="/disclosures" className="text-[#C8102E]">Disclosures</a> page
                    for further detail.
                </p>

                <h2>8. Limitation of liability</h2>
                <p>
                    To the maximum extent permitted by law, AstroWealthVentures is not
                    liable for indirect, incidental, or consequential damages arising
                    from your use of the Platform, including losses resulting from
                    market volatility, third-party service outages, or events outside
                    our reasonable control.
                </p>

                <h2>9. Changes to these Terms</h2>
                <p>
                    We may update these Terms from time to time. Material changes will
                    be communicated via email or an in-app notice before they take
                    effect. Continued use of the Platform after changes take effect
                    constitutes acceptance of the updated Terms.
                </p>

                <h2>10. Contact</h2>
                <p>
                    Questions about these Terms can be sent to{" "}
                    <a href="mailto:legal@astrowealthventures.com" className="text-[#C8102E]">
                        legal@astrowealthventures.com
                    </a>.
                </p>
            </Prose>
        </StaticPageLayout>
    );
}