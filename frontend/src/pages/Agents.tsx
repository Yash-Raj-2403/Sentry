import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  Radar, Search, Brain, ShieldOff, Wrench, FileText,
  CheckCircle2, Activity
} from 'lucide-react';

type AgentStatus = 'active' | 'idle' | 'standby';

interface AgentDef {
  id: number;
  name: string;
  role: string;
  description: string;
  status: AgentStatus;
  icon: React.ReactNode;
  color: string;
  capabilities: string[];
}

const AGENTS: AgentDef[] = [
  {
    id: 1,
    name: 'Detection Agent',
    role: 'Threat Identification',
    description: 'Monitors incoming event streams for burst connection patterns and sequential port scanning. Computes an anomaly score between 0 and 1 for each event cluster.',
    status: 'active',
    icon: <Radar size={22} />,
    color: 'from-cyan-500/20 to-cyan-900/5',
    capabilities: ['Burst connection detection', 'Port scan detection', 'Anomaly scoring (0–1)', 'Edge-side rate-limiter bypass'],
  },
  {
    id: 2,
    name: 'Investigation Agent',
    role: 'Contextual Reasoning',
    description: 'Queries recent related logs and vector memory (pgvector) to build a full evidence list and generate a step-by-step reasoning sequence for each incident.',
    status: 'active',
    icon: <Search size={22} />,
    color: 'from-blue-500/20 to-blue-900/5',
    capabilities: ['Log correlation', 'pgvector semantic search', 'Evidence list building', 'Reasoning step generation'],
  },
  {
    id: 3,
    name: 'Decision Agent',
    role: 'Risk Scoring & Action Selection',
    description: 'Calculates a composite risk score using the formula: risk_score = anomaly_score × attack_velocity × asset_criticality. Selects the appropriate response action.',
    status: 'active',
    icon: <Brain size={22} />,
    color: 'from-purple-500/20 to-purple-900/5',
    capabilities: ['Dynamic risk scoring', 'Policy enforcement', 'Action selection (monitor / rate-limit / block / isolate)', 'HITL gate for destructive actions'],
  },
  {
    id: 4,
    name: 'Response & Containment Agent',
    role: 'Active Enforcement',
    description: 'Executes firewall commands, performs micro-segmentation by severing network interfaces, and assassinates persistent backdoor processes. Verifies each action.',
    status: 'active',
    icon: <ShieldOff size={22} />,
    color: 'from-red-500/20 to-red-900/5',
    capabilities: ['iptables / UFW rule injection', 'Network interface severing', 'Process assassination (kill -9)', 'Response log storage'],
  },
  {
    id: 5,
    name: 'Remediation Agent',
    role: 'Recovery & Healing',
    description: 'Rolls back poisoned configuration files to known-good encrypted snapshots and triggers ZFS/Btrfs filesystem snapshot restorations to undo ransomware damage.',
    status: 'active',
    icon: <Wrench size={22} />,
    color: 'from-amber-500/20 to-amber-900/5',
    capabilities: ['Config file rollback', 'ZFS / Btrfs snapshot restoration', 'Ransomware damage undo', 'Known-good state verification'],
  },
  {
    id: 6,
    name: 'Explanation Agent',
    role: 'SOC Reporting',
    description: 'Generates human-readable SOC-style incident reports, maps attacks to MITRE ATT&CK techniques, and provides actionable remediation suggestions for analysts.',
    status: 'active',
    icon: <FileText size={22} />,
    color: 'from-green-500/20 to-green-900/5',
    capabilities: ['SOC report generation', 'MITRE ATT&CK mapping', 'Remediation suggestions', 'Natural language explanations'],
  },
];

const STATUS_STYLE: Record<AgentStatus, { dot: string; label: string; text: string }> = {
  active:  { dot: 'bg-green-400 animate-pulse', label: 'Active',  text: 'text-green-400'  },
  idle:    { dot: 'bg-yellow-400',              label: 'Idle',    text: 'text-yellow-400' },
  standby: { dot: 'bg-gray-500',               label: 'Standby', text: 'text-gray-400'   },
};

export default function Agents() {
  return (
    <div className="min-h-screen bg-[#030305] text-white font-sans flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 pt-28 pb-16">

        <div className="mb-10">
          <h1 className="text-2xl font-bold text-white tracking-tight">AI Agent Pipeline</h1>
          <p className="text-sm text-gray-500 mt-1">Six collaborative agents that form the autonomous SOC defense chain</p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {AGENTS.map((agent) => {
            const s = STATUS_STYLE[agent.status];
            return (
              <div
                key={agent.id}
                className="group bg-[#0c0c14] border border-white/8 rounded-2xl p-6 relative overflow-hidden hover:border-white/15 transition-all duration-300"
              >
                {/* Colour glow */}
                <div className={`absolute top-0 left-0 w-full h-28 bg-gradient-to-b ${agent.color} opacity-60 blur-2xl pointer-events-none`} />

                <div className="relative z-10">
                  {/* Icon + status */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-white/6 border border-white/10 flex items-center justify-center text-gray-300">
                      {agent.icon}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
                      <span className={`text-xs font-semibold ${s.text}`}>{s.label}</span>
                    </div>
                  </div>

                  {/* Label */}
                  <div className="mb-1">
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Agent {agent.id} · {agent.role}</span>
                  </div>
                  <h2 className="text-base font-bold text-white mb-3">{agent.name}</h2>
                  <p className="text-xs text-gray-400 leading-relaxed mb-5">{agent.description}</p>

                  {/* Capabilities */}
                  <div className="border-t border-white/5 pt-4 space-y-2">
                    {agent.capabilities.map((cap) => (
                      <div key={cap} className="flex items-center gap-2 text-xs text-gray-400">
                        <CheckCircle2 size={12} className="text-cyan-600 shrink-0" />
                        {cap}
                      </div>
                    ))}
                  </div>

                  {/* Activity indicator */}
                  <div className="mt-5 flex items-center gap-2 text-[11px] text-gray-600">
                    <Activity size={11} />
                    <span>Awaiting event stream from sensor agent</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </main>
      <Footer />
    </div>
  );
}
