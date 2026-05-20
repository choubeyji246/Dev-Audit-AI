import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import Landing from './pages/Landing';   // 💡 Import your gorgeous new landing page
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SignUpPage from './pages/SignUp';

export default function App() {
  return (
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
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <Navigate to="/login" replace />
              </SignedOut>
            </>
          }
        />

        {/* CATCH-ALL FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}