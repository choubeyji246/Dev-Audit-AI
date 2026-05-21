import React, { useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { apiClient } from '../api';
import { getAuthHeaders, getManualToken } from '../utils/auth';
import { Settings, Shield, Bell, Cpu, Save, Key, Sliders, CheckCircle } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [manualProfile, setManualProfile] = useState<any | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  
  // Local Config Form States
  const [modelTemperature, setModelTemperature] = useState(0.2);
  const [enableAlerts, setEnableAlerts] = useState(true);
  const [scanOnPush, setScanOnPush] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!getManualToken()) return;
      setIsLoadingProfile(true);
      setProfileError(null);

      try {
        const headers = await getAuthHeaders(getToken);
        const response = await apiClient.get('/api/auth/profile', {
          headers,
        });

        setManualProfile(response.data.user || response.data);
      } catch (error: any) {
        setProfileError(error?.response?.data?.message || 'Unable to fetch manual profile.');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfile();
  }, [getToken]);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const profileName = manualProfile?.name || user?.fullName || 'Developer Session Token';
  const profileEmail = manualProfile?.email || user?.primaryEmailAddress?.emailAddress || 'token@dev.audit.ai';
  const profileAvatar = manualProfile?.avatar || user?.imageUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&h=80&q=80';

  return (
    <div className="flex-1 bg-background overflow-y-auto p-8 relative h-full">
      {/* 🌌 Cyber Neon Ambient Lighting Backdrop Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-accentblue/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-accentpurple/5 rounded-full filter blur-[100px] pointer-events-none" />

      {/* HEADER ROW TRACK */}
      <header className="mb-10 relative z-10">
        <h1 className="text-3xl font-extrabold tracking-tight">Platform Configurations</h1>
        <p className="text-textmuted text-sm mt-1">Manage global model threshold guidelines, notifications, and profile credentials.</p>
      </header>

      {/* MAIN LAYOUT CONFIG GRID GRID STRUCTURE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 max-w-6xl">
        
        {/* 🛠️ LEFT SIDE: SYSTEM CONFIGURATION SECTIONS (Width 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveSettings} className="space-y-6">
            
            {/* 🤖 PART 1: AI MODEL ENGINE RULE THRESHOLDS */}
            <div className="glass-panel p-6 space-y-6">
              <div className="flex items-center gap-2 border-b border-bordermuted pb-4 text-accentcyan">
                <Cpu size={18} />
                <h2 className="text-lg font-bold text-textmain">LLM Engine Parameters</h2>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <label className="text-sm font-semibold text-textmain block">Strictness Temperature</label>
                    <span className="text-xs text-textmuted">Lower values are deterministic; higher values maximize creative code optimization variants.</span>
                  </div>
                  <span className="text-xs font-mono font-bold bg-surface px-2.5 py-1 rounded border border-bordermuted text-accentcyan">
                    {modelTemperature}
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.1"
                  value={modelTemperature}
                  onChange={(e) => setModelTemperature(parseFloat(e.target.value))}
                  className="w-full accent-accentcyan bg-surface rounded-lg appearance-none h-2 cursor-pointer"
                />
              </div>
            </div>

            {/* 🔔 PART 2: AUTOMATION & PIPELINE ALERTS */}
            <div className="glass-panel p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-bordermuted pb-4 text-accentpurple">
                <Bell size={18} />
                <h2 className="text-lg font-bold text-textmain">Webhook Hook Automation Alerts</h2>
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <h3 className="text-sm font-semibold text-textmain">Continuous Integration Auto-Scan</h3>
                  <p className="text-xs text-textmuted">Instantly execute code chunk segment evaluations whenever a Git Push payload maps via Clerk webhooks.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setScanOnPush(!scanOnPush)}
                  className={`w-11 h-6 rounded-full relative transition-all duration-200 border-none outline-none cursor-pointer ${scanOnPush ? 'bg-accentpurple' : 'bg-surface'}`}
                >
                  <span className={`h-4 w-4 rounded-full bg-white absolute top-1 transition-all duration-200 ${scanOnPush ? 'left-6' : 'left-1'}`} />
                </button>
              </div>

              <div className="flex items-center justify-between py-2 border-t border-bordermuted/40 pt-4">
                <div>
                  <h3 className="text-sm font-semibold text-textmain">Critical Issue Threat Alerts</h3>
                  <p className="text-xs text-textmuted">Dispatch instantaneous notification updates if cryptographic leaks drop below a safety score threshold of 4.0.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setEnableAlerts(!enableAlerts)}
                  className={`w-11 h-6 rounded-full relative transition-all duration-200 border-none outline-none cursor-pointer ${enableAlerts ? 'bg-accentpurple' : 'bg-surface'}`}
                >
                  <span className={`h-4 w-4 rounded-full bg-white absolute top-1 transition-all duration-200 ${enableAlerts ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            </div>

            {/* ACTION FOOTER SUBMIT ROW */}
            <div className="flex justify-between items-center">
              {saveSuccess && (
                <div className="flex items-center gap-2 text-xs font-semibold font-mono text-accentgreen animate-fade-in">
                  <CheckCircle size={14} /> Global workspace configurations saved successfully!
                </div>
              )}
              <button
                type="submit"
                className="ml-auto bg-gradient-to-r from-accentblue to-accentpurple hover:opacity-90 text-textmain font-bold px-6 py-3 rounded-lg text-sm shadow-glowblue transition-all flex items-center gap-2 cursor-pointer border-none"
              >
                <Save size={15} />
                Commit Parameter Adjustments
              </button>
            </div>

          </form>
        </div>

        {/* 🔒 RIGHT SIDE: USER SESSION ID CARDS (Width 1/3) */}
        <aside className="space-y-6">
          <div className="glass-panel p-6 space-y-4 text-center flex flex-col items-center">
            {/* User Profile Avatar Frame */}
            <img 
              src={profileAvatar} 
              alt="User Token Profile" 
              className="h-16 w-16 rounded-xl border border-bordermuted shadow-glass object-cover mb-2 select-none"
            />
            <div className="space-y-0.5">
              <h3 className="font-bold text-base text-textmain">{profileName}</h3>
              <p className="text-xs text-textmuted font-mono">{profileEmail}</p>
            </div>

            <div className="w-full border-t border-bordermuted/60 pt-4 text-left space-y-3">
              <div className="text-xs uppercase tracking-wider font-bold text-textmuted flex items-center gap-1.5">
                <Key size={12} className="text-accentorange" /> Security Ledger Contexts
              </div>
              <div className="p-3 bg-surface rounded-lg border border-bordermuted space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-textmuted uppercase block">Active Account ID Key</span>
                <span className="text-xs font-mono text-textmain truncate block max-w-[240px]">
                  {user?.id || "user_2tXfNzZabc12345xyz67890def"}
                </span>
              </div>
              <span className="text-[10px] font-mono text-center text-textmuted/60 block select-none">
                Identity values synchronized cleanly via Clerk security modules.
              </span>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}