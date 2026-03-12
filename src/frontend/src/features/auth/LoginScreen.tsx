import { AlertCircle, Loader2 } from "lucide-react";
import BrandLogo from "../../components/BrandLogo";
import PwaInstallButton from "../../components/PwaInstallButton";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

interface LoginScreenProps {
  onViewTerms?: () => void;
}

export default function LoginScreen({ onViewTerms }: LoginScreenProps) {
  const { login, loginStatus, loginError } = useInternetIdentity();

  const isLoggingIn = loginStatus === "logging-in";
  const isError = loginStatus === "loginError";

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-background to-amber-50 dark:from-teal-950 dark:via-background dark:to-amber-950 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <BrandLogo size="lg" />
          </div>
          <CardTitle className="text-3xl font-bold">
            7-Bucks: The Digital Stipend &amp; Support Bridge
          </CardTitle>
          <CardDescription className="text-base">
            Send money from card to EcoCash instantly. Institutional Fee
            Savings: $21.00 (Compared to Traditional Banking Paths).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isError && loginError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{loginError.message}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={login}
            disabled={isLoggingIn}
            className="w-full h-12 text-lg font-semibold"
            size="lg"
          >
            {isLoggingIn ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Connecting...
              </>
            ) : (
              "Login to Continue"
            )}
          </Button>

          <div className="flex justify-center">
            <PwaInstallButton variant="outline" size="default" />
          </div>

          <div className="text-center text-sm text-muted-foreground">
            <p>Secure authentication powered by Internet Identity</p>
          </div>
        </CardContent>
      </Card>

      {/* Footer on login screen */}
      <footer className="mt-8 max-w-md w-full space-y-2 text-center">
        <p className="text-xs font-medium text-muted-foreground">
          © 2026 Mahachi Desmond Private Limited. All Rights Reserved.
        </p>
        <p className="text-xs text-muted-foreground">
          7-Bucks is a Technical Service Provider (TSP). We are not a bank or a
          licensed money transmitter.
        </p>
        <p className="text-xs text-muted-foreground">
          Financial processing, card acquisition, and EcoCash USD settlements
          are securely handled by <strong>ContiPay</strong> (A Licensed Payment
          Service Provider regulated by the Reserve Bank of Zimbabwe).
        </p>
        {onViewTerms && (
          <button
            type="button"
            onClick={onViewTerms}
            className="text-xs text-primary hover:underline font-medium mt-1"
          >
            Terms of Service &amp; Operational Policy
          </button>
        )}
      </footer>
    </div>
  );
}
