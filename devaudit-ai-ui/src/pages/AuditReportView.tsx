import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import ReactMarkdown from 'react-markdown';
import { apiClient } from '../api';
import { getAuthHeaders } from '../utils/auth';
import { Download, Terminal, Code2, ShieldAlert } from 'lucide-react';

interface ReportData {
  status: string;
  repoName: string;
  scanStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  analysisReport?: string;
  score?: number;
  securityCount?: number;
  performanceCount?: number;
  qualityCount?: number;
}

export default function AuditReportView({ repoId }: { repoId?: string | null }) {
  const { getToken } = useAuth();

  // 🔄 React Query to fetch the dynamic analysis data packets from your backend worker database
  const { data: report, isLoading, refetch } = useQuery({
    queryKey: ['auditReport', repoId],
    queryFn: async () => {
      if (!repoId) return Promise.resolve(null as any);
      const headers = await getAuthHeaders(getToken);
      const response = await apiClient.get(`/api/repos/report/${repoId}`, {
        headers,
      });
      return response.data;
    },
    enabled: Boolean(repoId),
    retry: 1,
  });

  const reportData = report as ReportData | null;
  const hasReport = Boolean(reportData && reportData.analysisReport);
  
  const statusLabel = reportData?.scanStatus === 'completed'
    ? 'Scan Completed'
    : reportData?.scanStatus === 'processing'
      ? 'Scan In Progress'
      : reportData?.scanStatus === 'pending'
        ? 'Scan Pending'
        : reportData?.scanStatus === 'failed'
          ? 'Scan Failed'
          : 'Report Status';

  useEffect(() => {
    if (!repoId || !reportData) return;
    if (reportData.scanStatus === 'pending' || reportData.scanStatus === 'processing') {
      const timer = window.setInterval(() => {
        refetch();
      }, 5000);

      return () => window.clearInterval(timer);
    }
  }, [repoId, reportData?.scanStatus, refetch]);

  if (!repoId) {
    return (
      <div className="flex-1 bg-background overflow-y-auto p-8 relative flex items-center justify-center">
        <div className="glass-panel p-8 text-center max-w-md border border-bordermuted bg-surface/30 rounded-xl">
          <h3 className="text-lg font-bold text-textmain">No repository selected</h3>
          <p className="text-sm text-textmuted mt-2">Select a repository from the dashboard to view its audit report.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-background overflow-y-auto p-8 relative min-h-screen">
      {isLoading && (
        <div className="glass-panel p-8 text-center max-w-3xl mx-auto mb-8 border border-bordermuted bg-surface/30 rounded-xl">
          <div className="text-lg font-bold text-textmain animate-pulse">Loading repository analysis...</div>
          <p className="text-sm text-textmuted mt-2">Fetching audit report from MongoDB. This may take a moment.</p>
        </div>
      )}

      {!isLoading && !hasReport && (
        <div className="glass-panel p-8 text-center max-w-3xl mx-auto mb-8 border border-bordermuted bg-surface/30 rounded-xl">
          <div className="text-lg font-bold text-textmain">No audit report found yet</div>
          <p className="text-sm text-textmuted mt-2">This repository has been queued or scanned, but the report has not been produced yet.</p>
          {reportData?.scanStatus && (
            <div className="mt-4 inline-flex rounded-full bg-surface/80 px-4 py-2 text-xs uppercase tracking-widest text-textmuted border border-bordermuted">
              {statusLabel}
            </div>
          )}
        </div>
      )}

      {!isLoading && hasReport && (
        <>
          {/* 🌌 Cinematic Atmosphere Backdrop Glows */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accentblue/5 rounded-full filter blur-[140px] pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-accentpurple/5 rounded-full filter blur-[120px] pointer-events-none" />

          {/* TOP HEADER STATUS ACTION TRACK */}
          <header className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-8 relative z-10 border-b border-bordermuted pb-6">
            <div>
              <div className="text-xs font-mono text-accentcyan uppercase tracking-widest">Diagnostic Summary Ledgers</div>
              <h1 className="text-3xl font-black mt-1 tracking-tight text-white">{reportData?.repoName}</h1>
              <span className="mt-3 inline-flex rounded-full bg-panel border border-accentblue/30 px-3 py-1 text-[11px] uppercase tracking-wider text-accentcyan font-medium font-mono">
                {statusLabel}
              </span>
            </div>
            <button className="bg-panel border border-bordermuted hover:border-accentblue/50 text-textmain px-5 py-2.5 rounded-lg font-semibold text-sm shadow-glass transition-all flex items-center gap-2 cursor-pointer">
              <Download size={15} />
              Export Audit Report
            </button>
          </header>

          {/* 🏗️ MAIN TWO-COLUMN DASHBOARD REPORT INTERFACE */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative z-10">
            
            {/* 📊 LEFT PANEL Column Track (Width 4/12): METRIC RING PANEL */}
            <div className="xl:col-span-4 space-y-6">
              <div className="glass-panel p-6 flex flex-col items-center text-center border border-bordermuted bg-surface/20 rounded-2xl">
                <h3 className="text-sm font-bold tracking-wider text-textmuted uppercase mb-6 self-start">Review Summary</h3>
                
                {/* Visual Ring Component Match */}
                <div className="relative h-44 w-44 flex items-center justify-center mb-6">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" className="stroke-surface" strokeWidth="8" fill="transparent" />
                    <circle cx="50" cy="50" r="40" className="stroke-accentblue" strokeWidth="8" fill="transparent" 
                            strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (reportData?.score ?? 0)) / 10} strokeLinecap="round" />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-xs uppercase font-mono tracking-widest text-textmuted">Score</span>
                    <span className="text-5xl font-black text-textmain mt-0.5">{reportData?.score ?? 0}</span>
                  </div>
                </div>

                {/* In-Depth Counter Breakdown Panel Blocks */}
                <div className="w-full border-t border-bordermuted/60 pt-6 space-y-3">
                  <div className="flex justify-between items-center p-3 bg-surface/50 rounded-lg border border-bordermuted">
                    <span className="text-sm text-textmuted flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-accentblue" /> Security Counts
                    </span>
                    <span className="font-mono text-sm font-bold text-accentcyan">{reportData?.securityCount ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-surface/50 rounded-lg border border-bordermuted">
                    <span className="text-sm text-textmuted flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-accentpurple" /> Performance Indices
                    </span>
                    <span className="font-mono text-sm font-bold text-accentpurple">{reportData?.performanceCount ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-surface/50 rounded-lg border border-bordermuted">
                    <span className="text-sm text-textmuted flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-accentgreen" /> Quality Standards
                    </span>
                    <span className="font-mono text-sm font-bold text-accentgreen">{reportData?.qualityCount ?? 0}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 📑 RIGHT PANEL Column Track (Width 8/12): DYNAMIC MARKDOWN TEXT FLOW */}
            <div className="xl:col-span-8 space-y-6">
              <div className="bg-surface/40 border border-bordermuted/80 rounded-2xl p-8 backdrop-blur-md shadow-2xl">
                <article className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-sm">
                  <ReactMarkdown
                    components={{
                      h1: ({ ...props }) => (
                        <h1 className="text-2xl font-black text-white border-b border-bordermuted/60 pb-3 mb-6 mt-2 flex items-center gap-2" {...props} />
                      ),
                      h2: ({ ...props }) => {
                        const text = String(props.children || '');
                        let icon = <Code2 size={18} className="text-accentpurple" />;
                        if (text.includes('Security')) icon = <ShieldAlert size={18} className="text-accentred" />;
                        if (text.includes('Quality') || text.includes('Performance') || text.includes('Optimization')) {
                          icon = <Terminal size={18} className="text-accentcyan" />;
                        }
                        
                        return (
                          <h2 className="text-lg font-bold text-white mt-8 mb-4 border-l-4 border-accentblue pl-3 flex items-center gap-2 bg-surface/20 py-2 pr-4 rounded-r-lg" {...props}>
                            {icon}
                            {props.children}
                          </h2>
                        );
                      },
                      h3: ({ ...props }) => (
                        <h3 className="text-sm font-bold text-accentcyan mt-5 mb-2 font-mono uppercase tracking-wider" {...props} />
                      ),
                      p: ({ ...props }) => (
                        <p className="mb-4 text-slate-300 text-justify font-sans leading-relaxed" {...props} />
                      ),
                      ul: ({ ...props }) => (
                        <ul className="list-none pl-0 mb-5 space-y-3" {...props} />
                      ),
                      li: ({ ...props }) => {
                        const content = String(props.children || '');
                        if (content.startsWith('**Issue**') || content.startsWith('**Risk**') || content.startsWith('**Recommendation**') || content.startsWith('**Impact**') || content.startsWith('**Observation**')) {
                          return <li className="text-slate-300 bg-panel/30 border border-bordermuted/40 rounded-lg px-4 py-2.5 my-1.5 font-sans" {...props} />;
                        }
                        return <li className="text-white font-bold text-base mt-4 border-b border-bordermuted/20 pb-1" {...props} />;
                      },
                      strong: ({ ...props }) => (
                        <strong className="text-white font-semibold bg-surface px-1.5 py-0.5 rounded border border-bordermuted/40 mr-1 text-xs uppercase font-mono tracking-wide" {...props} />
                      ),
                      code: ({ ...props }) => (
                        <code className="bg-panel px-1.5 py-0.5 rounded font-mono text-xs text-pink-400 border border-bordermuted/40" {...props} />
                      ),
                    }}
                  >
                    {reportData?.analysisReport || ''}
                  </ReactMarkdown>
                </article>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}