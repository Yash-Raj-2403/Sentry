import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShieldAlert, Activity, Cpu, Clock, Wifi,
  ArrowUpRight, Shield,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// ─── Types & Constants ───
type Severity = 'critical' | 'high' | 'medium' | 'low';

const SEV_COLOR: Record<Severity, { bg: string; color: string; border: string }> = {
  critical: { bg: 'rgba(239,68,68,0.1)',   color: '#ef4444', border: 'rgba(239,68,68,0.2)'   },
  high:     { bg: 'rgba(249,115,22,0.1)',  color: '#f97316', border: 'rgba(249,115,22,0.2)'  },
  medium:   { bg: 'rgba(234,179,8,0.1)',   color: '#eab308', border: 'rgba(234,179,8,0.2)'   },
  low:      { bg: 'rgba(16,185,129,0.1)',  color: '#10b981', border: 'rgba(16,185,129,0.2)'  },
};

const STAT_COLOR: Record<string, { icon: string; text: string; border: string }> = {
  red:    { icon: 'rgba(239,68,68,0.12)',   text: '#ef4444', border: 'rgba(239,68,68,0.25)'   },
  cyan:   { icon: 'rgba(34,211,238,0.12)',  text: '#22d3ee', border: 'rgba(34,211,238,0.25)'  },
  purple: { icon: 'rgba(168,85,247,0.12)',  text: '#a855f7', border: 'rgba(168,85,247,0.25)'  },
  yellow: { icon: 'rgba(234,179,8,0.12)',   text: '#eab308', border: 'rgba(234,179,8,0.25)'   },
};

const AGENT_COLORS = [
  { bg: 'rgba(59,130,246,0.1)',  border: 'rgba(59,130,246,0.25)' },
  { bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.25)' },
  { bg: 'rgba(249,115,22,0.1)', border: 'rgba(249,115,22,0.25)' },
];

const cardStyle = {
  background: 'rgba(10,10,28,0.75)',
  border: '1px solid rgba(255,255,255,0.06)',
  backdropFilter: 'blur(24px)',
  borderRadius: '16px',
};

