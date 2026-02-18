import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Progress } from '../../components/ui/progress';
import { AlertCircle, ArrowRight, ArrowLeft, CheckCircle2, Loader2, DollarSign } from 'lucide-react';
import { validateCardNumber, validateCVV, validateExpiry, validateAmount, validateEcoCashNumber } from './validation';
import { usePaymentOrchestration } from './usePaymentOrchestration';
import PaymentResultPanel from './PaymentResultPanel';

type Step = 'card' | 'details' | 'confirm' | 'result';

export default function PaymentWizardPage() {
  const [step, setStep] = useState<Step>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiry, setExpiry] = useState('');
  const [ecoCashNumber, setEcoCashNumber] = useState('');
  const [amount, setAmount] = useState('');

  const { initiatePayment, isPending, result, reset } = usePaymentOrchestration();

  const stepProgress = {
    card: 33,
    details: 66,
    confirm: 100,
    result: 100,
  };

  const handleCardNext = () => {
    if (validateCardNumber(cardNumber) && validateCVV(cvv) && validateExpiry(expiry)) {
      setStep('details');
    }
  };

  const handleDetailsNext = () => {
    if (validateEcoCashNumber(ecoCashNumber) && validateAmount(amount)) {
      setStep('confirm');
    }
  };

  const handleConfirm = async () => {
    const amountNum = parseFloat(amount);
    await initiatePayment({
      cardNumber,
      cvv,
      expiry,
      ecoCashNumber,
      amount: amountNum,
    });
    setStep('result');
  };

  const handleStartOver = () => {
    setStep('card');
    setCardNumber('');
    setCvv('');
    setExpiry('');
    setEcoCashNumber('');
    setAmount('');
    reset();
  };

  const totalCharged = amount ? (parseFloat(amount) * 1.07).toFixed(2) : '0.00';
  const savings = '21.00';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Send Money to EcoCash</h1>
        <p className="text-muted-foreground">Fast, secure, and cheaper than ATM withdrawals</p>
      </div>

      {step !== 'result' && (
        <div className="mb-6">
          <Progress value={stepProgress[step]} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span className={step === 'card' ? 'text-primary font-medium' : ''}>Card Details</span>
            <span className={step === 'details' ? 'text-primary font-medium' : ''}>Payment Info</span>
            <span className={step === 'confirm' ? 'text-primary font-medium' : ''}>Confirm</span>
          </div>
        </div>
      )}

      {step === 'card' && (
        <Card>
          <CardHeader>
            <CardTitle>Enter Card Details</CardTitle>
            <CardDescription>Your card information is secure and encrypted</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, ''))}
                placeholder="1234 5678 9012 3456"
                maxLength={16}
              />
              {cardNumber && !validateCardNumber(cardNumber) && (
                <p className="text-sm text-destructive">Please enter a valid 16-digit card number</p>
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

            <Button
              onClick={handleCardNext}
              disabled={!validateCardNumber(cardNumber) || !validateCVV(cvv) || !validateExpiry(expiry)}
              className="w-full"
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'details' && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Enter the recipient's EcoCash number and amount</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="ecoCash">Parent's EcoCash Number</Label>
              <Input
                id="ecoCash"
                value={ecoCashNumber}
                onChange={(e) => setEcoCashNumber(e.target.value)}
                placeholder="0771234567"
              />
              {ecoCashNumber && !validateEcoCashNumber(ecoCashNumber) && (
                <p className="text-sm text-destructive">Please enter a valid phone number</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (USD)</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="amount"
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
                <p className="text-sm text-destructive">Amount must be greater than 0</p>
              )}
            </div>

            {amount && validateAmount(amount) && (
              <Alert className="bg-teal-50 dark:bg-teal-950 border-teal-200 dark:border-teal-800">
                <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                <AlertDescription className="text-teal-900 dark:text-teal-100">
                  <strong>You save ${savings} compared to the ATM!</strong>
                  <div className="mt-2 text-sm space-y-1">
                    <p>Recipient receives: ${parseFloat(amount).toFixed(2)}</p>
                    <p>You will be charged: ${totalCharged}</p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('card')} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={handleDetailsNext}
                disabled={!validateEcoCashNumber(ecoCashNumber) || !validateAmount(amount)}
                className="flex-1"
              >
                Next <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'confirm' && (
        <Card>
          <CardHeader>
            <CardTitle>Confirm Payment</CardTitle>
            <CardDescription>Please review your payment details</CardDescription>
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
                <span className="text-muted-foreground">Recipient receives:</span>
                <span className="font-medium">${parseFloat(amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total charge:</span>
                <span>${totalCharged}</span>
              </div>
            </div>

            <Alert className="bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-amber-900 dark:text-amber-100">
                By confirming, you authorize 7 Bucks to charge your card and send funds to the specified EcoCash account.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('details')} className="flex-1" disabled={isPending}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button onClick={handleConfirm} disabled={isPending} className="flex-1">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    Confirm Payment <CheckCircle2 className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'result' && result && (
        <PaymentResultPanel result={result} onStartOver={handleStartOver} />
      )}
    </div>
  );
}
