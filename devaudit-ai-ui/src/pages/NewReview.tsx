import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import { apiClient } from '../api';
import { getAuthHeaders } from '../utils/auth';
import { Shield, GitBranch, Terminal, Globe, AlertCircle, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSidebarTab } from '../store/uiSlice';

export default function NewReview() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const { getToken } = useAuth();

  // Component States
  const [repoUrl, setRepoUrl] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('main');
  const [scanSuccess, setScanSuccess] = useState(false);
  const [errorLog, setErrorLog] = useState<string | null>(null);

  // 🔄 React Query Mutation Engine to communicate with your Express backend
  const scanMutation = useMutation({
    mutationFn: async (submitData: { url: string; branch: string }) => {
      setErrorLog(null);
      // Parse owner and repo name from common Git URL formats
      const match = submitData.url.match(/github.com[:\/ ]([^\/]+)\/([^\/]+)(?:\.git)?$/i);
      if (!match) throw { response: { data: { message: 'Invalid GitHub repository URL. Use https://github.com/owner/repo.git' } } };
      const owner = match[1];
      const repoName = match[2].replace(/\.git$/i, '');

      // Points straight to your local Node.js API server
      const headers = await getAuthHeaders(getToken);
      const response = await apiClient.post(
        '/api/repos/scan',
        {
          owner,
          repoName,
          branch: submitData.branch,
        },
        {
          headers: {
            ...headers,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      setScanSuccess(true);
      // Invalidate active dashboard query state vectors so metrics revalidation updates instantly
      queryClient.invalidateQueries({ queryKey: ['repoMetrics'] });
      
      // Delay navigation slightly so user experiences product success check mark state
      setTimeout(() => {
        dispatch(setSidebarTab('dashboard'));
      }, 2000);
    },
    onError: (err: any) => {
      // 🟢 THE FRONTEND FIX: Read your specific backend error message parameters
      const fallbackError = 
        err.response?.data?.message || 
        err.response?.data?.error || 
        err.response?.data?.detail || 
        "Failed to establish a verification handshake with backend core orchestrators.";
      
      setErrorLog(fallbackError);
    }
  });

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!repoUrl) return;
    scanMutation.mutate({ url: repoUrl, branch: selectedBranch });
  };

  return (
    <div className="flex-1 bg-background overflow-y-auto p-8 relative">
      {/* 🌌 Cyber Ambient Lighting Background Matrices */}
      <div className="absolute top-0 right-1/3 w-[500px] h-[500px] bg-accentblue/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-accentcyan/5 rounded-full filter blur-[100px] pointer-events-none" />

      {/* HEADER SECTION */}
      <header className="mb-10 relative z-10">
        <h1 className="text-3xl font-extrabold tracking-tight">Connect Repository Pipeline</h1>
        <p className="text-textmuted text-sm mt-1">Ingest codebase fragments into vector collections to initialize structural deep scans.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* 🛠️ LEFT/CENTER PANEL: AUDIT INITIALIZATION INTERFACE */}
        <div className="lg:col-span-2 space-y-6">
          {scanSuccess ? (
            /* 🎉 SUCCESS CARD MATRIX DISPLAY */
            <div className="glass-panel p-8 text-center border-accentgreen/30 bg-accentgreen/5 flex flex-col items-center justify-center space-y-4 animate-fade-in">
              <div className="h-14 w-14 bg-accentgreen/10 text-accentgreen border border-accentgreen/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-textmain">Repository Ingestion Complete</h3>
              <p className="text-textmuted max-w-md text-sm">
                Code snippets segmented into vector chunks successfully. Compiling deep structural audit summaries...
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-accentcyan animate-pulse">
                <Loader2 size={12} className="animate-spin" /> Bouncing down to operational dashboard...
              </div>
            </div>
          ) : (
            /* 📥 MAIN INGESTION TARGET INPUT FORM */
            <form onSubmit={handleStartAudit} className="glass-panel p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-bordermuted pb-4">
                <Terminal size={18} className="text-accentblue" />
                <h2 className="text-lg font-bold">Manual Target Configuration</h2>
              </div>

              {errorLog && (
                <div className="p-4 bg-accentred/10 border border-accentred/20 text-accentred rounded-lg text-sm flex items-start gap-3">
                  <AlertCircle size={18} className="shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{errorLog}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-textmain text-xs font-semibold uppercase tracking-wider block">Repository Clone Endpoint URL</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-textmuted">
                    <Globe size={16} />
                  </div>
                  <input
                    type="url"
                    required
                    disabled={scanMutation.isPending}
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/profile/repository-name.git"
                    className="w-full bg-surface border border-bordermuted text-textmain placeholder-textmuted/50 rounded-lg pl-10 pr-4 py-3 text-sm focus:border-accentblue focus:ring-1 focus:ring-accentblue transition-all outline-none disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-textmain text-xs font-semibold uppercase tracking-wider block">Target Branch Namespace</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-textmuted">
                      <GitBranch size={16} />
                    </div>
                    <input
                      type="text"
                      required
                      disabled={scanMutation.isPending}
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      placeholder="main"
                      className="w-full bg-surface border border-bordermuted text-textmain rounded-lg pl-10 pr-4 py-3 text-sm focus:border-accentblue focus:ring-1 focus:ring-accentblue transition-all outline-none disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-textmain text-xs font-semibold uppercase tracking-wider block">Engine Architecture Context</label>
                  <div className="w-full bg-surface border border-bordermuted text-textmuted rounded-lg px-4 py-3 text-sm flex items-center select-none cursor-not-allowed opacity-60">
                    <Shield size={16} className="mr-2 text-accentcyan" /> Vector Grounding (GPT-4o)
                  </div>
                </div>
              </div>

              <div className="border-t border-bordermuted/60 pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={scanMutation.isPending || !repoUrl}
                  className="bg-gradient-to-r from-accentblue to-accentpurple hover:opacity-90 disabled:opacity-40 text-textmain font-bold px-6 py-3 rounded-lg text-sm shadow-glowblue transition-all flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                >
                  {scanMutation.isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Analyzing Base Blocks...
                    </>
                  ) : (
                    <>
                      Execute Vector Scan Pipeline
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* 🗂️ ACTIVE WORKSPACE SIMULATION SELECTOR GRID */}
          <div className="glass-panel p-6">
            <h3 className="text-sm font-semibold tracking-wider text-textmuted uppercase mb-4">Available Connected Git Accounts</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'devaudit-core-service', lang: 'TypeScript', privacy: 'Public' },
                { name: 'payment-gateway-api', lang: 'GoLang', privacy: 'Private' },
              ].map((mock, i) => (
                <div 
                  key={i} 
                  onClick={() => !scanMutation.isPending && setRepoUrl(`https://github.com/developer/${mock.name}.git`)}
                  className="p-4 bg-surface/40 border border-bordermuted rounded-xl hover:border-accentblue/40 transition-all cursor-pointer flex justify-between items-center group"
                >
                  <div className="space-y-1">
                    <div className="font-medium text-textmain group-hover:text-accentcyan transition-all text-sm">{mock.name}</div>
                    <div className="text-xs text-textmuted flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-accentpurple" /> {mock.lang}
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded border border-bordermuted bg-panel text-textmuted">
                    {mock.privacy}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ℹ️ RIGHT PANEL: OPERATIONAL PARAMETERS AND INSTRUCTIONS */}
        <aside className="space-y-6">
          <div className="glass-panel p-6 border-accentblue/20 bg-accentblue/5">
            <h3 className="font-bold text-base mb-2 flex items-center gap-2">
              <Shield size={16} className="text-accentcyan" /> Ingestion Audit Rules
            </h3>
            <ul className="text-xs text-textmuted space-y-3 list-disc list-inside leading-relaxed">
              <li>Chunks automatically aggregate using a structural token-aware split ceiling at <code className="text-accentpurple bg-panel px-1 py-0.5 rounded">800 tokens</code>.</li>
              <li>Overlap arrays preserve cross-file function calls cleanly up to 150 boundary tokens.</li>
              <li>Sensitive infrastructure nodes match cryptographic hashes instantly within the local ephemeral database layer.</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}