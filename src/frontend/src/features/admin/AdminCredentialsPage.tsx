import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Copy,
  Eye,
  EyeOff,
  Key,
  Loader2,
  RefreshCw,
  Shield,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
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
import { Textarea } from "../../components/ui/textarea";
import { useActor } from "../../hooks/useActor";

export default function AdminCredentialsPage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [sslCertificate, setSslCertificate] = useState("");
  const [showApiSecret, setShowApiSecret] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      const credentials = JSON.stringify({
        apiKey,
        apiSecret,
        sslCertificate,
      });
      await actor.createOrUpdateApiCredentials("contipay", credentials, true);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["apiCredentials"] });
      toast.success("Configuration saved and encrypted successfully.");
    },
    onError: (err) => {
      toast.error(
        err instanceof Error ? err.message : "Failed to save configuration",
      );
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate();
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  const regenerateSecret = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const newSecret = Array.from(
      { length: 32 },
      () => chars[Math.floor(Math.random() * chars.length)],
    ).join("");
    setApiSecret(newSecret);
    toast.success("New secret generated — remember to save.");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">ContiPay API Configuration</h1>
        <p className="text-muted-foreground">
          Securely store your ContiPay API credentials. All data is encrypted
          before storage.
        </p>
      </div>

      {/* Account Security */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <span className="font-semibold text-base">Account Security</span>
            </div>
            <Button variant="outline" size="sm" type="button">
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Credentials Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-primary" />
            <CardTitle>API Credentials</CardTitle>
          </div>
          <CardDescription>
            Enter your ContiPay merchant credentials. These will be encrypted
            and stored securely.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {saveMutation.isSuccess && (
              <Alert
                className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                data-ocid="admin.save.success_state"
              >
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-900 dark:text-green-100">
                  API credentials saved successfully and encrypted.
                </AlertDescription>
              </Alert>
            )}

            {saveMutation.isError && (
              <Alert variant="destructive" data-ocid="admin.save.error_state">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {saveMutation.error instanceof Error
                    ? saveMutation.error.message
                    : "Failed to save credentials"}
                </AlertDescription>
              </Alert>
            )}

            {/* API Key */}
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="apiKey"
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your ContiPay API key"
                  disabled={saveMutation.isPending}
                  className="font-mono"
                  data-ocid="admin.apikey.input"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(apiKey, "API Key")}
                  disabled={!apiKey}
                  title="Copy API Key"
                  data-ocid="admin.apikey.copy_button"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* API Secret */}
            <div className="space-y-2">
              <Label htmlFor="apiSecret">API Secret</Label>
              <div className="flex gap-2">
                <Input
                  id="apiSecret"
                  type={showApiSecret ? "text" : "password"}
                  value={apiSecret}
                  onChange={(e) => setApiSecret(e.target.value)}
                  placeholder="Enter your ContiPay API secret"
                  disabled={saveMutation.isPending}
                  className="font-mono"
                  data-ocid="admin.apisecret.input"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setShowApiSecret((v) => !v)}
                  title={showApiSecret ? "Hide secret" : "Show secret"}
                  data-ocid="admin.apisecret.toggle"
                >
                  {showApiSecret ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={regenerateSecret}
                  title="Regenerate secret"
                  data-ocid="admin.apisecret.secondary_button"
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => copyToClipboard(apiSecret, "API Secret")}
                  disabled={!apiSecret}
                  title="Copy API Secret"
                  data-ocid="admin.apisecret.copy_button"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* SSL Certificate */}
            <div className="space-y-2">
              <Label htmlFor="sslCertificate">
                API SSL (Public Certificate)
              </Label>
              <Textarea
                id="sslCertificate"
                value={sslCertificate}
                onChange={(e) => setSslCertificate(e.target.value)}
                placeholder="-----BEGIN CERTIFICATE----- Paste your SSL certificate content here -----END CERTIFICATE-----"
                rows={7}
                disabled={saveMutation.isPending}
                className="font-mono text-sm resize-none"
                data-ocid="admin.ssl.textarea"
              />
              <p className="text-sm text-muted-foreground">
                Upload your public SSL certificate for secure disbursement
                transactions
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={saveMutation.isPending || !apiKey || !apiSecret}
              data-ocid="admin.save.submit_button"
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving & Encrypting...
                </>
              ) : (
                "Save Configuration"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Merchant Accounts */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Building2 className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-semibold text-base">Merchant Accounts</p>
              <p className="text-sm text-muted-foreground">
                Manage your merchant accounts and configurations
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
