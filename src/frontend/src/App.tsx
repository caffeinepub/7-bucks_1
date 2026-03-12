import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { UserRole } from "./backend";
import AppShell from "./components/AppShell";
import { Toaster } from "./components/ui/sonner";
import AdminCredentialsPage from "./features/admin/AdminCredentialsPage";
import AdminTransactionsPage from "./features/admin/AdminTransactionsPage";
import LoginScreen from "./features/auth/LoginScreen";
import ProfileSetupModal from "./features/auth/ProfileSetupModal";
import TermsPage from "./features/legal/TermsPage";
import PaymentWizardPage from "./features/payments/PaymentWizardPage";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { registerServiceWorker } from "./pwa/registerServiceWorker";

type View = "payment" | "admin-credentials" | "admin-transactions" | "terms";

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const [currentView, setCurrentView] = useState<View>("payment");

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  // Register service worker for PWA
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Fetch user profile — only when authenticated and actor is ready
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useQuery({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });

  // Fetch user role — only when authenticated and actor is ready
  const { data: userRole } = useQuery({
    queryKey: ["currentUserRole"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });

  const isAdmin = userRole === UserRole.admin;
  const showProfileSetup =
    isAuthenticated &&
    !profileLoading &&
    profileFetched &&
    userProfile === null;

  // Reset to payment view when logging out
  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentView("payment");
    }
  }, [isAuthenticated]);

  // Only block on isInitializing (Internet Identity loading stored session).
  // Do NOT block on actorFetching for unauthenticated users — the anonymous
  // actor creation should not gate the login screen from appearing.
  if (isInitializing) {
    return (
      <AppShell onViewChange={setCurrentView}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  // Show login screen (or terms page) for unauthenticated users
  if (!isAuthenticated) {
    if (currentView === "terms") {
      return (
        <>
          <AppShell onViewChange={setCurrentView}>
            <TermsPage onBack={() => setCurrentView("payment")} />
          </AppShell>
          <Toaster />
        </>
      );
    }
    return (
      <>
        <LoginScreen onViewTerms={() => setCurrentView("terms")} />
        <Toaster />
      </>
    );
  }

  // Authenticated: show a spinner only while the actor is still initializing
  if (actorFetching) {
    return (
      <AppShell onViewChange={setCurrentView}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Initializing session...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <>
      <AppShell
        isAdmin={isAdmin}
        currentView={currentView}
        onViewChange={setCurrentView}
      >
        {currentView === "payment" && <PaymentWizardPage />}
        {currentView === "admin-credentials" && isAdmin && (
          <AdminCredentialsPage />
        )}
        {currentView === "admin-transactions" && isAdmin && (
          <AdminTransactionsPage />
        )}
        {currentView === "terms" && (
          <TermsPage onBack={() => setCurrentView("payment")} />
        )}
      </AppShell>
      {showProfileSetup && <ProfileSetupModal />}
      <Toaster />
    </>
  );
}
