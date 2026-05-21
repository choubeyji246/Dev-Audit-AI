import { useEffect, useState } from 'react';
import { SignIn, useAuth } from '@clerk/clerk-react';
import { Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { apiClient } from '../api';
import { getManualToken, setManualToken, setManualUser } from '../utils/auth';

export default function Login() {
  const [mode, setMode] = useState<'clerk' | 'manual'>('clerk');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (getManualToken()) {
      navigate('/workspace');
    }
  }, [navigate]);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate('/workspace');
    }
  }, [isLoaded, isSignedIn, navigate]);

  const handleManualLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    try {
      const response = await apiClient.post('/api/auth/login', {
        email,
        password,
      });

      setManualToken(response.data.token);
      setManualUser(response.data.user);
      navigate('/workspace');
    } catch (loginError: any) {
      setError(loginError?.response?.data?.message || 'Unable to sign in. Please verify your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative p-4">
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-accentblue/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accentpurple/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md z-10 flex flex-col items-center gap-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 bg-accentblue/20 border border-accentblue/40 rounded-xl flex items-center justify-center text-accentcyan shadow-glowblue">
            <Shield size={22} />
          </div>
          <span className="font-black text-2xl tracking-wide bg-gradient-to-r from-textmain via-textmuted to-accentpurple bg-clip-text text-transparent">
            DevAudit AI
          </span>
        </div>

        <div className="glass-panel p-4 w-full border border-bordermuted shadow-glowblue">
          <div className="flex gap-2 mb-6">
            <button
              type="button"
              onClick={() => setMode('clerk')}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                mode === 'clerk'
                  ? 'bg-accentblue text-textmain'
                  : 'bg-surface text-textmuted hover:bg-panel'
              }`}
            >
              Clerk Sign-In
            </button>
            <button
              type="button"
              onClick={() => setMode('manual')}
              className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                mode === 'manual'
                  ? 'bg-accentpurple text-textmain'
                  : 'bg-surface text-textmuted hover:bg-panel'
              }`}
            >
              Manual Login
            </button>
          </div>

          {mode === 'clerk' ? (
            <SignIn
              appearance={{
                elements: {
                  rootBox: 'w-full',
                  cardBox: 'bg-transparent shadow-none border-none p-0 w-full',
                  card: 'bg-transparent shadow-none border-none p-2 w-full',
                  headerTitle: 'text-textmain text-xl font-bold tracking-tight text-center',
                  headerSubtitle: 'text-textmuted text-sm text-center',
                  socialButtonsBlockButton:
                    'bg-surface border border-bordermuted hover:bg-panel text-textmain font-medium rounded-lg transition-all',
                  socialButtonsBlockButtonText: 'text-textmain font-medium',
                  dividerLine: 'bg-bordermuted',
                  dividerText: 'text-textmuted text-xs uppercase tracking-wider',
                  formFieldLabel: 'text-textmain text-xs font-semibold mb-1',
                  formFieldInput:
                    'bg-surface border border-bordermuted text-textmain rounded-lg px-4 py-2.5 focus:border-accentblue focus:ring-1 focus:ring-accentblue transition-all outline-none',
                  formButtonPrimary:
                    'bg-gradient-to-r from-accentblue to-accentpurple hover:opacity-90 text-textmain font-bold rounded-lg py-3 shadow-glowblue transition-all normal-case border-none',
                  footerActionText: 'text-textmuted text-sm',
                  footerActionLink: 'text-accentcyan hover:text-accentcyan/80 font-semibold transition-all',
                },
              }}
              signUpUrl="/signup"
              forceRedirectUrl="/workspace"
            />
          ) : (
            <form onSubmit={handleManualLogin} className="space-y-4">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-textmain">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  className="w-full bg-surface border border-bordermuted text-textmain rounded-lg px-4 py-2.5 focus:border-accentblue focus:ring-1 focus:ring-accentblue transition-all outline-none"
                  placeholder="you@example.com"
                />
              </div>
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-textmain">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  className="w-full bg-surface border border-bordermuted text-textmain rounded-lg px-4 py-2.5 focus:border-accentblue focus:ring-1 focus:ring-accentblue transition-all outline-none"
                  placeholder="Enter your password"
                />
              </div>

              {error && <p className="text-sm text-accentred">{error}</p>}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-accentblue to-accentpurple hover:opacity-90 text-textmain font-bold rounded-lg py-3 shadow-glowblue transition-all"
              >
                Continue with manual auth
              </button>
            </form>
          )}
        </div>

        <div className="text-center text-sm text-textmuted">
          New to DevAudit AI?{' '}
          <Link className="text-accentcyan hover:text-accentcyan/80 font-semibold" to="/signup">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
