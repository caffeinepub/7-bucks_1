import { useEffect, useState } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useActor } from './hooks/useActor';
import { useQuery } from '@tanstack/react-query';
import { UserRole } from './backend';
import LoginScreen from './features/auth/LoginScreen';
import PaymentWizardPage from './features/payments/PaymentWizardPage';
import AdminCredentialsPage from './features/admin/AdminCredentialsPage';
import AdminTransactionsPage from './features/admin/AdminTransactionsPage';
import AppShell from './components/AppShell';
import ProfileSetupModal from './features/auth/ProfileSetupModal';
import { Toaster } from './components/ui/sonner';
import { registerServiceWorker } from './pwa/registerServiceWorker';

type View = 'payment' | 'admin-credentials' | 'admin-transactions';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const [currentView, setCurrentView] = useState<View>('payment');

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  // Register service worker for PWA
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Fetch user profile
  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useQuery({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });

  // Fetch user role
  const {
    data: userRole,
    isLoading: roleLoading,
  } = useQuery({
    queryKey: ['currentUserRole'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });

  const isAdmin = userRole === UserRole.admin;
  const showProfileSetup = isAuthenticated && !profileLoading && profileFetched && userProfile === null;

  // Reset to payment view when logging out
  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentView('payment');
    }
  }, [isAuthenticated]);

  if (isInitializing || actorFetching) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen />
        <Toaster />
      </>
    );
  }

  return (
    <>
      <AppShell
        isAdmin={isAdmin}
        currentView={currentView}
        onViewChange={setCurrentView}
      >
        {currentView === 'payment' && <PaymentWizardPage />}
        {currentView === 'admin-credentials' && isAdmin && <AdminCredentialsPage />}
        {currentView === 'admin-transactions' && isAdmin && <AdminTransactionsPage />}
      </AppShell>
      {showProfileSetup && <ProfileSetupModal />}
      <Toaster />
    </>
  );
}
