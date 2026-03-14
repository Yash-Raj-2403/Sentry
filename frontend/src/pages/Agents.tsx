import { motion } from 'framer-motion';
import {
  Radar, Search, Brain, ShieldOff, Wrench, FileText,
  CheckCircle2, Activity, ArrowRight
} from 'lucide-react';
import MainLayout from '../components/layout/MainLayout';
import { GlassCard } from '../components/ui/GlassCard';
import { cn } from '../lib/utils';

type AgentStatus = 'active' | 'idle' | 'standby';
interface AgentDef {
  id: number; 
  name: string; 
  role: string; 
  description: string;
  status: AgentStatus; 
  icon: any; 
  accent: string; 
  colorName: string; // explicit tailwind color name for Safelist if needed, but we use style for dynamic
  capabilities: string[];
}

const AGENTS: AgentDef[] = [
  { id: 1, name: 'Detection Agent',   role: 'Threat Identification',        status: 'active', accent: '#22d3ee', colorName: 'cyan', icon: Radar,
    description: 'Monitors incoming event streams for burst connection patterns and sequential port scanning. Computes anomaly score 0–1 per event cluster.',
    capabilities: ['Burst connection detection','Port scan detection','Anomaly scoring (0–1)','Edge-side rate-limiter bypass'] },
  { id: 2, name: 'Investigation Agent', role: 'Contextual Reasoning',        status: 'active', accent: '#6366f1', colorName: 'indigo', icon: Search,
    description: 'Queries recent logs and vector memory (pgvector) to build a full evidence list and generate step-by-step reasoning for each incident.',
    capabilities: ['Log correlation','pgvector semantic search','Evidence list building','Reasoning step generation'] },
  { id: 3, name: 'Decision Agent',    role: 'Risk Scoring & Action Select', status: 'active', accent: '#8b5cf6', colorName: 'purple', icon: Brain,
    description: 'Calculates composite risk score via anomaly_score × attack_velocity × asset_criticality. Selects the appropriate response action.',
    capabilities: ['Dynamic risk scoring','Policy enforcement','Action selection','HITL gate for destructive actions'] },
  { id: 4, name: 'Response Agent',    role: 'Active Enforcement',           status: 'active', accent: '#f43f5e', colorName: 'rose', icon: ShieldOff,
    description: 'Executes firewall commands, performs micro-segmentation by severing network interfaces, and kills persistent backdoor processes.',
    capabilities: ['iptables / UFW rule injection','Network interface severing','Process assassination (kill -9)','Response log storage'] },
  { id: 5, name: 'Remediation Agent', role: 'Recovery & Healing',           status: 'active', accent: '#fbbf24', colorName: 'amber', icon: Wrench,
    description: 'Rolls back poisoned config files to known-good encrypted snapshots and triggers ZFS/Btrfs filesystem restorations to undo damage.',
    capabilities: ['Config file rollback','ZFS / Btrfs snapshot restoration','Ransomware damage undo','Known-good state verification'] },
  { id: 6, name: 'Explanation Agent', role: 'SOC Reporting',                status: 'active', accent: '#34d399', colorName: 'emerald', icon: FileText,
    description: 'Generates human-readable SOC-style reports, maps attacks to MITRE ATT&CK techniques, and provides actionable remediation suggestions.',
    capabilities: ['SOC report generation','MITRE ATT&CK mapping','Remediation suggestions','Natural language explanations'] },
];

export default function Agents() {
  return (
    <MainLayout>
        <div className="space-y-8">
            
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">AI Agent Hive</h1>
                <p className="text-gray-400 mt-1">Autonomous swarm status and capability matrix.</p>
            </div>

            {/* Pipeline Visual */}
            <GlassCard className="p-8 relative overflow-hidden" variant="cyber" intensity="low">
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent animate-pulse pointer-events-none" />
                 <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-6 text-center">Execution Pipeline Flow</h3>
                 
                 <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 relative z-10">
                    {AGENTS.map((agent, i) => (
                         <div key={agent.id} className="flex items-center gap-4">
                              <div className="flex flex-col items-center gap-3 group cursor-pointer transition-transform hover:-translate-y-1">
                                   <div className={cn(
                                       "w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-lg",
                                       "bg-white/5 border border-white/10 group-hover:bg-white/10 group-hover:border-white/20"
                                   )} style={{ borderColor: `${agent.accent}40`, boxShadow: `0 0 15px ${agent.accent}10` }}>
                                       <agent.icon size={20} style={{ color: agent.accent }} />
                                   </div>
                                   <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{agent.name.split(' ')[0]}</span>
                              </div>
                              {i < AGENTS.length - 1 && (
                                  <ArrowRight className="text-gray-600 hidden md:block" size={16} />
                              )}
                         </div>
                    ))}
                 </div>
            </GlassCard>

            {/* Agent Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {AGENTS.map((agent, i) => (
                    <motion.div
                        key={agent.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <GlassCard className="h-full flex flex-col p-6 group hover:border-white/20 transition-colors" variant="default">
                            {/* Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:scale-110 transition-transform duration-300"
                                     style={{ backgroundColor: `${agent.accent}10`, borderColor: `${agent.accent}20` }}>
                                    <agent.icon size={24} style={{ color: agent.accent }} />
                                </div>
                                <span className={cn(
                                    "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5",
                                    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                )}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Active
                                </span>
                            </div>
                            
                            {/* Content */}
                            <div className="mb-6 flex-1">
                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">{agent.name}</h3>
                                <p className="text-xs text-brand-purple font-mono mb-3">{agent.role}</p>
                                <p className="text-sm text-gray-400 leading-relaxed">{agent.description}</p>
                            </div>

                            {/* Capabilities */}
                            <div className="space-y-2 pt-4 border-t border-white/5">
                                {agent.capabilities.map(cap => (
                                    <div key={cap} className="flex items-center gap-2 text-xs text-gray-500">
                                        <CheckCircle2 size={12} style={{ color: agent.accent }} />
                                        <span>{cap}</span>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Footer */}
                            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between opacity-50 text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                                <span>v2.4.0</span>
                                <span className="flex items-center gap-1"><Activity size={10} /> Idle</span>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>
        </div>
    </MainLayout>
  );
}
