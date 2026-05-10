// src/components/Sidebar.tsx

import { useLocation, useNavigate } from 'react-router-dom';
import {
  BarChart3,
  // Send,
  LayoutDashboard,
  Wallet,
  Settings,
  LogOut,
  Menu,
  X,
  PenLine,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../../assets/icons/icon.png';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
  path: string;
}

const userNavigation: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'transactions', label: 'Transactions', icon: PenLine, path: '/transactions' },
  { id: 'reports', label: 'Reports', icon: BarChart3, path: '/reports' },
  { id: 'budgets', label: 'Budgets', icon: Wallet, path: '/budgets' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

const adminNavigation: NavItem[] = [
  { id: 'admin-panel', label: 'Admin Panel', icon: ShieldCheck, path: '/admin-panel' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(true);

  const isAdmin = user?.role === 'admin';
  const navigation = isAdmin ? adminNavigation : userNavigation;

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 hover:bg-bg-secondary rounded-lg transition"
      >
        {isOpen ? (
          <X size={24} className="text-text-primary" />
        ) : (
          <Menu size={24} className="text-text-primary" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed left-0 top-0 h-screen w-64 bg-[var(--card)] sticky transition-transform duration-300 z-40 lg:static lg:translate-x-0 flex flex-col rounded-r-xl`}
        style={{ boxShadow: '4px 0 24px 0 rgba(0,0,0,0.08)' }}
      >
        {/* Logo */}
        <div className="pt-6">
          <div className="flex items-center pt-2">
            <img src={Logo} alt="Logo" className="w-full/2 h-full" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <button
                key={item.id}
                onClick={() => {
                  navigate(item.path);
                  if (window.innerWidth < 1024) setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-secondary border-l-4 border-transparent'
                }`}
              >
                <Icon
                  size={20}
                  className={active ? 'text-blue-600' : 'text-current'}
                />
                <span className={`text-sm font-medium ${active ? 'text-blue-600' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-4 py-2">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-danger hover:bg-danger-light rounded-lg transition font-medium text-sm"
          >
            <LogOut size={20} strokeWidth={1.5} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}