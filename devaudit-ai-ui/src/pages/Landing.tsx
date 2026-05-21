import { useNavigate } from 'react-router-dom';
import { Shield, Terminal, Cpu, CheckCircle, ArrowRight } from 'lucide-react'; // 💡 Removed GitHub from here!

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-textmain relative overflow-x-hidden">
      {/* 🌌 HERO BACKGROUND CINEMATIC GLOW MATRIX */}
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-accentblue/10 rounded-full filter blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-accentpurple/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-5%] right-1/4 w-[450px] h-[450px] bg-accentcyan/5 rounded-full filter blur-[100px] pointer-events-none" />

      {/* 🧭 GLOBAL STREAMLINED LANDING HEADER */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-accentblue/20 border border-accentblue/40 rounded-lg flex items-center justify-center text-accentcyan shadow-glowblue">
            <Shield size={18} />
          </div>
          <span className="font-black text-xl tracking-wide bg-gradient-to-r from-textmain via-textmuted to-accentpurple bg-clip-text text-transparent">
            DevAudit AI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/login')} 
            className="text-textmuted hover:text-textmain text-sm font-semibold transition-all cursor-pointer"
          >
            Sign In
          </button>
          <button 
            onClick={() => navigate('/signup')} 
            className="bg-panel border border-bordermuted hover:border-accentpurple/40 px-4 py-2 rounded-lg text-sm font-semibold text-textmain transition-all cursor-pointer shadow-glass"
          >
            Register Account
          </button>
        </div>
      </header>

      {/* 🚀 MAIN CULMINATION HERO SECTION */}
      <main className="max-w-7xl mx-auto px-6 pt-20 pb-32 relative z-10 flex flex-col items-center text-center">
        
        {/* Dynamic Micro-Badge Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-bordermuted mb-6 animate-bounce">
          <span className="h-2 w-2 rounded-full bg-accentcyan shadow-glowblue" />
          <span className="text-xs font-mono tracking-wide text-textmuted">Next-Gen Source Analysis Powered By GPT-4o</span>
        </div>

        {/* The Main Screen Header Callout From Your Screenshot */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tight max-w-4xl leading-tight">
          AI-Powered Code Review <br />
          <span className="bg-gradient-to-r from-accentblue via-accentcyan to-accentpurple bg-clip-text text-transparent shadow-glowpurple">
            In Seconds
          </span>
        </h1>

        <p className="text-textmuted max-w-2xl mt-6 text-base md:text-lg leading-relaxed">
          Examine source code repositories for cryptographic flaws, security anti-patterns, and architecture deadlocks. Get production-ready code suggestions instantly.
        </p>

        {/* TWO-WAY ACTION CALLS */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-accentblue to-accentpurple hover:opacity-95 text-white font-bold px-8 py-4 rounded-xl text-base shadow-glowblue transition-all flex items-center gap-3 cursor-pointer group"
          >
            Start Reviewing
            <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button 
            onClick={() => navigate('/login')}
            className="bg-surface border border-bordermuted hover:bg-panel text-textmain font-bold px-8 py-4 rounded-xl text-base transition-all flex items-center gap-3 cursor-pointer shadow-glass"
          >
            {/* 💡 Native SVG Fallback: Completely immune to library naming bugs */}
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
              <path d="M9 18c-4.51 2-5-2-7-2" />
            </svg>
            Connect GitHub
          </button>
        </div>

        {/* 🤖 FEATURE CATEGORY CARDS (Direct UI Screenshot Match) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-24">
          {[
            { 
              title: "Security Analysis", 
              desc: "Identify injection risk vectors, leaked credential tokens, and broken access controls immediately.", 
              color: "text-accentred", 
              icon: Shield,
              bgGlow: "hover:shadow-[0_0_30px_rgba(239,68,68,0.08)]"
            },
            { 
              title: "Performance Insights", 
              desc: "Isolate blocking loops, non-optimal query structures, and asynchronous transaction deadlocks.", 
              color: "text-accentgreen", 
              icon: Cpu,
              bgGlow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.08)]"
            },
            { 
              title: "Clean Code Suggestions", 
              desc: "Refactor unhandled exceptions and structural smells into modern, documented SOLID layouts.", 
              color: "text-accentcyan", 
              icon: Terminal,
              bgGlow: "hover:shadow-[0_0_30px_rgba(6,182,212,0.08)]"
            }
          ].map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx} 
                className={`glass-panel p-8 text-left transition-all duration-300 transform hover:-translate-y-1 ${feat.bgGlow} group`}
              >
                <div className={`h-10 w-10 rounded-lg bg-surface flex items-center justify-center border border-bordermuted mb-6 ${feat.color} group-hover:border-current transition-all`}>
                  <Icon size={20} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-textmain">{feat.title}</h3>
                <p className="text-textmuted text-sm leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </section>

        {/* TRUST INFRASTRUCTURE PROOFS */}
        <footer className="mt-28 pt-8 border-t border-bordermuted/30 w-full max-w-4xl flex flex-wrap justify-center gap-x-12 gap-y-4 text-xs font-mono text-textmuted">
          <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-accentcyan" /> Enterprise Encryption</div>
          <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-accentpurple" /> Vector Space Search</div>
          <div className="flex items-center gap-1.5"><CheckCircle size={14} className="text-accentgreen" /> Continuous Hook Scanning</div>
        </footer>
      </main>
    </div>
  );
}