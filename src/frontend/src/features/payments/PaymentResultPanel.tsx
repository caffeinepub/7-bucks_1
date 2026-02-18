import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react';
import { Transaction, Variant_pending_success_failed } from '../../backend';

interface PaymentResultPanelProps {
  result: Transaction;
  onStartOver: () => void;
}

export default function PaymentResultPanel({ result, onStartOver }: PaymentResultPanelProps) {
  const isSuccess = result.status === Variant_pending_success_failed.success;
  const isPending = result.status === Variant_pending_success_failed.pending;
  const isFailed = result.status === Variant_pending_success_failed.failed;

  return (
    <Card>
      <CardHeader className="text-center">
        {isSuccess && (
          <>
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">Payment Successful!</CardTitle>
            <CardDescription>Your funds have been sent to EcoCash</CardDescription>
          </>
        )}
        {isPending && (
          <>
            <div className="mx-auto w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mb-4">
              <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
            </div>
            <CardTitle className="text-2xl">Payment Processing</CardTitle>
            <CardDescription>Your payment is being processed</CardDescription>
          </>
        )}
        {isFailed && (
          <>
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mb-4">
              <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
            </div>
            <CardTitle className="text-2xl">Payment Failed</CardTitle>
            <CardDescription>We couldn't process your payment</CardDescription>
          </>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 p-4 bg-muted rounded-lg">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount sent:</span>
            <span className="font-medium">${Number(result.amountUsd).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total charged:</span>
            <span className="font-medium">${Number(result.totalCharged).toFixed(2)}</span>
          </div>
          {result.contiPayReference && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Reference:</span>
              <span className="font-mono text-sm">{result.contiPayReference}</span>
            </div>
          )}
        </div>

        {isFailed && result.contiPayError && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{result.contiPayError}</AlertDescription>
          </Alert>
        )}

        <Button onClick={onStartOver} className="w-full">
          Make Another Payment <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
