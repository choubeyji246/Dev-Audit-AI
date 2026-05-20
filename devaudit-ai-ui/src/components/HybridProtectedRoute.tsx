import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { getManualToken } from '../utils/auth';

interface HybridProtectedRouteProps {
  children: React.ReactNode;
}

export default function HybridProtectedRoute({ children }: HybridProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useAuth();
  const [manualToken, setManualToken] = useState<string | null>(null);

  useEffect(() => {
    setManualToken(getManualToken());
  }, []);

  if (!isLoaded) {
    return null;
  }

  if (isSignedIn || manualToken) {
    return <>{children}</>;
  }

  return <Navigate to="/login" replace />;
}
