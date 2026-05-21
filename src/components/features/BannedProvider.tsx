// src/components/features/BannedProvider.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface BannedProviderProps {
  children: React.ReactNode;
}

export default function BannedProvider({ children }: BannedProviderProps) {
  const { user } = useAuth();

  if (user?.status === false) {
    return <Navigate to="/banned-information" replace />;
  }

  return <>{children}</>;
}