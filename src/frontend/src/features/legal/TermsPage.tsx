import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/button";

interface TermsPageProps {
  onBack?: () => void;
}

export default function TermsPage({ onBack }: TermsPageProps) {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="mb-6 -ml-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      )}

      <div className="space-y-8">
        <div className="border-b border-border pb-6">
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            TERMS OF SERVICE &amp; OPERATIONAL POLICY
          </h1>
          <p className="text-muted-foreground text-sm">
            <strong>Entity:</strong> Mahachi Desmond Private Limited (the
            &ldquo;Company&rdquo;)
          </p>
          <p className="text-muted-foreground text-sm">
            <strong>Platform:</strong> 7-Bucks Diaspora Bridge
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            1. NATURE OF SERVICE
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            7-Bucks is a proprietary technical interface designed for Zimbabwean
            students in the diaspora. The Company provides a non-custodial
            instruction layer that connects Zimbabwe-issued Visa/Mastercards to
            local EcoCash USD wallets via the ContiPay API.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            2. FINANCIAL PROCESSING &amp; REGULATION
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Mahachi Desmond Private Limited does not hold, settle, or transmit
            funds. All financial transactions are executed by ContiPay, a
            licensed Payment Service Provider. By using this service, users
            agree to ContiPay&rsquo;s Terms of Use and KYC/AML compliance
            protocols.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            3. FEE STRUCTURE
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            A convenience fee of $1.00 (Flat) + 6% (Percentage) is applied to
            every transaction. This fee covers international merchant processing
            costs, technical maintenance, and system security. All fees are
            displayed transparently via our pre-checkout calculator.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            4. TRANSACTION FAILURES &amp; REFUNDS
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            In the event of a technical failure:
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
            <li>
              If a card is charged but EcoCash is not credited, users must
              provide their Transaction ID to{" "}
              <a
                href="mailto:mdprivatelimited2024@gmail.com"
                className="text-primary hover:underline font-medium"
              >
                mdprivatelimited2024@gmail.com
              </a>
              .
            </li>
            <li>
              The Company will escalate the query to ContiPay&rsquo;s 24/7
              Support Team for investigation.
            </li>
            <li>
              Funds successfully settled into the EcoCash wallet are
              non-refundable.
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            5. DATA PRIVACY
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            We utilize industry-standard encryption. Card details are processed
            directly via ContiPay&rsquo;s 3D-Secure gateway; Mahachi Desmond
            Private Limited does not store full card numbers or CVV data.
          </p>
        </section>
      </div>
    </div>
  );
}
