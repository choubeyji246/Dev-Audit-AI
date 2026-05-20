import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth, useClerk } from '@clerk/clerk-react';
import axios from 'axios';
import { 
  Shield, 
  Activity, 
  FileCode, 
  AlertTriangle, 
  Play, 
  ChevronRight, 
  LayoutDashboard, 
  Folder, 
  History, 
  Settings, 
  LogOut,
  Terminal
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Global Store State Utilities
import type { RootState } from '../store';
import { setSidebarTab } from '../store/uiSlice';

// Sub-Panel Component Layout Imports
import NewReview from './NewReview';
import AuditReportView from './AuditReportView';
import RepoChat from './RepoChat';
import SettingsPage from './Settings'; // 💡 Import the new settings page node!

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentTab = useSelector((state: RootState) => state.ui.activeSidebarTab);
  const { getToken } = useAuth();
  const { signOut } = useClerk();

  // 🔄 React Query Hook: Pulls platform data updates directly from your backend node
  const { data: metrics } = useQuery({
    queryKey: ['repoMetrics'],
    queryFn: async () => {
      const token = await getToken();
      const response = await axios.get('http://localhost:5000/api/repos/metrics-summary', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    },
    initialData: {
      totalReviews: 128,
      securityIssues: 45,
      avgScore: 7.8,
      highSeverity: 15,
      recentReviews: [
        { id: "6a0c3eee39d6ce9890bdcad2", name: "MyApp Backend Core", score: 7.8, issues: "High/Medium", date: "Nov 8, 2026" },
        { id: "e-commerce-repo-id", name: "E-Commerce Repo Pipeline", score: 2.8, issues: "Critical Threats", date: "Dec 3, 2026" },
        { id: "portfolio-site-id", name: "Client Portfolio Site", score: 9.5, issues: "Clean Build", date: "Jan 14, 2026" }
      ]
    }
  });

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error("❌ Session Evacuation Error:", error);
    }
  };

  return (
    <div className="w-screen h-screen min-h-screen max-h-screen bg-background text-textmain flex overflow-hidden static">
      
      {/* 🧭 NAVIGATION SIDEBAR PANEL */}
      <aside className="w-64 bg-surface border-r border-bordermuted flex flex-col justify-between p-4 z-30 select-none shrink-0 h-full">
        <div className="space-y-8">
          {/* Main Logo Header Row */}
          <div className="flex items-center gap-3 px-2 pt-2">
            <div className="h-9 w-9 bg-accentblue/20 border border-accentblue/40 rounded-lg flex items-center justify-center text-accentcyan shadow-glowblue">
              <Shield size={20} />
            </div>
            <span className="font-bold text-lg tracking-wide bg-gradient-to-r from-textmain via-textmuted to-accentpurple bg-clip-text text-transparent">
              DevAudit AI
            </span>
          </div>

          {/* Map Nav Links to Redux Store Reducer Dispatchers */}
          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'new-review', label: 'New Review', icon: Play },
              { id: 'repositories', label: 'Repositories', icon: Folder },
              { id: 'history', label: 'History', icon: Terminal },
              { id: 'settings', label: 'Settings', icon: Settings }, // 💡 Points to 'settings' tab
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => dispatch(setSidebarTab(item.id))}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer text-left border-none bg-transparent ${
                    isActive 
                      ? 'bg-accentblue/10 border border-accentblue/30 text-textmain shadow-glass' 
                      : 'text-textmuted hover:text-textmain hover:bg-panel/40'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-accentcyan' : 'text-textmuted'} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* EXIT CONTROL BUTTON TRACK */}
        <div className="border-t border-bordermuted pt-4">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-accentred/80 hover:text-accentred hover:bg-accentred/5 transition-all cursor-pointer border-none bg-transparent"
          >
            <LogOut size={18} />
            Exit Session
          </button>
        </div>
      </aside>

      {/* 🚀 SUB-PANEL SWITCH MATRIX CONTAINER */}
      <div className="flex-1 h-full relative overflow-hidden">
        
        {/* Render View Components Dynamically Matching State Tab Flags */}
        {currentTab === 'new-review' ? (
          <NewReview />
        ) : currentTab === 'repositories' ? (
          <AuditReportView repoId="6a0c3eee39d6ce9890bdcad2" />
        ) : currentTab === 'history' ? (
          <RepoChat />
        ) : currentTab === 'settings' ? (
          <SettingsPage /> // 💡 🛠️ CHANGED: Dynamic switch route configuration to map settings file pane
        ) : (
          /* 📊 DEFAULT VIEW ROUTE MATRIX: MAIN OVERVIEW DASHBOARD PANEL */
          <main className="w-full h-full bg-background overflow-y-auto p-8 relative">
            {/* Cinematic Gradient Ambient Lighting */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-accentpurple/5 rounded-full filter blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 left-1/3 w-[400px] h-[400px] bg-accentblue/5 rounded-full filter blur-[100px] pointer-events-none" />

            {/* HEADER META MATRIX */}
            <header className="flex justify-between items-center mb-8 relative z-10">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight">Workspace Metrics</h1>
                <p className="text-textmuted text-sm mt-1">Real-time repository threat and codebase stability indexes.</p>
              </div>
              <button 
                onClick={() => dispatch(setSidebarTab('new-review'))}
                className="bg-gradient-to-r from-accentblue to-accentpurple hover:opacity-90 px-5 py-2.5 rounded-lg font-semibold text-sm shadow-glowblue transition-all flex items-center gap-2 cursor-pointer text-textmain border-none"
              >
                <Play size={15} fill="currentColor" />
                Start New Review
              </button>
            </header>

            {/* 📈 FOUR-COLUMN METRIC CARD TRACKS */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8 relative z-10">
              {[
                { label: 'Total Reviews', value: metrics.totalReviews, color: 'text-accentblue', icon: FileCode },
                { label: 'Security Issues', value: metrics.securityIssues, color: 'text-accentorange', icon: AlertTriangle },
                { label: 'Avg Code Score', value: metrics.avgScore, color: 'text-accentgreen', icon: Activity },
                { label: 'High Severity', value: metrics.highSeverity, color: 'text-accentred', icon: Shield },
              ].map((card, i) => {
                const Icon = card.icon;
                return (
                  <div key={i} className="glass-panel p-6 hover:border-bordermuted/30 transition-all flex justify-between items-start">
                    <div className="space-y-2">
                      <span className="text-textmuted text-xs font-semibold tracking-wider uppercase">{card.label}</span>
                      <div className={`text-4xl font-black ${card.color}`}>{card.value}</div>
                    </div>
                    <div className="h-8 w-8 rounded-lg bg-surface flex items-center justify-center border border-bordermuted text-textmuted">
                      <Icon size={16} />
                    </div>
                  </div>
                );
              })}
            </section>

            {/* 📅 RECENT AUDIT LISTING INDEX */}
            <section className="glass-panel p-6 relative z-10">
              <h2 className="text-xl font-bold mb-4">Recent Reviews</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-bordermuted text-textmuted text-xs uppercase tracking-wider">
                      <th className="pb-3 font-semibold">Repository</th>
                      <th className="pb-3 font-semibold">Health Score</th>
                      <th className="pb-3 font-semibold">Risk State</th>
                      <th className="pb-3 font-semibold text-right">Reviewed On</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-bordermuted/40 text-sm">
                    {metrics.recentReviews.map((repo: any, i: number) => (
                      <tr 
                        key={i} 
                        onClick={() => dispatch(setSidebarTab('repositories'))}
                        className="hover:bg-panel/20 transition-all group cursor-pointer"
                      >
                        <td className="py-4 font-medium text-textmain flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-accentpurple group-hover:scale-125 transition-all" />
                          {repo.name}
                        </td>
                        <td className="py-4">
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                            repo.score >= 7.0 
                              ? 'bg-accentgreen/10 text-accentgreen border border-accentgreen/20' 
                              : 'bg-accentred/10 text-accentred border border-accentred/20'
                          }`}>
                            {repo.score}
                          </span>
                        </td>
                        <td className="py-4 text-textmuted font-medium">{repo.issues}</td>
                        <td className="py-4 text-right text-textmuted font-mono flex items-center justify-end gap-1">
                          {repo.date}
                          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transform translate-x-1 transition-all text-accentcyan" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </main>
        )}
      </div>
    </div>
  );
}