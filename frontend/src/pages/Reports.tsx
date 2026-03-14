import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FileText, Shield, Send, Bot, User, DownloadCloud } from 'lucide-react';

// ─── MITRE technique pill ─────────────────────────────────────────────────────
function MitrePill({ technique, id }: { technique: string; id: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-lg">
      <span className="text-[10px] font-mono font-bold text-purple-400">{id}</span>
      <span className="text-xs text-gray-300">{technique}</span>
    </div>
  );
}

const MITRE_TECHNIQUES = [
  { id: 'T1046', technique: 'Network Service Scanning' },
  { id: 'T1110', technique: 'Brute Force' },
  { id: 'T1021', technique: 'Remote Services' },
  { id: 'T1078', technique: 'Valid Accounts' },
  { id: 'T1562', technique: 'Impair Defenses' },
  { id: 'T1486', technique: 'Data Encrypted for Impact' },
];

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default function Reports() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: "Hello! I'm Sentry Copilot. Once incidents are detected, I can explain attack classifications, map techniques to MITRE ATT&CK, and suggest remediation steps. How can I help?",
    },
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setMessages((prev) => [
      ...prev,
      { role: 'user', content: trimmed },
      { role: 'assistant', content: 'The backend Copilot API is not yet connected. Once integrated, I will provide contextual analysis and MITRE ATT&CK explanations for each query.' },
    ]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-[#030305] text-white font-sans flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-28 pb-16">

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white tracking-tight">Reports & Copilot</h1>
          <p className="text-sm text-gray-500 mt-1">SOC incident reports, MITRE ATT&CK mapping, and AI assistant</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">

          {/* Left: Reports + MITRE */}
          <div className="lg:col-span-3 space-y-6">

            {/* SOC Reports */}
            <div className="bg-[#0c0c14] border border-white/8 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-cyan-400" />
                  <h2 className="text-sm font-bold text-white uppercase tracking-widest">SOC Incident Reports</h2>
                </div>
                <button className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-300 transition-colors">
                  <DownloadCloud size={13} />
                  Export
                </button>
              </div>

              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="w-13 h-13 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <FileText size={20} className="text-gray-600" />
                </div>
                <p className="text-sm font-medium text-gray-400 mb-1">No reports generated yet</p>
                <p className="text-xs text-gray-600 max-w-xs">
                  The Explanation Agent will generate human-readable SOC reports automatically once incidents are processed through the pipeline.
                </p>
              </div>
            </div>

            {/* MITRE ATT&CK Reference */}
            <div className="bg-[#0c0c14] border border-white/8 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-5">
                <Shield size={16} className="text-purple-400" />
                <h2 className="text-sm font-bold text-white uppercase tracking-widest">MITRE ATT&CK — Monitored Techniques</h2>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                The Explanation Agent maps detected incidents to the following techniques. Techniques highlighted during live incidents will appear in generated reports.
              </p>
              <div className="flex flex-wrap gap-2">
                {MITRE_TECHNIQUES.map((t) => (
                  <MitrePill key={t.id} {...t} />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Copilot Chat */}
          <div className="lg:col-span-2 bg-[#0c0c14] border border-white/8 rounded-2xl flex flex-col overflow-hidden" style={{ minHeight: '520px' }}>
            {/* Header */}
            <div className="flex items-center gap-2 px-5 py-4 border-b border-white/5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
                <Bot size={14} className="text-white" />
              </div>
              <div>
                <div className="text-sm font-bold text-white">Sentry Copilot</div>
                <div className="text-[10px] text-gray-600">AI security assistant</div>
              </div>
              <div className="ml-auto flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                <span className="text-[10px] text-yellow-400 font-semibold">Backend pending</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-white mt-0.5 ${
                    msg.role === 'assistant' ? 'bg-gradient-to-tr from-cyan-500 to-blue-600' : 'bg-white/10'
                  }`}>
                    {msg.role === 'assistant' ? <Bot size={12} /> : <User size={12} />}
                  </div>
                  <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'assistant'
                      ? 'bg-white/5 border border-white/8 text-gray-300'
                      : 'bg-cyan-500/15 border border-cyan-500/20 text-cyan-100'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5">
              <div className="flex items-center gap-2 bg-[#070710] border border-white/8 rounded-xl px-3 py-2.5 focus-within:border-cyan-500/40 transition-all">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about an attack or incident…"
                  className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 outline-none"
                />
                <button
                  onClick={handleSend}
                  className="w-7 h-7 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 flex items-center justify-center transition-colors"
                >
                  <Send size={13} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
