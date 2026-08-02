import StaticPageLayout, { Prose } from "@/components/StaticPageLayout";

export default function Privacy() {
    return (
        <StaticPageLayout eyebrow="Legal" title="Privacy Policy" subtitle="Last updated: August 1, 2026">
            <Prose>
                <p>
                    This Privacy Policy explains how AstroWealthVentures collects, uses,
                    and protects information when you use the Platform.
                </p>

                <h2>1. Information we collect</h2>
                <ul>
                    <li><strong>Account information:</strong> name, email address, date of birth, and currency preference provided at signup.</li>
                    <li><strong>Transaction data:</strong> deposit, withdrawal, and investment activity associated with your account.</li>
                    <li><strong>Technical data:</strong> IP address, device/browser type, and log data collected automatically for security and fraud prevention.</li>
                    <li><strong>Verification data:</strong> where required for compliance purposes, identity verification information you submit.</li>
                </ul>

                <h2>2. How we use your information</h2>
                <ul>
                    <li>To create and administer your account;</li>
                    <li>To process deposits, withdrawals, and investment activity;</li>
                    <li>To detect and prevent fraud, unauthorized access, and abuse;</li>
                    <li>To comply with legal and regulatory obligations;</li>
                    <li>To send account-related communications, including security and transaction notices.</li>
                </ul>

                <h2>3. What we don't do</h2>
                <p>
                    We do not sell your personal information to third parties. We do
                    not use your account data to serve you third-party advertising.
                </p>

                <h2>4. Sharing of information</h2>
                <p>We may share information with:</p>
                <ul>
                    <li>Service providers who support Platform operations (e.g. custody, email delivery, infrastructure hosting), bound by confidentiality obligations;</li>
                    <li>Regulators or law enforcement, where required by applicable law;</li>
                    <li>A successor entity in the event of a merger, acquisition, or asset sale, subject to continued protection under this Policy.</li>
                </ul>

                <h2>5. Data retention</h2>
                <p>
                    We retain account and transaction data for as long as your account
                    is active and for a period afterward as required to meet legal,
                    accounting, or regulatory obligations.
                </p>

                <h2>6. Security</h2>
                <p>
                    We apply technical and organizational safeguards described on our{" "}
                    <a href="/security" className="text-[#C8102E]">Security</a> page. No
                    system is completely immune to risk, and we encourage you to use a
                    strong, unique password and enable available account protections.
                </p>

                <h2>7. Your rights</h2>
                <p>
                    Depending on your jurisdiction, you may have rights to access,
                    correct, or request deletion of your personal data. To exercise
                    these rights, contact{" "}
                    <a href="mailto:privacy@astrowealthventures.com" className="text-[#C8102E]">
                        privacy@astrowealthventures.com
                    </a>. We may need to retain certain data to meet legal obligations
                    even after a deletion request.
                </p>

                <h2>8. Cookies</h2>
                <p>
                    We use essential cookies required for authentication and session
                    management. We do not use third-party advertising or tracking
                    cookies.
                </p>

                <h2>9. Changes to this Policy</h2>
                <p>
                    We may update this Privacy Policy periodically. Material changes
                    will be communicated via email or an in-app notice.
                </p>

                <h2>10. Contact</h2>
                <p>
                    Questions about this Policy can be sent to{" "}
                    <a href="mailto:privacy@astrowealthventures.com" className="text-[#C8102E]">
                        privacy@astrowealthventures.com
                    </a>.
                </p>
            </Prose>
        </StaticPageLayout>
    );
}