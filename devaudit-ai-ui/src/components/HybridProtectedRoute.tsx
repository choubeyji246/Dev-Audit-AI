import { Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { getManualToken } from '../utils/auth';

interface HybridProtectedRouteProps {
  children: React.ReactNode;
}

export default function HybridProtectedRoute({ children }: HybridProtectedRouteProps) {
  const { isSignedIn, isLoaded } = useAuth();
  
  const hasManualToken = Boolean(getManualToken());

  // Wait until Clerk completes its initial loading phase
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-sm text-textmuted animate-pulse font-mono">Securing execution context...</div>
      </div>
    );
  }

  // If authenticated via Clerk OR via custom Manual database tokens, mount securely
  if (isSignedIn || hasManualToken) {
    return <>{children}</>;
  }

  // Fail-safe ejection to the gateway entry path
  return <Navigate to="/login" replace />;
}