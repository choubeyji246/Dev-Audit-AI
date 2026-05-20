import { SignUp } from "@clerk/clerk-react";
import { Shield } from "lucide-react";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative p-4 overflow-hidden">
      {/* Cinematic Ambient Glow Layout */}
      <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-accentpurple/5 rounded-full filter blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md z-10 flex flex-col items-center">
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 bg-accentpurple/20 border border-accentpurple/40 rounded-xl flex items-center justify-center text-accentcyan shadow-glowpurple">
            <Shield size={22} />
          </div>
          <span className="font-black text-2xl tracking-wide bg-gradient-to-r from-textmain via-textmuted to-accentblue bg-clip-text text-transparent">
            DevAudit AI
          </span>
        </div>

        {/* Embedded Custom Clerk Sign-Up Component */}
        <div className="glass-panel p-4 w-full border border-bordermuted shadow-glowpurple">
          <SignUp
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
                  "bg-surface border border-bordermuted text-textmain rounded-lg px-4 py-2.5 focus:border-accentpurple focus:ring-1 focus:ring-accentpurple transition-all outline-none",
                formButtonPrimary: 
                  "bg-gradient-to-r from-accentpurple to-accentblue hover:opacity-90 text-textmain font-bold rounded-lg py-3 shadow-glowpurple transition-all normal-case border-none",
                footerActionText: "text-textmuted text-sm",
                footerActionLink: "text-accentcyan hover:text-accentcyan/80 font-semibold transition-all"
              }
            }}
            signInUrl="/login"
            forceRedirectUrl="/workspace"
          />
        </div>
      </div>
    </div>
  );
}