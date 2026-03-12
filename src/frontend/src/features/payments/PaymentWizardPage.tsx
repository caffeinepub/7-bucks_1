import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Calculator,
  CheckCircle2,
  DollarSign,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Progress } from "../../components/ui/progress";
import PaymentResultPanel from "./PaymentResultPanel";
import { usePaymentOrchestration } from "./usePaymentOrchestration";
import {
  validateAmount,
  validateCVV,
  validateCardNumber,
  validateEcoCashNumber,
  validateExpiry,
} from "./validation";

type Step = "calculator" | "card" | "details" | "confirm" | "result";

/** Calculate total charged: $1.00 fixed operational fee + 6% variable fee */
function calculateTotalCharged(amountUsd: number): number {
  const fixedFee = 1.0;
  const variableFee = amountUsd * 0.06;
  return amountUsd + fixedFee + variableFee;
}

export default function PaymentWizardPage() {
  const [step, setStep] = useState<Step>("calculator");
  const [cardNumber, setCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [expiry, setExpiry] = useState("");
  const [ecoCashNumber, setEcoCashNumber] = useState("");
  const [amount, setAmount] = useState("");

  const { initiatePayment, isPending, result, reset } =
    usePaymentOrchestration();

  const stepProgress: Record<Step, number> = {
    calculator: 20,
    card: 45,
    details: 70,
    confirm: 100,
    result: 100,
  };

  const stepLabels = [
    "Fee Calculator",
    "Card Details",
    "Payment Info",
    "Confirm",
  ];

  const stepIndex: Record<Step, number> = {
    calculator: 0,
    card: 1,
    details: 2,
    confirm: 3,
    result: 3,
  };

  const handleCalculatorNext = () => {
    if (validateAmount(amount)) {
      setStep("card");
    }
  };

  const handleCardNext = () => {
    if (
      validateCardNumber(cardNumber) &&
      validateCVV(cvv) &&
      validateExpiry(expiry)
    ) {
      setStep("details");
    }
  };

  const handleDetailsNext = () => {
    if (validateEcoCashNumber(ecoCashNumber)) {
      setStep("confirm");
    }
  };

  const handleConfirm = async () => {
    const amountNum = Number.parseFloat(amount);
    await initiatePayment({
      cardNumber,
      cvv,
      expiry,
      ecoCashNumber,
      amount: amountNum,
    });
    setStep("result");
  };

  const handleStartOver = () => {
    setStep("calculator");
    setCardNumber("");
    setCvv("");
    setExpiry("");
    setEcoCashNumber("");
    setAmount("");
    reset();
  };

  const amountNum = amount ? Number.parseFloat(amount) : 0;
  const fixedFee = 1.0;
  const variableFee = amountNum * 0.06;
  const totalFees = fixedFee + variableFee;
  const totalCharged = amount
    ? calculateTotalCharged(amountNum).toFixed(2)
    : "0.00";
  const savings = "21.00";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Send Money to EcoCash</h1>
        <p className="text-muted-foreground">
          Fast, secure digital disbursement service
        </p>
      </div>

      {step !== "result" && (
        <div className="mb-6">
          <Progress value={stepProgress[step]} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            {stepLabels.map((label, idx) => (
              <span
                key={label}
                className={
                  stepIndex[step] === idx ? "text-primary font-semibold" : ""
                }
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Fee Calculator */}
      {step === "calculator" && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              <CardTitle>Fee Calculator</CardTitle>
            </div>
            <CardDescription>
              Enter the amount you want to send and see the full cost breakdown
              before proceeding.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="calc-amount">Amount to Send (USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="calc-amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="100.00"
                  className="pl-9"
                  step="0.01"
                  min="0"
                />
              </div>
              {amount && !validateAmount(amount) && (
                <p className="text-sm text-destructive">
                  Amount must be greater than 0
                </p>
              )}
            </div>

            {amount && validateAmount(amount) && (
              <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-3">
                <p className="text-sm font-semibold text-foreground">
                  Cost Breakdown
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Recipient receives:
                    </span>
                    <span className="font-medium">${amountNum.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Operational fee (fixed):
                    </span>
                    <span className="font-medium">${fixedFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Service fee (6%):
                    </span>
                    <span className="font-medium">
                      ${variableFee.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Total convenience fee:
                    </span>
                    <span className="font-medium">${totalFees.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between text-base font-bold">
                    <span>Total you will be charged:</span>
                    <span className="text-primary">${totalCharged}</span>
                  </div>
                </div>
              </div>
            )}

            {amount && validateAmount(amount) && (
              <Alert className="bg-teal-50 dark:bg-teal-950 border-teal-200 dark:border-teal-800">
                <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <AlertDescription className="text-teal-900 dark:text-teal-100 text-sm">
                  <strong>Institutional Fee Savings: ${savings}</strong>{" "}
                  compared to traditional banking paths.
                </AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleCalculatorNext}
              disabled={!validateAmount(amount)}
              className="w-full"
            >
              Continue to Card Details <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Fees: $1.00 flat + 6% of transaction amount. All fees are
              non-negotiable and displayed transparently above.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Card Details */}
      {step === "card" && (
        <Card>
          <CardHeader>
            <CardTitle>Enter Card Details</CardTitle>
            <CardDescription>
              Your card information is secure and encrypted
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(e.target.value.replace(/\s/g, ""))
                }
                placeholder="1234 5678 9012 3456"
                maxLength={16}
              />
              {cardNumber && !validateCardNumber(cardNumber) && (
                <p className="text-sm text-destructive">
                  Please enter a valid 16-digit card number
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry (MM/YY)</Label>
                <Input
                  id="expiry"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  placeholder="12/25"
                  maxLength={5}
                />
                {expiry && !validateExpiry(expiry) && (
                  <p className="text-sm text-destructive">Invalid format</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  placeholder="123"
                  maxLength={4}
                />
                {cvv && !validateCVV(cvv) && (
                  <p className="text-sm text-destructive">3-4 digits</p>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep("calculator")}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={handleCardNext}
                disabled={
                  !validateCardNumber(cardNumber) ||
                  !validateCVV(cvv) ||
                  !validateExpiry(expiry)
                }
                className="flex-1"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Payment Details */}
      {step === "details" && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>
              Enter the recipient&apos;s EcoCash number
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ecoCash">Parent&apos;s EcoCash Number</Label>
              <Input
                id="ecoCash"
                value={ecoCashNumber}
                onChange={(e) => setEcoCashNumber(e.target.value)}
                placeholder="0771234567"
              />
              {ecoCashNumber && !validateEcoCashNumber(ecoCashNumber) && (
                <p className="text-sm text-destructive">
                  Please enter a valid phone number
                </p>
              )}
            </div>

            {/* Show the amount summary from the calculator step */}
            <Alert className="bg-teal-50 dark:bg-teal-950 border-teal-200 dark:border-teal-800">
              <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <AlertDescription className="text-teal-900 dark:text-teal-100">
                <strong>
                  Institutional Fee Savings: ${savings} (Compared to Traditional
                  Banking Paths)
                </strong>
                <div className="mt-2 text-sm space-y-1">
                  <p>Recipient receives: ${amountNum.toFixed(2)}</p>
                  <p className="text-xs text-teal-700 dark:text-teal-300">
                    Fee: $1.00 operational + ${variableFee.toFixed(2)} (6%) = $
                    {totalFees.toFixed(2)}
                  </p>
                  <p className="font-medium">
                    You will be charged: ${totalCharged}
                  </p>
                </div>
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep("card")}
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={handleDetailsNext}
                disabled={!validateEcoCashNumber(ecoCashNumber)}
                className="flex-1"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Confirm */}
      {step === "confirm" && (
        <Card>
          <CardHeader>
            <CardTitle>Confirm Payment</CardTitle>
            <CardDescription>
              Please review your payment details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3 p-4 bg-muted rounded-lg">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Card ending in:</span>
                <span className="font-medium">****{cardNumber.slice(-4)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">EcoCash Number:</span>
                <span className="font-medium">{ecoCashNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Recipient receives:
                </span>
                <span className="font-medium">${amountNum.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Operational fee (fixed):</span>
                <span>${fixedFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Service fee (6%):</span>
                <span>${variableFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between text-lg font-bold">
                <span>Total charge:</span>
                <span>${totalCharged}</span>
              </div>
            </div>

            <Alert className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-900 dark:text-amber-100">
                By confirming, you authorize 7 Bucks to charge your card and
                send funds to the specified EcoCash account.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setStep("details")}
                className="flex-1"
                disabled={isPending}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isPending}
                className="flex-1"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Process Digital Disbursement{" "}
                    <CheckCircle2 className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "result" && result && (
        <PaymentResultPanel result={result} onStartOver={handleStartOver} />
      )}
    </div>
  );
}
