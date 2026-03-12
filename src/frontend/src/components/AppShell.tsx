import type { ReactNode } from "react";
import BrandHeader from "./BrandHeader";

interface AppShellProps {
  children: ReactNode;
  isAdmin?: boolean;
  currentView?: string;
  onViewChange?: (
    view: "payment" | "admin-credentials" | "admin-transactions" | "terms",
  ) => void;
}

export default function AppShell({
  children,
  isAdmin,
  currentView,
  onViewChange,
}: AppShellProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <BrandHeader
        isAdmin={isAdmin}
        currentView={currentView}
        onViewChange={onViewChange}
      />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        {children}
      </main>
      <footer className="border-t border-border py-8 mt-12 bg-card">
        <div className="container mx-auto px-4 max-w-4xl space-y-3 text-center">
          <p className="text-sm font-medium text-foreground">
            © 2026 Mahachi Desmond Private Limited. All Rights Reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            7-Bucks is a Technical Service Provider (TSP). We are not a bank or
            a licensed money transmitter.
          </p>
          <p className="text-sm text-muted-foreground">
            Financial processing, card acquisition, and EcoCash USD settlements
            are securely handled by{" "}
            <strong className="text-foreground">ContiPay</strong> (A Licensed
            Payment Service Provider regulated by the Reserve Bank of Zimbabwe).
          </p>
          {onViewChange && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onViewChange("terms")}
                className="text-sm text-primary hover:underline font-medium"
              >
                Terms of Service &amp; Operational Policy
              </button>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
