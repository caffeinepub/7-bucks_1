import { ReactNode } from 'react';
import BrandHeader from './BrandHeader';

interface AppShellProps {
  children: ReactNode;
  isAdmin?: boolean;
  currentView?: string;
  onViewChange?: (view: 'payment' | 'admin-credentials' | 'admin-transactions') => void;
}

export default function AppShell({ children, isAdmin, currentView, onViewChange }: AppShellProps) {
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
      <footer className="border-t border-border py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} 7 Bucks. Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
