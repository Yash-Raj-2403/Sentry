import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Search, Clock, FileText, ChevronRight, Filter, AlertTriangle, CheckCircle, Activity, X, Globe, Target, Shield, Gauge } from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { cn } from '../lib/utils';

// Types
type Severity = 'critical' | 'high' | 'medium' | 'low';
type Status   = 'open' | 'investigating' | 'resolved';

interface Incident {
  id: number; 
  title: string;
  severity: Severity;
  status: Status;
  attacker_ip: string; 
  created_at: string; 
  description: string; 
  risk_score: number;
}

const SEVERITY_STYLES: Record<Severity, string> = {
  critical: 'bg-red-500/10 text-red-500 border-red-500/20',
  high:     'bg-orange-500/10 text-orange-500 border-orange-500/20',
  medium:   'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  low:      'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
};

const STATUS_STYLES: Record<Status, string> = {
    open: 'bg-red-500/10 text-red-400 border-red-500/20',
    investigating: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    resolved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

export default function Incidents() {
  const [severityFilter, setSeverityFilter] = useState<Severity | 'all'>('all');
  const [statusFilter,   setStatusFilter]   = useState<Status | 'all'>('all');
  const [search,         setSearch]         = useState('');
  const [incidents,      setIncidents]      = useState<Incident[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [selected,       setSelected]       = useState<Incident | null>(null);

  // Mock Fetch
  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res  = await fetch('http://localhost:8000/api/v1/incidents/');
        const data = await res.json();
        setIncidents(data);
      } catch { 
          // If fetch fails, we can either clear or keep mock data if we implemented it. 
          // For now, empty list is fine or we can add mock data if needed for demo.
      } finally { 
          setLoading(false); 
      }
    };
    fetchIncidents();
    // Poll every 5s
    const iv = setInterval(fetchIncidents, 5000);
    return () => clearInterval(iv);
  }, []);

  const filtered = incidents.filter(inc => {
    const sMatch = severityFilter === 'all' || inc.severity === severityFilter;
    const stMatch = statusFilter === 'all' || inc.status === statusFilter;
    const qMatch = inc.title.toLowerCase().includes(search.toLowerCase()) || 
                   inc.attacker_ip?.includes(search) || 
                   inc.description?.toLowerCase().includes(search.toLowerCase());
    return sMatch && stMatch && qMatch;
  });

  return (
    <MainLayout>
        <div className="space-y-6">
            
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Incident Response</h1>
                    <p className="text-gray-400 mt-1">Real-time threat monitoring and autonomous remediation logs.</p>
                </div>
                <div className="flex gap-3">
                    <GlassCard variant="hover" intensity="low" className="px-4 py-2 flex items-center gap-2 border-red-500/20 bg-red-500/5">
                        <AlertTriangle className="text-red-400" size={16} />
                        <span className="text-red-400 font-bold text-sm">
                            {incidents.filter(i => i.status !== 'resolved').length} Active Threats
                        </span>
                    </GlassCard>
                </div>
            </div>

            {/* Controls */}
            <GlassCard className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search by IP, type, or description..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 transition-all placeholder:text-gray-600"
                    />
                </div>
                
                <div className="flex w-full md:w-auto gap-2 overflow-x-auto pb-2 md:pb-0">
                    <div className="flex items-center gap-2 bg-black/20 rounded-lg p-1 border border-white/5">
                        <Filter size={14} className="text-gray-500 ml-2" />
                        {['all', 'critical', 'high', 'medium', 'low'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setSeverityFilter(s as any)}
                                className={cn(
                                    "px-3 py-1 rounded-md text-[10px] uppercase font-bold transition-all",
                                    severityFilter === s 
                                        ? "bg-white/10 text-white shadow-sm" 
                                        : "text-gray-500 hover:text-gray-300"
                                )}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>
            </GlassCard>

            {/* Incidents Table */}
            <GlassCard className="p-0 overflow-hidden min-h-[400px] flex flex-col">
                <div className="grid grid-cols-[3fr_1fr_1fr_1.5fr_1fr_40px] gap-4 p-4 border-b border-white/5 bg-white/5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <div>Incident Description</div>
                    <div>Severity</div>
                    <div>Status</div>
                    <div>Source</div>
                    <div>Detected</div>
                    <div></div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    <AnimatePresence>
                        {loading ? (
                              <div className="flex flex-col items-center justify-center py-20">
                                  <Activity className="animate-spin text-cyan-400 mb-2" size={24} />
                                  <p className="text-gray-500 text-sm">Scanning logs...</p>
                              </div>
                        ) : filtered.length > 0 ? (
                            filtered.map((inc, i) => (
                                <motion.div
                                    key={inc.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    transition={{ delay: i * 0.05 }}
                                    onClick={() => setSelected(inc)}
                                    className="grid grid-cols-[3fr_1fr_1fr_1.5fr_1fr_40px] gap-4 p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group items-center"
                                >
                                    <div className="min-w-0">
                                        <h3 className="font-semibold text-gray-200 truncate group-hover:text-cyan-400 transition-colors">{inc.title}</h3>
                                        <p className="text-xs text-gray-500 truncate mt-0.5">{inc.description}</p>
                                    </div>

                                    <div>
                                        <span className={cn("px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border", SEVERITY_STYLES[inc.severity])}>
                                            {inc.severity}
                                        </span>
                                    </div>

                                    <div>
                                         <span className={cn("flex w-fit items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border", STATUS_STYLES[inc.status])}>
                                            <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", inc.status === 'open' ? 'bg-red-400' : inc.status === 'investigating' ? 'bg-blue-400' : 'bg-emerald-400')} />
                                            {inc.status}
                                        </span>
                                    </div>

                                    <div className="text-xs font-mono text-gray-400">
                                        {inc.attacker_ip}
                                    </div>

                                    <div className="text-xs text-gray-500">
                                        {new Date(inc.created_at + 'Z').toLocaleString()}
                                    </div>

                                    <div className="flex justify-end">
                                        <ChevronRight size={16} className="text-gray-600 group-hover:text-cyan-400 transition-colors" />
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                                <CheckCircle className="w-16 h-16 mb-4 opacity-10" />
                                <p className="text-sm font-medium">No incidents match your filters</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </GlassCard>

        </div>

        {/* Incident Detail Panel */}
        <AnimatePresence>
          {selected && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSelected(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              />
              <motion.div
                initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed top-0 right-0 bottom-0 w-full max-w-lg z-50 bg-[#0a0a12] border-l border-white/10 overflow-y-auto"
              >
                <div className="p-6 space-y-6">

                  {/* Header */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border", SEVERITY_STYLES[selected.severity])}>
                          {selected.severity}
                        </span>
                        <span className={cn("flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border", STATUS_STYLES[selected.status])}>
                          <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", selected.status === 'open' ? 'bg-red-400' : selected.status === 'investigating' ? 'bg-blue-400' : 'bg-emerald-400')} />
                          {selected.status}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-white">{selected.title}</h2>
                    </div>
                    <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors shrink-0">
                      <X size={20} />
                    </button>
                  </div>

                  {/* Risk Score */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Gauge size={14} />
                        <span className="font-bold uppercase text-[10px] tracking-widest">Risk Score</span>
                      </div>
                      <span className={cn("text-2xl font-bold font-mono",
                        selected.risk_score >= 0.9 ? 'text-red-400' : selected.risk_score >= 0.7 ? 'text-orange-400' : selected.risk_score >= 0.4 ? 'text-yellow-400' : 'text-emerald-400'
                      )}>
                        {(selected.risk_score * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${selected.risk_score * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={cn("h-full rounded-full",
                          selected.risk_score >= 0.9 ? 'bg-red-500' : selected.risk_score >= 0.7 ? 'bg-orange-500' : selected.risk_score >= 0.4 ? 'bg-yellow-500' : 'bg-emerald-500'
                        )}
                      />
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <Globe size={13} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Source IP</span>
                      </div>
                      <p className="text-sm font-mono text-white">{selected.attacker_ip}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <Clock size={13} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Detected</span>
                      </div>
                      <p className="text-sm font-mono text-white">{new Date(selected.created_at + 'Z').toLocaleString()}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <ShieldAlert size={13} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Incident ID</span>
                      </div>
                      <p className="text-sm font-mono text-white">INC-{String(selected.id).padStart(4, '0')}</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                      <div className="flex items-center gap-2 text-gray-500 mb-2">
                        <Target size={13} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">MITRE ATT&CK</span>
                      </div>
                      <p className="text-sm font-mono text-cyan-400">
                        {selected.description?.match(/T\d{4}(?:\.\d{3})?/)?.[0] || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-500 mb-3">
                      <FileText size={13} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Analysis</span>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{selected.description}</p>
                  </div>

                  {/* Recommended Actions */}
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-gray-500 mb-3">
                      <Shield size={13} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Recommended Actions</span>
                    </div>
                    <ul className="space-y-2">
                      {selected.severity === 'critical' && (
                        <>
                          <li className="flex items-start gap-2 text-sm text-gray-300"><span className="text-red-400 mt-0.5">1.</span> Immediately block source IP at perimeter firewall</li>
                          <li className="flex items-start gap-2 text-sm text-gray-300"><span className="text-red-400 mt-0.5">2.</span> Isolate affected hosts from the network</li>
                          <li className="flex items-start gap-2 text-sm text-gray-300"><span className="text-red-400 mt-0.5">3.</span> Rotate all credentials for targeted services</li>
                          <li className="flex items-start gap-2 text-sm text-gray-300"><span className="text-red-400 mt-0.5">4.</span> Escalate to SOC Level 3 for forensic analysis</li>
                        </>
                      )}
                      {selected.severity === 'high' && (
                        <>
                          <li className="flex items-start gap-2 text-sm text-gray-300"><span className="text-orange-400 mt-0.5">1.</span> Add source IP to blocklist / rate-limiter</li>
                          <li className="flex items-start gap-2 text-sm text-gray-300"><span className="text-orange-400 mt-0.5">2.</span> Review and harden targeted service configuration</li>
                          <li className="flex items-start gap-2 text-sm text-gray-300"><span className="text-orange-400 mt-0.5">3.</span> Verify no unauthorized access was achieved</li>
                        </>
                      )}
                      {selected.severity === 'medium' && (
                        <>
                          <li className="flex items-start gap-2 text-sm text-gray-300"><span className="text-yellow-400 mt-0.5">1.</span> Monitor source IP for further activity</li>
                          <li className="flex items-start gap-2 text-sm text-gray-300"><span className="text-yellow-400 mt-0.5">2.</span> Verify service hardening and patch levels</li>
                        </>
                      )}
                      {selected.severity === 'low' && (
                        <li className="flex items-start gap-2 text-sm text-gray-300"><span className="text-emerald-400 mt-0.5">1.</span> Log for trend analysis, no immediate action required</li>
                      )}
                    </ul>
                  </div>

                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
    </MainLayout>
  );
}
