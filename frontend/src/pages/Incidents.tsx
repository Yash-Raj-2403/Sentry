import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ShieldAlert, Filter, Search, Clock, ArrowRight, FileText, ChevronRight } from 'lucide-react';

type Severity = 'all' | 'critical' | 'high' | 'medium' | 'low';
type Status   = 'all' | 'open' | 'investigating' | 'resolved';

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

function StatusBadge({ status }: { status: 'open' | 'investigating' | 'resolved' }) {
  const map = {
    open:          'bg-red-500/10 text-red-400',
    investigating: 'bg-blue-500/10 text-blue-400',
    resolved:      'bg-green-500/10 text-green-400',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${map[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

const SEVERITY_FILTERS: Severity[] = ['all', 'critical', 'high', 'medium', 'low'];
const STATUS_FILTERS:   Status[]   = ['all', 'open', 'investigating', 'resolved'];

export default function Incidents() {
  const [severity, setSeverity] = useState<Severity>('all');
  const [status,   setStatus]   = useState<Status>('all');
  const [search,   setSearch]   = useState('');
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/incidents/');
        const data = await response.json();
        setIncidents(data);
      } catch (error) {
        console.error('Failed to fetch incidents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
    const interval = setInterval(fetchIncidents, 2000); // Poll every 2s
    return () => clearInterval(interval);
  }, []);
  
  const filteredIncidents = incidents.filter(inc => {
      const matchSeverity = severity === 'all' || inc.severity === severity;
      const matchStatus = status === 'all' || inc.status === status;
      const matchSearch = inc.title.toLowerCase().includes(search.toLowerCase()) || 
                          inc.attacker_ip?.includes(search) || 
                          inc.description?.toLowerCase().includes(search.toLowerCase());
      return matchSeverity && matchStatus && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#030305] text-white font-sans flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-28 pb-16">

        {/* Header row */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Incidents</h1>
            <p className="text-sm text-gray-500 mt-1">Track and investigate all detected security incidents</p>
          </div>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search incidents…"
              className="w-full bg-[#0c0c14] border border-white/8 text-sm text-white pl-9 pr-4 py-2.5 rounded-xl outline-none focus:border-cyan-500/40 focus:ring-1 focus:ring-cyan-500/20 placeholder-gray-600 transition-all"
            />
          </div>

          {/* Severity filter */}
          <div className="flex items-center gap-1 bg-[#0c0c14] border border-white/8 rounded-xl p-1">
            {SEVERITY_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setSeverity(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  severity === s ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1 bg-[#0c0c14] border border-white/8 rounded-xl p-1">
            {STATUS_FILTERS.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  status === s ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Incident table */}
        <div className="bg-[#0c0c14] border border-white/8 rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 border-b border-white/5 text-[11px] font-bold text-gray-600 uppercase tracking-widest">
            <span>Incident</span>
            <span>Severity</span>
            <span>Status</span>
            <span>Source IP</span>
            <span>Detected</span>
            <span></span>
          </div>

          {filteredIncidents.length > 0 ? (
            <div>
              {filteredIncidents.map((incident) => (
                <div key={incident.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{incident.title}</h3>
                    <p className="text-xs text-gray-500 truncate">{incident.description}</p>
                  </div>
                  <div><SeverityBadge level={incident.severity || 'low'} /></div>
                  <div><StatusBadge status={incident.status || 'open'} /></div>
                  <div className="text-sm font-mono text-gray-400">{incident.attacker_ip}</div>
                  <div className="text-xs text-gray-500">{new Date(incident.created_at).toLocaleTimeString()}</div>
                  <div className="text-right">
                    <ChevronRight size={16} className="text-gray-600" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
              <ShieldAlert size={24} className="text-gray-600" />
            </div>
            <p className="text-sm font-semibold text-gray-400 mb-2">No incidents detected{loading ? ' (Loading...)' : ''}</p>
          </div>
          )}
        </div>

        {/* Investigation timeline placeholder */}
        <div className="mt-6 bg-[#0c0c14] border border-white/8 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-5">
            <Clock size={16} className="text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-widest">Investigation Timeline</h2>
            <span className="ml-auto text-[11px] text-gray-600">Select an incident to view its timeline</span>
          </div>
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <FileText size={28} className="text-gray-700 mb-3" />
            <p className="text-xs text-gray-600">Agent reasoning steps, evidence lists, and response actions will appear here.</p>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
