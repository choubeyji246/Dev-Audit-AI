import { SignIn } from "@clerk/clerk-react";
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative p-4 overflow-hidden">
      {/* Cinematic Ambient Glow Layout */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-accentblue/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-accentpurple/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md z-10 flex flex-col items-center">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 bg-accentblue/20 border border-accentblue/40 rounded-xl flex items-center justify-center text-accentcyan shadow-glowblue">
            <Shield size={22} />
          </div>
          <span className="font-black text-2xl tracking-wide bg-gradient-to-r from-textmain via-textmuted to-accentpurple bg-clip-text text-transparent">
            DevAudit AI
          </span>
        </div>

        {/* Embedded Custom Clerk Sign-In Component */}
        <div className="glass-panel p-4 w-full border border-bordermuted shadow-glowblue">
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                cardBox: "bg-transparent shadow-none border-none p-0 w-full",
                card: "bg-transparent shadow-none border-none p-2 w-full",
                headerTitle: "text-textmain text-xl font-bold tracking-tight text-center",
                headerSubtitle: "text-textmuted text-sm text-center",
                socialButtonsBlockButton: 
                  "bg-surface border border-bordermuted hover:bg-panel text-textmain font-medium rounded-lg transition-all",
                socialButtonsBlockButtonText: "text-textmain font-medium",
                dividerLine: "bg-bordermuted",
                dividerText: "text-textmuted text-xs uppercase tracking-wider",
                formFieldLabel: "text-textmain text-xs font-semibold mb-1",
                formFieldInput: 
                  "bg-surface border border-bordermuted text-textmain rounded-lg px-4 py-2.5 focus:border-accentblue focus:ring-1 focus:ring-accentblue transition-all outline-none",
                formButtonPrimary: 
                  "bg-gradient-to-r from-accentblue to-accentpurple hover:opacity-90 text-textmain font-bold rounded-lg py-3 shadow-glowblue transition-all normal-case border-none",
                footerActionText: "text-textmuted text-sm",
                footerActionLink: "text-accentcyan hover:text-accentcyan/80 font-semibold transition-all"
              }
            }}
            signUpUrl="/signup"
            forceRedirectUrl="/workspace"
          />
        </div>
      </div>
    </div>
  );
}