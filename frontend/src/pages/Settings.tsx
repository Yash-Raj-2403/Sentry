import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon, User, Shield, Database,
  Cpu, Activity, CheckCircle, XCircle, Bell,
  Key, Palette, Info, Save
} from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

interface ServiceStatus {
  name: string;
  url: string;
  ok: boolean | null;
}

function StatusRow({ name, ok }: { name: string; ok: boolean | null }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/5 last:border-0">
      <span className="text-sm text-gray-300">{name}</span>
      {ok === null ? (
        <span className="text-[10px] text-gray-500 font-mono animate-pulse">Checking…</span>
      ) : ok ? (
        <div className="flex items-center gap-1.5 text-emerald-400">
          <CheckCircle size={13} />
          <span className="text-[10px] font-bold uppercase">Online</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-red-400">
          <XCircle size={13} />
          <span className="text-[10px] font-bold uppercase">Offline</span>
        </div>
      )}
    </div>
  );
}

export default function Settings() {
  const { user, signOut } = useAuth();
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'Backend API',    url: 'http://localhost:8000/api/v1/incidents/', ok: null },
    { name: 'Copilot (Groq)', url: 'http://localhost:8000/api/v1/copilot/chat', ok: null },
    { name: 'Supabase Auth',  url: '',  ok: null },
  ]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const check = async () => {
      // Backend API
      const apiOk = await fetch('http://localhost:8000/api/v1/incidents/')
        .then(r => r.ok).catch(() => false);

      // Copilot endpoint (OPTIONS check)
      const copilotOk = await fetch('http://localhost:8000/api/v1/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: 'ping', history: [] }),
      }).then(r => r.ok).catch(() => false);

      // Supabase — consider online if user session exists
      const supabaseOk = !!user;

      setServices([
        { name: 'Backend API',    url: '', ok: apiOk },
        { name: 'Copilot (Groq)', url: '', ok: copilotOk },
        { name: 'Supabase Auth',  url: '', ok: supabaseOk },
      ]);
    };
    check();
  }, [user]);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <MainLayout>
      <div className="space-y-6 max-w-4xl">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
          <p className="text-gray-400 mt-1">System configuration, integrations, and user preferences.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">

            {/* User Profile */}
            <GlassCard className="p-6" variant="cyber" intensity="low">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                  <User className="text-cyan-400" size={16} />
                </div>
                <h2 className="font-bold text-sm uppercase tracking-widest text-white">User Profile</h2>
              </div>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/20">
                  {user?.email?.[0]?.toUpperCase() ?? 'A'}
                </div>
                <div>
                  <p className="font-semibold text-white">{user?.email ?? 'admin@cyberhelm.io'}</p>
                  <p className="text-xs text-gray-500 mt-0.5">SOC Administrator · Level 5</p>
                  <p className="text-[10px] font-mono text-gray-600 mt-1">{user?.id ?? '—'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block mb-1.5">Display Name</label>
                  <input
                    defaultValue="Admin"
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block mb-1.5">Access Level</label>
                  <input
                    value="Level 5 — Full Access"
                    readOnly
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </GlassCard>

            {/* AI & API Configuration */}
            <GlassCard className="p-6" intensity="low">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <Key className="text-purple-400" size={16} />
                </div>
                <h2 className="font-bold text-sm uppercase tracking-widest text-white">AI Configuration</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block mb-1.5">Groq Model</label>
                  <select className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-all">
                    <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (default)</option>
                    <option value="llama-3.1-8b-instant">llama-3.1-8b-instant (fast)</option>
                    <option value="mixtral-8x7b-32768">mixtral-8x7b-32768</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block mb-1.5">Groq API Key</label>
                  <input
                    type="password"
                    defaultValue="gsk_r656zmAdedV0lHjogvGp••••••"
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-purple-500/50 transition-all"
                  />
                  <p className="text-[10px] text-gray-600 mt-1">Configured in backend-core/.env — restart required after changes.</p>
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 uppercase font-bold tracking-wider block mb-1.5">Detection Sensitivity</label>
                  <div className="flex gap-2">
                    {['Low', 'Medium', 'High', 'Aggressive'].map((level) => (
                      <button
                        key={level}
                        className={cn(
                          'flex-1 py-2 rounded-lg border text-xs font-bold transition-all',
                          level === 'High'
                            ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
                            : 'bg-white/5 border-white/10 text-gray-500 hover:text-white hover:border-white/20'
                        )}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Notification Preferences */}
            <GlassCard className="p-6" intensity="low">
              <div className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <Bell className="text-yellow-400" size={16} />
                </div>
                <h2 className="font-bold text-sm uppercase tracking-widest text-white">Notifications</h2>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Critical incident alerts',   defaultOn: true },
                  { label: 'New honeypot connections',   defaultOn: true },
                  { label: 'Agent pipeline status',      defaultOn: false },
                  { label: 'Weekly summary digest',      defaultOn: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="text-sm text-gray-300">{item.label}</span>
                    <button
                      className={cn(
                        'w-10 h-5 rounded-full border transition-all relative',
                        item.defaultOn
                          ? 'bg-cyan-500/20 border-cyan-500/40'
                          : 'bg-white/5 border-white/10'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-0.5 w-4 h-4 rounded-full transition-all',
                          item.defaultOn
                            ? 'right-0.5 bg-cyan-400'
                            : 'left-0.5 bg-gray-600'
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Save */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className={cn(
                  'flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all',
                  saved
                    ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400'
                    : 'bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30'
                )}
              >
                <Save size={15} />
                {saved ? 'Saved!' : 'Save Changes'}
              </button>
            </div>

          </div>

          {/* Right column */}
          <div className="space-y-4">

            {/* Service Health */}
            <GlassCard className="p-5" variant="cyber" intensity="low">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Activity className="text-emerald-400" size={16} />
                </div>
                <h3 className="font-bold text-sm uppercase tracking-widest text-white">Service Health</h3>
              </div>
              {services.map((s) => (
                <StatusRow key={s.name} name={s.name} ok={s.ok} />
              ))}
            </GlassCard>

            {/* Stack Info */}
            <GlassCard className="p-5" intensity="low">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Cpu className="text-blue-400" size={16} />
                </div>
                <h3 className="font-bold text-sm uppercase tracking-widest text-white">Tech Stack</h3>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  ['Frontend',   'React 18 + Vite'],
                  ['UI',         'Tailwind + Framer'],
                  ['Backend',    'FastAPI + Python'],
                  ['Database',   'SQLite (dev)'],
                  ['Queue',      'Redis streams'],
                  ['AI Model',   'Groq — Llama 3.3 70B'],
                  ['Auth',       'Supabase'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between items-center py-1.5 border-b border-white/5 last:border-0">
                    <span className="text-gray-500">{k}</span>
                    <span className="font-mono text-gray-300">{v}</span>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Danger zone */}
            <GlassCard className="p-5" intensity="low">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <Shield className="text-red-400" size={16} />
                </div>
                <h3 className="font-bold text-sm uppercase tracking-widest text-white">Account</h3>
              </div>
              <button
                onClick={signOut}
                className="w-full py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm font-bold transition-all"
              >
                Sign Out
              </button>
            </GlassCard>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
