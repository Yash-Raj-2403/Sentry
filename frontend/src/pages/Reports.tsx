import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Shield, Send, Bot, User, DownloadCloud, Sparkles, Terminal } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { cn } from '../lib/utils';

interface ChatMessage { role: 'user' | 'assistant'; content: string; }

const MITRE_TECHNIQUES = [
  { id: 'T1046', technique: 'Network Service Scanning',    accent: '#f43f5e', color: 'rose' },
  { id: 'T1110', technique: 'Brute Force',                 accent: '#fb923c', color: 'orange' },
  { id: 'T1021', technique: 'Remote Services',             accent: '#fbbf24', color: 'amber' },
  { id: 'T1078', technique: 'Valid Accounts',              accent: '#34d399', color: 'emerald' },
  { id: 'T1562', technique: 'Impair Defenses',             accent: '#22d3ee', color: 'cyan' },
  { id: 'T1486', technique: 'Data Encrypted for Impact',   accent: '#8b5cf6', color: 'purple' },
];

export default function Reports() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Hello! I'm CyberHelm Copilot. Once incidents are detected, I can explain attack classifications, map techniques to MITRE ATT&CK, and suggest remediation steps. How can I help?" },
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages(prev => [
      ...prev,
      { role: 'user', content: trimmed },
      { role: 'assistant', content: 'The backend Copilot API is not yet connected. Once integrated, I will provide contextual analysis and MITRE ATT&CK explanations for each query.' },
    ]);
    setInput('');
  };

  return (
    <MainLayout>
        <div className="h-[calc(100vh-100px)] flex flex-col space-y-6">
            
             {/* Header */}
             <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Reports & Intelligence</h1>
                <p className="text-gray-400 mt-1">Automated SOC documentation and AI-assisted investigation.</p>
            </div>

            <div className="flex-1 grid lg:grid-cols-12 gap-6 min-h-0">
                
                {/* Left Panel: Reports & Stats */}
                <div className="lg:col-span-7 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
                    
                    {/* SOC Reports List */}
                    <GlassCard className="flex-1 min-h-[300px] flex flex-col" variant="default">
                        <div className="flex justify-between items-center mb-6">
                             <div className="flex items-center gap-3">
                                 <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
                                     <FileText className="text-blue-400" size={20} />
                                 </div>
                                 <h3 className="font-bold text-lg">Incident Reports</h3>
                             </div>
                             <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-colors text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-white">
                                 <DownloadCloud size={14} /> Export All
                             </button>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center text-center opacity-50 py-10 border-2 border-dashed border-white/5 rounded-xl bg-white/5">
                             <FileText size={48} className="mb-4 text-gray-600" />
                             <p className="text-sm font-bold text-gray-400">No Reports Generated</p>
                             <p className="text-xs text-gray-500 mt-1 max-w-xs">The Explanation Agent generates reports automatically when incidents are resolved.</p>
                        </div>
                    </GlassCard>

                     {/* MITRE Matrix */}
                    <GlassCard variant="cyber" intensity="low">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield className="text-brand-purple" size={20} />
                            <h3 className="font-bold text-lg">MITRE ATT&CK Mapping</h3>
                        </div>
                        <p className="text-sm text-gray-400 mb-6">Techniques commonly observed in your environment.</p>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                            {MITRE_TECHNIQUES.map((t) => (
                                <div key={t.id} className="p-3 rounded-lg bg-white/5 border border-white/10 hover:border-white/20 transition-all cursor-default group">
                                     <div className="flex items-center justify-between mb-1">
                                         <span className="text-[10px] font-black font-mono tracking-widest opacity-70" style={{ color: t.accent }}>{t.id}</span>
                                         <div className="w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: t.accent }} />
                                     </div>
                                     <p className="text-xs font-medium text-gray-300 group-hover:text-white line-clamp-1">{t.technique}</p>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                {/* Right Panel: Copilot Chat */}
                <div className="lg:col-span-5 flex flex-col min-h-[500px]">
                    <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden relative" variant="scanline" intensity="medium">
                        
                        {/* Chat Header */}
                        <div className="p-4 border-b border-white/10 bg-black/20 flex items-center justify-between backdrop-blur-md z-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                    <Bot className="text-white" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm text-white">CyberHelm Copilot</h3>
                                    <p className="text-[10px] text-indigo-300 font-mono flex items-center gap-1">
                                        <Sparkles size={10} /> AI SECURITY ANALYST
                                    </p>
                                </div>
                            </div>
                            <div className="px-2 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-bold uppercase tracking-wider">
                                Beta
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-black/40">
                             {messages.map((msg, i) => (
                                 <motion.div 
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={cn("flex gap-3", msg.role === 'user' ? 'flex-row-reverse' : '')}
                                 >
                                     <div className={cn(
                                         "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                                         msg.role === 'assistant' 
                                            ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400" 
                                            : "bg-gray-700/50 border-gray-600/50 text-gray-300"
                                     )}>
                                         {msg.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                                     </div>
                                     <div className={cn(
                                         "max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed",
                                         msg.role === 'assistant' 
                                            ? "bg-white/5 border border-white/10 text-gray-300 rounded-tl-none" 
                                            : "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 rounded-tr-none"
                                     )}>
                                         {msg.content}
                                     </div>
                                 </motion.div>
                             ))}
                             <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-md z-10">
                            <form onSubmit={handleSend} className="relative">
                                <input 
                                    type="text" 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about threats, indicators, or logs..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all font-mono"
                                />
                                <button 
                                    type="submit"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/40 text-indigo-400 flex items-center justify-center transition-colors border border-indigo-500/30"
                                >
                                    <Send size={14} />
                                </button>
                            </form>
                            <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-600 font-mono">
                                <Terminal size={10} />
                                <span>Press Enter to send command</span>
                            </div>
                        </div>

                    </GlassCard>
                </div>

            </div>
        </div>
    </MainLayout>
  );
}