// ─── Components ───

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: any; label: string; value: string | number; sub: string; color: string;
}) {
  const c = STAT_COLOR[color] ?? STAT_COLOR.cyan;
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="relative p-6 overflow-hidden"
      style={cardStyle}
    >
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${c.text}55, transparent)` }} />
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-xl border transition-colors"
          style={{ background: c.icon, borderColor: c.border, color: c.text }}>
          <Icon size={22} />
        </div>
        <span className="px-2 py-1 rounded-full text-xs font-bold border"
          style={{ background: c.icon, color: c.text, borderColor: c.border }}>
          +2.5%
        </span>
      </div>
      <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</h3>
      <p className="text-sm font-medium" style={{ color: 'rgba(140,145,195,0.7)' }}>{label}</p>
      <p className="text-xs mt-2 flex items-center gap-1" style={{ color: 'rgba(100,105,160,0.55)' }}>
        <Activity size={10} /> {sub}
      </p>
    </motion.div>
  );
}

// ─── Main Page ───

export default function Dashboard() {
  const [stats, setStats] = useState({
    activeIncidents: 3,
    eventsPerMin: 1240,
    agentsRunning: 6,
    avgResponseTime: '120ms',
  });
  const [incidents, setIncidents] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res  = await fetch('http://localhost:8000/api/v1/incidents/');
        const data = await res.json();
        if (Array.isArray(data)) {
          const active = data.filter((i: any) => i.status !== 'resolved').length;
          setStats(prev => ({
            ...prev,
            activeIncidents: active > 0 ? active : 3,
            avgResponseTime: '120ms',
          }));
          setIncidents(data.slice(0, 5));
        }
      } catch { /* use initial mock data */ }
    };
    fetchData();
    const iv = setInterval(fetchData, 5000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="min-h-screen text-white flex flex-col" style={{ background: '#080818' }}>
      <Header />

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <div className="absolute" style={{
          top: '-10%', left: '20%', width: '700px', height: '600px',
          background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 65%)',
        }} />
        <div className="absolute" style={{
          bottom: '-10%', right: '10%', width: '600px', height: '500px',
          background: 'radial-gradient(ellipse, rgba(34,211,238,0.08) 0%, transparent 65%)',
        }} />
      </div>

      <main className="relative flex-1 max-w-7xl mx-auto w-full px-6 pt-28 pb-20" style={{ zIndex: 1 }}>
        <div className="space-y-8">

          {/* Page header */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <h1 className="text-[26px] font-extrabold tracking-tight" style={{ color: '#e8ecff' }}>
              Security Dashboard
            </h1>
            <p className="text-[13px] mt-1" style={{ color: 'rgba(160,165,210,0.55)' }}>
              Real-time threat intelligence and agent status
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <StatCard icon={ShieldAlert} label="Active Threats"  value={stats.activeIncidents}  sub="Requires attention"  color="red"    />
            <StatCard icon={Activity}   label="Events / Min"     value={stats.eventsPerMin}     sub="Global sensors"      color="cyan"   />
            <StatCard icon={Cpu}        label="System Load"      value="42%"                    sub="6 agents active"     color="purple" />
            <StatCard icon={Clock}      label="MTTR"             value={stats.avgResponseTime}  sub="Average response"    color="yellow" />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">

            {/* Live Threat Feed */}
            <motion.div
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="xl:col-span-2 flex flex-col overflow-hidden"
              style={{ ...cardStyle, height: 500 }}
            >
              <div className="p-5 flex justify-between items-center"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="flex items-center gap-3">
                  <Wifi className="text-cyan-400 animate-pulse" size={18} />
                  <h3 className="font-bold text-base" style={{ color: '#e8ecff' }}>Live Threat Intelligence</h3>
                </div>
                <div className="flex gap-2">
                  {['All', 'High', 'Critical'].map(f => (
                    <button key={f}
                      className="text-[11px] font-semibold px-3 py-1 rounded-lg transition-colors"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: 'rgba(160,165,210,0.6)' }}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-2" style={{ scrollbarWidth: 'thin' }}>
                {incidents.length > 0 ? incidents.map((inc, i) => {
                  const sev = (inc.severity as Severity) || 'medium';
                  const sc = SEV_COLOR[sev];
                  return (
                    <motion.div
                      key={inc.id || i}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="group flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all"
                      style={{ border: '1px solid transparent' }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                        (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                        (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                      }}
                    >
                      <div className="px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider min-w-[72px] text-center"
                        style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                        {sev}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between mb-0.5">
                          <h4 className="font-semibold text-sm truncate pr-4"
                            style={{ color: 'rgba(210,215,240,0.9)' }}>
                            {inc.title || 'Suspicious Activity Detected'}
                          </h4>
                          <span className="text-[11px] font-mono whitespace-nowrap"
                            style={{ color: 'rgba(100,105,160,0.6)' }}>
                            {inc.created_at ? new Date(inc.created_at + 'Z').toLocaleTimeString() : '12:42:05'}
                          </span>
                        </div>
                        <p className="text-[12px] truncate" style={{ color: 'rgba(120,125,175,0.55)' }}>
                          {inc.description || 'Anomalous packet signature detected on port 443.'}
                        </p>
                      </div>
                      <ArrowUpRight size={15} style={{ color: 'rgba(100,105,160,0.4)', flexShrink: 0 }} />
                    </motion.div>
                  );
                }) : (
                  <div className="h-full flex flex-col items-center justify-center"
                    style={{ color: 'rgba(100,105,160,0.45)' }}>
                    <Shield className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-sm">System Secure. No active threats.</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Right column */}
            <div className="space-y-5">

              {/* Agent Status */}
              <motion.div
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
                className="relative p-5 overflow-hidden"
                style={{ ...cardStyle, boxShadow: '0 0 40px -10px rgba(139,92,246,0.2)' }}
              >
                <div className="absolute inset-x-0 top-0 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.5), transparent)' }} />
                <div className="flex justify-between items-center mb-5">
                  <h3 className="font-bold text-base" style={{ color: '#e8ecff' }}>Agent Status</h3>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded"
                    style={{ color: '#34d399', background: 'rgba(52,211,153,0.1)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    100% ONLINE
                  </span>
                </div>

                <div className="space-y-3.5">
                  {['Detection', 'Investigation', 'Decision', 'Response', 'Remediation'].map((agent, i) => {
                    const ac = AGENT_COLORS[i % 3];
                    return (
                      <div key={agent} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-[11px] font-bold border"
                            style={{ background: ac.bg, borderColor: ac.border }}>
                            {agent[0]}
                          </div>
                          <div>
                            <p className="text-[13px] font-medium" style={{ color: 'rgba(210,215,240,0.85)' }}>
                              {agent} Agent
                            </p>
                            <p className="text-[10px]" style={{ color: 'rgba(100,105,160,0.55)' }}>v2.1.0 · Idle</p>
                          </div>
                        </div>
                        <div className="w-20 h-1 rounded-full overflow-hidden"
                          style={{ background: 'rgba(255,255,255,0.06)' }}>
                          <div className="h-full rounded-full"
                            style={{ width: '95%', background: 'rgba(52,211,153,0.5)' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* System Health */}
              <motion.div
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.22 }}
                className="relative p-5 overflow-hidden group"
                style={cardStyle}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.06) 0%, transparent 60%)' }} />
                <h3 className="font-bold text-base mb-2 relative" style={{ color: '#e8ecff' }}>System Health</h3>
                <div className="flex items-end gap-2 mb-1 relative">
                  <span className="text-4xl font-bold text-white">99.9%</span>
                  <span className="text-sm mb-1" style={{ color: '#34d399' }}>+0.2%</span>
                </div>
                <p className="text-[11px] mb-4 relative" style={{ color: 'rgba(100,105,160,0.55)' }}>
                  Uptime over last 30 days
                </p>
                <div className="h-14 flex items-end gap-[3px] opacity-60 relative">
                  {[40, 60, 45, 70, 80, 50, 60, 75, 90, 85, 80, 95].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t-sm"
                      style={{ height: `${h}%`, background: 'rgba(34,211,238,0.45)' }} />
                  ))}
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
