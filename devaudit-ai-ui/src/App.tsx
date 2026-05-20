import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SignUpPage from './pages/SignUp';
import HybridProtectedRoute from './components/HybridProtectedRoute';

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Router>
        <Routes>
        {/* PUBLIC PLATFORM LANDING PORTAL */}
        <Route path="/" element={<Landing />} />

        {/* CUSTOM SIGN-IN PATHWAY */}
        <Route
          path="/login"
          element={
            <>
              <SignedOut>
                <Login />
              </SignedOut>
              <SignedIn>
                <Navigate to="/workspace" replace />
              </SignedIn>
            </>
          }
        />

        {/* CUSTOM SIGN-UP PATHWAY */}
        <Route
          path="/signup"
          element={
            <>
              <SignedOut>
                <SignUpPage />
              </SignedOut>
              <SignedIn>
                <Navigate to="/workspace" replace />
              </SignedIn>
            </>
          }
        />

        {/* 🔒 PROTECTED CORE WORKSPACE ROUTE */}
        <Route
          path="/workspace"
          element={
            <HybridProtectedRoute>
              <Dashboard />
            </HybridProtectedRoute>
          }
        />

        {/* CATCH-ALL FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  </div>
  );
}