import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { LogOut, Settings, Receipt, Home } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import BrandLogo from './BrandLogo';
import PwaInstallButton from './PwaInstallButton';

interface BrandHeaderProps {
  isAdmin?: boolean;
  currentView?: string;
  onViewChange?: (view: 'payment' | 'admin-credentials' | 'admin-transactions') => void;
}

export default function BrandHeader({ isAdmin, currentView, onViewChange }: BrandHeaderProps) {
  const { clear, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
  };

  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BrandLogo size="md" />
          <h1 className="text-2xl font-bold text-foreground">7 Bucks</h1>
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-4">
            {isAdmin && onViewChange && (
              <nav className="hidden md:flex items-center gap-2">
                <Button
                  variant={currentView === 'payment' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange('payment')}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Payment
                </Button>
                <Button
                  variant={currentView === 'admin-credentials' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange('admin-credentials')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  API Settings
                </Button>
                <Button
                  variant={currentView === 'admin-transactions' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange('admin-transactions')}
                >
                  <Receipt className="w-4 h-4 mr-2" />
                  Transactions
                </Button>
              </nav>
            )}

            <PwaInstallButton />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="md:hidden">
                  Menu
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {isAdmin && onViewChange && (
                  <>
                    <DropdownMenuItem onClick={() => onViewChange('payment')}>
                      <Home className="w-4 h-4 mr-2" />
                      Payment
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onViewChange('admin-credentials')}>
                      <Settings className="w-4 h-4 mr-2" />
                      API Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onViewChange('admin-transactions')}>
                      <Receipt className="w-4 h-4 mr-2" />
                      Transactions
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="hidden md:flex"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
