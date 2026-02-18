import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../../hooks/useActor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Textarea } from '../../components/ui/textarea';
import { AlertCircle, CheckCircle2, Loader2, Save, Shield } from 'lucide-react';

export default function AdminCredentialsPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [merchantId, setMerchantId] = useState('');
  const [additionalConfig, setAdditionalConfig] = useState('');

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      const credentials = JSON.stringify({
        apiKey,
        apiSecret,
        merchantId,
        additionalConfig: additionalConfig || undefined,
      });
      
      await actor.createOrUpdateApiCredentials('contipay', credentials, true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apiCredentials'] });
      setApiKey('');
      setApiSecret('');
      setMerchantId('');
      setAdditionalConfig('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">ContiPay API Configuration</h1>
        <p className="text-muted-foreground">
          Securely store your ContiPay API credentials. All data is encrypted before storage.
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <CardTitle>API Credentials</CardTitle>
          </div>
          <CardDescription>
            Enter your ContiPay merchant credentials. These will be encrypted and stored securely.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {saveMutation.isSuccess && (
              <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-900 dark:text-green-100">
                  API credentials saved successfully and encrypted.
                </AlertDescription>
              </Alert>
            )}

            {saveMutation.isError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {saveMutation.error instanceof Error
                    ? saveMutation.error.message
                    : 'Failed to save credentials'}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your ContiPay API key"
                disabled={saveMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiSecret">API Secret</Label>
              <Input
                id="apiSecret"
                type="password"
                value={apiSecret}
                onChange={(e) => setApiSecret(e.target.value)}
                placeholder="Enter your ContiPay API secret"
                disabled={saveMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="merchantId">Merchant ID</Label>
              <Input
                id="merchantId"
                value={merchantId}
                onChange={(e) => setMerchantId(e.target.value)}
                placeholder="7BUCKS_ZIM_PLC"
                disabled={saveMutation.isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="additionalConfig">Additional Configuration (Optional)</Label>
              <Textarea
                id="additionalConfig"
                value={additionalConfig}
                onChange={(e) => setAdditionalConfig(e.target.value)}
                placeholder="Enter any additional configuration as JSON"
                rows={4}
                disabled={saveMutation.isPending}
              />
              <p className="text-sm text-muted-foreground">
                Add any extra fields required by ContiPay (e.g., base URLs, endpoints)
              </p>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your credentials are encrypted before being stored and are never exposed in plaintext.
              </AlertDescription>
            </Alert>

            <Button
              type="submit"
              className="w-full"
              disabled={saveMutation.isPending || !apiKey || !apiSecret || !merchantId}
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving & Encrypting...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Credentials
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Alert className="mt-6 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800">
        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertDescription className="text-amber-900 dark:text-amber-100">
          <strong>Note:</strong> Once you receive the complete ContiPay API documentation with endpoint URLs and required fields, 
          update the additional configuration section with those details.
        </AlertDescription>
      </Alert>
    </div>
  );
}
