import React, { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios';
import { getAuthHeaders } from '../utils/auth';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { setSelectedRepo } from '../store/uiSlice';
import { Terminal, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export default function RepoChat() {
  const { getToken } = useAuth();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: "System initialized. Repository vectors loaded into memory context. Ask me anything about your functions, structural dependencies, or security logic arrays.",
      timestamp: '11:45 AM'
    }
  ]);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Redux hooks: selected repo and dispatcher
  const dispatch = useDispatch();
  const selectedRepoId = useSelector((state: RootState) => state.ui.selectedRepoId);

  const chatMutation = useMutation({
    mutationFn: async (userPrompt: string) => {
      const headers = await getAuthHeaders(getToken);
      const repoId = selectedRepoId;
      if (!repoId) throw new Error('No repository selected for chat');

      const response = await axios.post(
        `http://localhost:5000/api/repos/${repoId}/chat`,
        { query: userPrompt },
        { headers }
      );
      return response.data;
    },
    onSuccess: (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.answer || data.reply || "Context interpretation processed successfully with empty variant return strings.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: "❌ Operational Handshake Error: Failed to gather contextual token vectors from your backend workspace.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatMutation.isPending) return;

    const currentPrompt = input.trim();
    setInput('');

    setMessages((prev) => [
      ...prev,
      {
        id: `usr-${Date.now()}`,
        sender: 'user',
        text: currentPrompt,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    chatMutation.mutate(currentPrompt);
  };

  useEffect(() => {
    (async () => {
      if (!selectedRepoId) {
        try {
          const headers = await getAuthHeaders(getToken);
          const resp = await axios.get('http://localhost:5000/api/repos', { headers });
          const repos = resp.data?.repos || [];
          if (repos.length > 0) dispatch(setSelectedRepo(repos[0].id));
        } catch (e) {
          // ignore
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    /* 🛠️ CHANGED: Enforced hard height limitations to block parent overflow inheritance */
    <div className="w-full min-h-screen bg-background flex flex-col relative overflow-hidden" style={{ paddingTop: '63px' }}>
      
      {/* 🌌 Atmospheric Backdrop Glow Filters */}
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-accentpurple/5 rounded-full filter blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-10 w-[400px] h-[400px] bg-accentblue/5 rounded-full filter blur-[110px] pointer-events-none" />

      {/* 🧭 TERMINAL PANEL HEADER CONTROL ROW */}
      {/* 🛠️ CHANGED: Locked position depth using `z-20` and isolated layout dimension tracking via `shrink-0` */}
      <header className="p-6 border-b border-bordermuted bg-surface/80 backdrop-blur-md relative z-20 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-accentpurple/20 border border-accentpurple/40 rounded-lg flex items-center justify-center text-accentpurple shadow-glowpurple">
              <Terminal size={16} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-textmain flex items-center gap-2">
                Semantic Context Console
                <span className="text-[10px] font-mono tracking-wider bg-accentgreen/10 text-accentgreen border border-accentgreen/20 px-1.5 py-0.5 rounded uppercase animate-pulse">
                  Live
                </span>
              </h1>
              {/* 🛠️ CHANGED: Added tracking margins and proper line height to protect subheading text characters from boundary limits */}
              <p className="text-xs text-textmuted mt-1 leading-normal block">Grounding inputs directly into embedded code snippet clusters.</p>
            </div>
          </div>
        </div>
      </header>

      {/* 📜 CORE SCROLLABLE STREAMING CHAT INTERFACE AREA */}
      {/* 🛠️ CHANGED: Assigned explicit viewport calculations (`max-h-[calc(100vh-180px)]`) to ensure scrolling tracks perfectly */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10 max-h-[calc(100vh-180px)]">
        {messages.map((msg) => {
          const isAI = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-4 max-w-3xl animate-fade-in ${
                isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'
              }`}
            >
              <div className={`h-8 w-8 rounded-lg border flex items-center justify-center shrink-0 shadow-glass ${
                isAI 
                  ? 'bg-accentpurple/10 border-accentpurple/30 text-accentpurple' 
                  : 'bg-accentblue/10 border-accentblue/30 text-accentcyan'
              }`}>
                {isAI ? <Bot size={16} /> : <User size={16} />}
              </div>

              <div className={`p-4 rounded-xl text-sm border font-medium leading-relaxed shadow-glass ${
                isAI 
                  ? 'bg-surface/60 border-bordermuted text-textmain' 
                  : 'bg-gradient-to-br from-accentblue/20 to-accentpurple/10 border-accentblue/30 text-textmain'
              }`}>
                <p className="whitespace-pre-wrap">{msg.text}</p>
                <div className="text-[10px] font-mono text-textmuted/60 mt-2 text-right select-none">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {chatMutation.isPending && (
          <div className="flex items-start gap-4 max-w-2xl mr-auto animate-pulse">
            <div className="h-8 w-8 rounded-lg border bg-accentpurple/10 border-accentpurple/30 text-accentpurple flex items-center justify-center shadow-glass">
              <Sparkles size={14} className="animate-spin" />
            </div>
            <div className="p-4 rounded-xl bg-surface/40 border border-bordermuted text-textmuted text-sm flex items-center gap-2">
              <Loader2 size={14} className="animate-spin text-accentcyan" />
              Parsing codebase chunks via embedding layers...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* 📥 BOTTOM CHAT TERMINAL FORM ROW INPUT */}
      <div className="p-6 border-t border-bordermuted bg-surface/40 backdrop-blur-md relative z-20 shrink-0 mt-auto">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-3 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={chatMutation.isPending}
            placeholder="Ask a question about your code (e.g., 'Do I handle unhandled exceptions in the repository services?')"
            className="flex-1 bg-surface border border-bordermuted text-textmain placeholder-textmuted/40 rounded-xl px-4 py-3.5 text-sm focus:border-accentpurple focus:ring-1 focus:ring-accentpurple outline-none transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || chatMutation.isPending}
            className="bg-gradient-to-r from-accentblue to-accentpurple hover:opacity-90 disabled:opacity-40 text-textmain p-3.5 rounded-xl transition-all shadow-glowpurple flex items-center justify-center shrink-0 cursor-pointer disabled:cursor-not-allowed border-none"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}