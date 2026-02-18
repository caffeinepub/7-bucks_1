import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import BrandLogo from '../../components/BrandLogo';
import PwaInstallButton from '../../components/PwaInstallButton';

export default function LoginScreen() {
  const { login, loginStatus, loginError } = useInternetIdentity();

  const isLoggingIn = loginStatus === 'logging-in';
  const isError = loginStatus === 'loginError';

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-background to-amber-50 dark:from-teal-950 dark:via-background dark:to-amber-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <BrandLogo size="lg" />
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to 7 Bucks</CardTitle>
          <CardDescription className="text-base">
            Send money from card to EcoCash instantly. Save up to $21 compared to ATM fees.
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
              'Login to Continue'
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
    </div>
  );
}
