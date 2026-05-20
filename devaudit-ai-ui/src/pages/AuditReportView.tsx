import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { Shield, LayoutGrid, Terminal, ShieldAlert, Cpu, Eye, CheckCircle, Download, FileText, ChevronRight, AlertTriangle } from 'lucide-react';

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

export default function AuditReportView({ repoId }: { repoId: string }) {
  const { getToken } = useAuth();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [selectedIssue, setSelectedIssue] = useState<string | null>("iss-1");

  // 🔄 React Query to fetch the dynamic analysis data packets from your backend worker database
  const { data: report, isLoading } = useQuery({
    queryKey: ['auditReport', repoId],
    queryFn: async () => {
      const token = await getToken();
      const response = await axios.get(`http://localhost:5000/api/repos/report/${repoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    // Mock data structures matching the exact visual values shown in your design screenshot assets
    initialData: {
      repoName: "MyApp Backend Core",
      score: 7.8,
      securityCount: 12,
      performanceCount: 8,
      qualityCount: 0,
      issues: [
        {
          id: "iss-1",
          title: "SQL Injection Risk",
          severity: "HIGH",
          file: "UserService.java",
          line: 45,
          description: "User input parameter token arrays are mapped directly to database execution blocks without prior validation.",
          suggestion: "Utilize Prepared Statements and parameterized token bindings to block raw SQL engine hijack scenarios.",
          category: "Security"
        },
        {
          id: "iss-2",
          title: "Hardcoded Credentials",
          severity: "MEDIUM",
          file: "Config.java",
          line: 12,
          description: "A production environment API authentication private key string was found committed directly to git track.",
          suggestion: "Migrate private infrastructure verification parameters out of code blocks and read via system environment variables.",
          category: "Security"
        },
        {
          id: "iss-3",
          title: "Synchronous Blocked Connection Loop",
          severity: "HIGH",
          file: "Checkout.js",
          line: 88,
          description: "A synchronous thread execution loop blocks the inbound pool while processing asynchronous token gateways.",
          suggestion: "Wrap the connection mapping logic in an asynchronous worker block or use promise concurrency arrays.",
          category: "Performance"
        }
      ] as Issue[]
    }
  });

  const filteredIssues = report.issues.filter(iss => 
    activeFilter === 'ALL' ? true : iss.severity === activeFilter
  );

  return (
    <div className="flex-1 bg-background overflow-y-auto p-8 relative">
      {/* 🌌 Cinematic Atmosphere Backdrop Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-accentblue/5 rounded-full filter blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-accentpurple/5 rounded-full filter blur-[120px] pointer-events-none" />

      {/* TOP HEADER STATUS ACTION TRACK */}
      <header className="flex justify-between items-center mb-8 relative z-10 border-b border-bordermuted pb-6">
        <div>
          <div className="text-xs font-mono text-accentcyan uppercase tracking-widest">Diagnostic Summary Ledgers</div>
          <h1 className="text-3xl font-black mt-1 tracking-tight">{report.repoName}</h1>
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
                        strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * report.score) / 10} strokeLinecap="round" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xs uppercase font-mono tracking-widest text-textmuted">Score</span>
                <span className="text-5xl font-black text-textmain mt-0.5">{report.score}</span>
              </div>
            </div>

            {/* In-Depth Counter Breakdown Panel Blocks */}
            <div className="w-full border-t border-bordermuted/60 pt-6 space-y-3">
              <div className="flex justify-between items-center p-3 bg-surface/50 rounded-lg border border-bordermuted">
                <span className="text-sm text-textmuted flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accentblue" /> Security Counts
                </span>
                <span className="font-mono text-sm font-bold text-accentcyan">{report.securityCount}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface/50 rounded-lg border border-bordermuted">
                <span className="text-sm text-textmuted flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accentpurple" /> Performance Indices
                </span>
                <span className="font-mono text-sm font-bold text-accentpurple">{report.performanceCount}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-surface/50 rounded-lg border border-bordermuted opacity-50">
                <span className="text-sm text-textmuted flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accentgreen" /> Quality Standards
                </span>
                <span className="font-mono text-sm font-bold text-accentgreen">{report.qualityCount}</span>
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
    </div>
  );
}