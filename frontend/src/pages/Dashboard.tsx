import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  ShieldAlert, Activity, Cpu, Clock, Wifi, AlertTriangle,
  CheckCircle2, XCircle, Eye, Zap
} from 'lucide-react';

// ─── Severity badge ───────────────────────────────────────────────────────────
function SeverityBadge({ level }: { level: 'critical' | 'high' | 'medium' | 'low' }) {
  const map = {
    critical: 'bg-red-500/15 text-red-400 border-red-500/30',
    high:     'bg-orange-500/15 text-orange-400 border-orange-500/30',
    medium:   'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    low:      'bg-green-500/15 text-green-400 border-green-500/30',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider border ${map[level]}`}>
      {level}
    </span>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string; sub: string; color: string;
}) {
  return (
    <div className={`bg-[#0c0c14] border border-white/8 rounded-2xl p-6 relative overflow-hidden group hover:border-white/15 transition-all`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</span>
          <div className="text-gray-600">{icon}</div>
        </div>
        <div className="text-3xl font-black text-white tracking-tight mb-1">{value}</div>
        <div className="text-xs text-gray-500">{sub}</div>
      </div>
    </div>
  );
}

// ─── Agent status row ─────────────────────────────────────────────────────────
function AgentRow({ name, status, lastRun }: { name: string; status: 'active' | 'idle' | 'error'; lastRun: string }) {
  const map = {
    active: { dot: 'bg-green-400 animate-pulse', text: 'text-green-400', label: 'Active' },
    idle:   { dot: 'bg-yellow-400',              text: 'text-yellow-400', label: 'Idle'   },
    error:  { dot: 'bg-red-400',                 text: 'text-red-400',   label: 'Error'  },
  };
  const s = map[status];
  return (
    <div className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3">
        <span className={`w-2 h-2 rounded-full ${s.dot}`} />
        <span className="text-sm font-medium text-gray-200">{name}</span>
      </div>
      <div className="flex items-center gap-6">
        <span className={`text-xs font-semibold ${s.text}`}>{s.label}</span>
        <span className="text-xs text-gray-600 font-mono">{lastRun}</span>
      </div>
    </div>
  );
}

// ─── Feed item ────────────────────────────────────────────────────────────────
function FeedItem({ time, message, severity }: { time: string; message: string; severity: 'critical' | 'high' | 'medium' | 'low' }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <span className="text-[10px] font-mono text-gray-600 mt-0.5 shrink-0 pt-0.5">{time}</span>
      <SeverityBadge level={severity} />
      <span className="text-sm text-gray-300 leading-snug">{message}</span>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#030305] text-white font-sans flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-28 pb-16">

        {/* Page title */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">SOC Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Real-time autonomous security operations center</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            All agents online
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<ShieldAlert size={18} />} label="Active Incidents"   value="—"   sub="Connect backend to view live data" color="from-red-500/5 to-transparent" />
          <StatCard icon={<Activity   size={18} />} label="Events / min"        value="—"   sub="Awaiting sensor agent stream"      color="from-cyan-500/5 to-transparent" />
          <StatCard icon={<Cpu        size={18} />} label="Agents Running"      value="6"   sub="All pipeline agents healthy"       color="from-purple-500/5 to-transparent" />
          <StatCard icon={<Clock      size={18} />} label="Avg Response Time"    value="—"   sub="No incidents resolved yet"         color="from-amber-500/5 to-transparent" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* Live alert feed */}
          <div className="lg:col-span-2 bg-[#0c0c14] border border-white/8 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Wifi size={16} className="text-cyan-500" />
                <h2 className="text-sm font-bold text-white uppercase tracking-widest">Live Alert Feed</h2>
              </div>
              <span className="text-[10px] text-gray-600 font-mono">Streaming via WebSocket</span>
            </div>

            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Wifi size={20} className="text-gray-600" />
              </div>
              <p className="text-sm font-medium text-gray-400 mb-1">Awaiting event stream</p>
              <p className="text-xs text-gray-600 max-w-xs">Alerts will appear here in real-time once the backend sensor agent is connected via WebSocket.</p>
            </div>
          </div>

          {/* Agent status panel */}
          <div className="bg-[#0c0c14] border border-white/8 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Cpu size={16} className="text-purple-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">Agent Pipeline</h2>
            </div>
            <div className="space-y-0">
              <AgentRow name="Detection Agent"    status="active" lastRun="waiting" />
              <AgentRow name="Investigation Agent" status="active" lastRun="waiting" />
              <AgentRow name="Decision Agent"     status="active" lastRun="waiting" />
              <AgentRow name="Response Agent"     status="active" lastRun="waiting" />
              <AgentRow name="Remediation Agent"  status="active" lastRun="waiting" />
              <AgentRow name="Explanation Agent"  status="active" lastRun="waiting" />
            </div>
          </div>

        </div>

        {/* Risk score & network topology placeholder */}
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-[#0c0c14] border border-white/8 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Zap size={16} className="text-amber-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">Risk Score Trend</h2>
            </div>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Activity size={20} className="text-gray-600" />
              </div>
              <p className="text-sm font-medium text-gray-400 mb-1">No risk data yet</p>
              <p className="text-xs text-gray-600">Risk scores will populate once incidents are detected by the pipeline.</p>
            </div>
          </div>

          <div className="bg-[#0c0c14] border border-white/8 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Eye size={16} className="text-cyan-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-widest">Network Topology</h2>
            </div>
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                <Eye size={20} className="text-gray-600" />
              </div>
              <p className="text-sm font-medium text-gray-400 mb-1">Topology graph pending</p>
              <p className="text-xs text-gray-600">Attack vectors will be visualized here once the infrastructure is connected.</p>
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
