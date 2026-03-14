import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Server, Activity, Shield, Wifi, Globe, AlertTriangle,
  Radio, Eye, Lock, ChevronRight, RefreshCw, Zap
} from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { cn } from '../lib/utils';

interface Incident {
  id: number;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'investigating' | 'resolved';
  attacker_ip: string;
  created_at: string;
  description: string;
  risk_score: number;
}

const SEVERITY_COLOR: Record<string, string> = {
  critical: 'text-red-400',
  high:     'text-orange-400',
  medium:   'text-yellow-400',
  low:      'text-emerald-400',
};

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-red-400',
  high:     'bg-orange-400',
  medium:   'bg-yellow-400',
  low:      'bg-emerald-400',
};

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number;
  sub?: string; color: string;
}) {
  return (
    <GlassCard className="p-5" intensity="low">
      <div className="flex items-start justify-between mb-3">
        <div className={cn('p-2 rounded-lg bg-white/5 border border-white/10', color)}>
          <Icon size={18} />
        </div>
        <span className="text-[10px] text-gray-600 font-mono uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </GlassCard>
  );
}

export default function Network() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading]     = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  const fetchData = async () => {
    try {
      const res  = await fetch('http://localhost:8000/api/v1/incidents/');
      const data = await res.json();
      setIncidents(data);
    } catch {
      // keep existing data on transient failure
    } finally {
      setLoading(false);
      setLastRefresh(new Date());
    }
  };

  useEffect(() => {
    fetchData();
    const iv = setInterval(fetchData, 5000);
    return () => clearInterval(iv);
  }, []);

  // Derive network stats from incident data
  const uniqueIPs      = [...new Set(incidents.map(i => i.attacker_ip).filter(Boolean))];
  const activeThreats  = incidents.filter(i => i.status !== 'resolved');
  const critical       = incidents.filter(i => i.severity === 'critical').length;
  const blocked        = incidents.filter(i => i.status === 'resolved').length;

  // Most frequent attacker IPs
  const ipCounts = incidents.reduce<Record<string, number>>((acc, inc) => {
    if (inc.attacker_ip) acc[inc.attacker_ip] = (acc[inc.attacker_ip] || 0) + 1;
    return acc;
  }, {});

  const topIPs = Object.entries(ipCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <MainLayout>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Network Intelligence</h1>
            <p className="text-gray-400 mt-1">Live sensor feed, IP reputation, and honeypot telemetry.</p>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-400 hover:text-white transition-all"
          >
            <RefreshCw size={13} />
            Last refresh: {lastRefresh.toLocaleTimeString()}
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Globe}        label="Unique Source IPs" value={uniqueIPs.length}   sub="Seen this session"        color="text-cyan-400" />
          <StatCard icon={AlertTriangle} label="Active Threats"   value={activeThreats.length} sub="Open + investigating"   color="text-red-400" />
          <StatCard icon={Zap}          label="Critical Events"  value={critical}              sub="Require immediate action" color="text-orange-400" />
          <StatCard icon={Lock}         label="Threats Blocked"  value={blocked}               sub="Resolved incidents"       color="text-emerald-400" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Live Event Feed */}
          <div className="lg:col-span-2">
            <GlassCard className="p-0 overflow-hidden" variant="cyber">
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                    <Activity className="text-cyan-400" size={16} />
                  </div>
                  <h2 className="font-bold text-sm uppercase tracking-widest text-white">Live Event Feed</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-400 font-mono">LIVE</span>
                </div>
              </div>

              <div className="min-h-[380px]">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <Radio className="animate-pulse text-cyan-400 mb-3" size={28} />
                    <p className="text-gray-500 text-sm">Scanning network...</p>
                  </div>
                ) : incidents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-600">
                    <Wifi size={48} className="mb-4 opacity-20" />
                    <p className="text-sm">No events detected yet</p>
                    <p className="text-xs mt-1 opacity-60">Run the inject_attacks script to simulate events</p>
                  </div>
                ) : (
                  <AnimatePresence>
                    {incidents.slice(0, 10).map((inc, i) => (
                      <motion.div
                        key={inc.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-4 p-3 border-b border-white/5 hover:bg-white/5 transition-colors group"
                      >
                        <span className={cn('w-2 h-2 rounded-full shrink-0 animate-pulse', SEVERITY_DOT[inc.severity])} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-200 truncate group-hover:text-cyan-400 transition-colors">
                            {inc.title}
                          </p>
                          <p className="text-[10px] text-gray-500 font-mono mt-0.5">{inc.attacker_ip}</p>
                        </div>
                        <span className={cn('text-[10px] font-bold uppercase', SEVERITY_COLOR[inc.severity])}>
                          {inc.severity}
                        </span>
                        <span className="text-[10px] text-gray-600 shrink-0">
                          {new Date(inc.created_at).toLocaleTimeString()}
                        </span>
                        <ChevronRight size={14} className="text-gray-600 group-hover:text-cyan-400 transition-colors shrink-0" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Right column */}
          <div className="space-y-4">

            {/* Sensor Status */}
            <GlassCard className="p-5" variant="cyber" intensity="low">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <Radio className="text-purple-400" size={16} />
                </div>
                <h3 className="font-bold text-sm uppercase tracking-widest text-white">Sensor Status</h3>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Network Sensor', status: 'online', port: '8080' },
                  { name: 'Honeypot SSH',   status: 'online', port: '2222' },
                  { name: 'Honeypot HTTP',  status: 'online', port: '8888' },
                  { name: 'Redis Stream',   status: 'online', port: '6379' },
                ].map((s) => (
                  <div key={s.name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs text-gray-300">{s.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-gray-500">:{s.port}</span>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase">{s.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Top Attacker IPs */}
            <GlassCard className="p-5" intensity="low">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                  <Eye className="text-red-400" size={16} />
                </div>
                <h3 className="font-bold text-sm uppercase tracking-widest text-white">Top Attacker IPs</h3>
              </div>
              {topIPs.length === 0 ? (
                <p className="text-xs text-gray-600 text-center py-6">No data yet</p>
              ) : (
                <div className="space-y-2">
                  {topIPs.map(([ip, count]) => (
                    <div key={ip} className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono text-gray-300">{ip}</span>
                      <div className="flex items-center gap-2">
                        <div className="h-1 rounded-full bg-red-500/20 w-16 overflow-hidden">
                          <div
                            className="h-full bg-red-400 rounded-full"
                            style={{ width: `${Math.min(100, (count / incidents.length) * 100 * 3)}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-red-400 font-bold w-6 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>

            {/* Protocol Breakdown */}
            <GlassCard className="p-5" intensity="low">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <Server className="text-blue-400" size={16} />
                </div>
                <h3 className="font-bold text-sm uppercase tracking-widest text-white">Attack Vectors</h3>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Brute Force / Auth',    pct: Math.round(incidents.filter(i => i.title?.toLowerCase().includes('brute') || i.title?.toLowerCase().includes('auth')).length / Math.max(incidents.length, 1) * 100), color: 'bg-red-400' },
                  { label: 'Port Scan / Recon',     pct: Math.round(incidents.filter(i => i.title?.toLowerCase().includes('scan') || i.title?.toLowerCase().includes('recon')).length / Math.max(incidents.length, 1) * 100), color: 'bg-orange-400' },
                  { label: 'Lateral Movement',      pct: Math.round(incidents.filter(i => i.title?.toLowerCase().includes('lateral') || i.title?.toLowerCase().includes('remote')).length / Math.max(incidents.length, 1) * 100), color: 'bg-yellow-400' },
                  { label: 'Other / Unknown',       pct: null, color: 'bg-cyan-400' },
                ].map((item) => {
                  const pct = item.pct !== null ? item.pct : Math.max(0, 100 - 0);
                  return (
                    <div key={item.label}>
                      <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                        <span>{item.label}</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                          className={cn('h-full rounded-full', item.color)}
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

          </div>
        </div>
      </div>
    </MainLayout>
  );
}
