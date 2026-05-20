import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { getAuthHeaders } from '../utils/auth';
import { ShieldAlert, Download, ChevronRight, AlertTriangle } from 'lucide-react';

interface Issue {
  id: string;
  title: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  file: string;
  line: number;
  description: string;
  suggestion: string;
  category: 'Security' | 'Performance' | 'Quality';
}

interface ReportData {
  status: string;
  repoName: string;
  scanStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  score?: number;
  securityCount?: number;
  performanceCount?: number;
  qualityCount?: number;
  issues?: Issue[];
  report?: string;
}

export default function AuditReportView({ repoId }: { repoId?: string | null }) {
  const { getToken } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [selectedIssue, setSelectedIssue] = useState<string | null>("iss-1");

  // 🔄 React Query to fetch the dynamic analysis data packets from your backend worker database
  const { data: report, isLoading, refetch } = useQuery({
    queryKey: ['auditReport', repoId],
    queryFn: async () => {
      if (!repoId) return Promise.resolve(null as any);
      const headers = await getAuthHeaders(getToken);
      const response = await axios.get(`http://localhost:5000/api/repos/report/${repoId}`, {
        headers,
      });
      return response.data;
    },
    enabled: Boolean(repoId),
    retry: 1,
  });

  if (!repoId) {
    return (
      <div className="flex-1 bg-background overflow-y-auto p-8 relative flex items-center justify-center">
        <div className="glass-panel p-8 text-center">
          <h3 className="text-lg font-bold">No repository selected</h3>
          <p className="text-sm text-textmuted mt-2">Select a repository from the dashboard to view its audit report.</p>
        </div>
      </div>
    );
  }

  const reportData = report as ReportData | null;
  const issuesList: Issue[] = reportData && Array.isArray(reportData.issues) ? reportData.issues : [];
  const filteredIssues = issuesList.filter((iss) => 
    activeFilter === 'ALL' ? true : iss.severity === activeFilter
  );
  const hasReport = Boolean(
    reportData && (
      reportData.report ||
      reportData.score ||
      reportData.securityCount ||
      reportData.performanceCount ||
      reportData.qualityCount ||
      issuesList.length > 0
    )
  );
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

  return (
    <div className="flex-1 bg-background overflow-y-auto p-8 relative min-h-screen">
      {isLoading && (
        <div className="glass-panel p-8 text-center max-w-3xl mx-auto mb-8">
          <div className="text-lg font-bold text-textmain">Loading repository analysis...</div>
          <p className="text-sm text-textmuted mt-2">Fetching audit report from MongoDB. This may take a moment.</p>
        </div>
      )}

      {!isLoading && repoId && !hasReport && (
        <div className="glass-panel p-8 text-center max-w-3xl mx-auto mb-8">
          <div className="text-lg font-bold text-textmain">No audit report found yet</div>
          <p className="text-sm text-textmuted mt-2">This repository has been queued or scanned, but the report has not been produced yet. Run another review or refresh once the worker finishes.</p>
          {reportData?.scanStatus && (
            <div className="mt-4 inline-flex rounded-full bg-surface/80 px-4 py-2 text-xs uppercase tracking-widest text-textmuted border border-bordermuted">
              {statusLabel}
            </div>
          )}
        </div>
      )}

      {!repoId && (
        <div className="glass-panel p-8 text-center max-w-3xl mx-auto mb-8">
          <div className="text-lg font-bold text-textmain">Select a repository first</div>
          <p className="text-sm text-textmuted mt-2">Choose a repository from the dashboard or open the Repositories tab to load report details.</p>
        </div>
      )}

      {(!isLoading && hasReport) && (
        <>
          {/* 🌌 Cinematic Atmosphere Backdrop Glows */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accentblue/5 rounded-full filter blur-[140px] pointer-events-none" />
          <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-accentpurple/5 rounded-full filter blur-[120px] pointer-events-none" />

          {/* TOP HEADER STATUS ACTION TRACK */}
      <header className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-8 relative z-10 border-b border-bordermuted pb-6">
        <div>
          <div className="text-xs font-mono text-accentcyan uppercase tracking-widest">Diagnostic Summary Ledgers</div>
          <h1 className="text-3xl font-black mt-1 tracking-tight">{reportData?.repoName}</h1>
          {reportData?.scanStatus && (
            <span className="mt-3 inline-flex rounded-full bg-surface/80 px-4 py-2 text-xs uppercase tracking-widest text-textmuted border border-bordermuted">
              {statusLabel}
            </span>
          )}
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
          <div className="glass-panel p-6 flex flex-col items-center text-center">
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
              <div className="flex justify-between items-center p-3 bg-surface/50 rounded-lg border border-bordermuted opacity-50">
                <span className="text-sm text-textmuted flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accentgreen" /> Quality Standards
                </span>
                <span className="font-mono text-sm font-bold text-accentgreen">{reportData?.qualityCount ?? 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 📑 RIGHT PANEL Column Track (Width 8/12): DIAGNOSTIC ISSUES VIEW */}
        <div className="xl:col-span-8 space-y-6">
          {/* SEVERITY SEGMENTATION FILTER CONTROLS */}
          <div className="flex gap-2 p-1 bg-surface rounded-xl border border-bordermuted max-w-md">
            {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setActiveFilter(sev)}
                className={`flex-1 py-2 text-xs font-bold tracking-wider rounded-lg uppercase transition-all cursor-pointer ${
                  activeFilter === sev 
                    ? 'bg-panel border border-bordermuted text-textmain shadow-glass' 
                    : 'text-textmuted hover:text-textmain'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>

          {/* DYNAMIC LIST INTERFACES */}
          {/* If no structured issues but we have a textual report, show it */}
          {(!filteredIssues || filteredIssues.length === 0) && reportData?.report && (
            <div className="glass-panel p-6">
              <h3 className="text-sm font-bold text-textmuted uppercase mb-4">AI Analysis Report</h3>
              <pre className="text-sm text-textmain whitespace-pre-wrap">{reportData.report}</pre>
            </div>
          )}

          <div className="space-y-4">
            {filteredIssues.map((issue) => {
              const isSelected = selectedIssue === issue.id;
              const isHigh = issue.severity === 'HIGH';
              
              return (
                <div 
                  key={issue.id}
                  className={`glass-panel border transition-all duration-200 overflow-hidden ${
                    isSelected ? 'border-accentblue/40 bg-panel/80' : 'hover:border-bordermuted/40'
                  }`}
                >
                  {/* Issue Primary Header Title Block */}
                  <div 
                    onClick={() => setSelectedIssue(isSelected ? null : issue.id)}
                    className="p-5 flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center border ${
                        isHigh ? 'bg-accentred/10 border-accentred/30 text-accentred' : 'bg-accentorange/10 border-accentorange/30 text-accentorange'
                      }`}>
                        {isHigh ? <ShieldAlert size={16} /> : <AlertTriangle size={16} />}
                      </div>
                      <div>
                        <div className="font-bold text-textmain flex items-center gap-2 text-sm md:text-base">
                          {issue.title}
                          <span className="text-xs font-mono text-textmuted bg-surface border border-bordermuted px-2 py-0.5 rounded">
                            {issue.file}:L{issue.line}
                          </span>
                        </div>
                        <div className="text-xs text-textmuted mt-0.5">Category Domain: {issue.category}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-black tracking-widest px-2.5 py-1 rounded-md border uppercase ${
                        isHigh ? 'bg-accentred/10 text-accentred border-accentred/20' : 'bg-accentorange/10 text-accentorange border-accentorange/20'
                      }`}>
                        {issue.severity}
                      </span>
                      <ChevronRight size={16} className={`text-textmuted transform transition-transform duration-200 ${isSelected ? 'rotate-90 text-accentcyan' : ''}`} />
                    </div>
                  </div>

                  {/* Expanded Core AI Explanation & Fix Suggestions Panels */}
                  {isSelected && (
                    <div className="px-5 pb-6 pt-2 border-t border-bordermuted/40 bg-surface/20 space-y-4 animate-slide-down">
                      <div className="space-y-1">
                        <div className="text-xs uppercase font-mono tracking-wider text-textmuted">Diagnostic Insight:</div>
                        <p className="text-sm text-textmain leading-relaxed">{issue.description}</p>
                      </div>

                      <div className="p-4 bg-accentblue/5 border border-accentblue/10 rounded-lg space-y-1.5">
                        <div className="text-xs uppercase font-mono tracking-wider text-accentcyan font-bold">AI Recommended Refactoring:</div>
                        <p className="text-sm text-textmain font-medium leading-relaxed">{issue.suggestion}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
      )}
    </div>
  );
}