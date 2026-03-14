// @ts-ignore
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  LayoutDashboard,
  GitMerge,
  Cpu,
  ArrowRight,
  Server,
  Lock
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="bg-[#030305] text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden min-h-screen flex flex-col">
      <Header />

      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden bg-[#030305] flex items-center">
        {/* Metallic Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[80vw] h-[80vw] bg-blue-900/10 rounded-full blur-[100px] mix-blend-screen opacity-40"></div>
          <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-cyan-900/10 rounded-full blur-[100px] mix-blend-screen opacity-30"></div>
          {/* Metallic noise texture overlay */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>

        {/* Floating Abstract Shapes for Metallic Feel */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[20%] left-[10%] w-px h-[200px] bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent"></div>
          <div className="absolute bottom-[20%] right-[20%] w-[200px] h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
        </div>

        {/* 3D Scene Wrapper */}
        <div className="absolute inset-0 z-0 pointer-events-auto overflow-hidden">
          <div className="absolute w-full h-full lg:w-[130%] lg:h-[130%] lg:translate-x-[5%] lg:-translate-y-[5%] flex items-center justify-center">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
            <iframe
              src="https://my.spline.design/nexbotrobotcharacterconcept-f9AJhCw5Liun2d3dqvHMsAC5/"
              frameBorder="0"
              width="100%"
              height="100%"
              className="w-full h-full scale-[1.0] lg:scale-[0.85] pointer-events-auto brightness-110 contrast-110 saturate-100 transition-opacity duration-1000 ease-out"
              style={{ maskImage: "radial-gradient(circle closest-side, black 60%, transparent 100%)" }}
            ></iframe>
          </div>
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#030305] via-[#030305]/80 to-transparent pointer-events-none"></div>
        </div>

        {/* Hero Content */}
        <div className="max-w-7xl mx-auto w-full h-full flex flex-col lg:flex-row items-center justify-between px-6 relative z-10 pointer-events-none">
          <div className="flex-1 max-w-xl pt-32 lg:pt-0 pointer-events-auto opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-cyan-300 text-[11px] font-bold uppercase tracking-wider mb-8 shadow-[0_0_20px_-5px_rgba(34,211,238,0.3)] backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              System Online v2.4
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6 text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 drop-shadow-sm">
              Autonomous security for your <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 animate-shine bg-[length:200%_auto]">
                infrastructure
              </span>
            </h1>

            <p className="text-lg text-gray-400 mb-10 leading-relaxed max-w-lg font-medium">
              Stop chasing alerts. CyberHelm's AI swarm investigates, patches, and deploys fixes before threats can exploit them.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/register" className="group relative px-8 py-4 bg-white text-black rounded-xl font-bold overflow-hidden transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-white to-gray-200 opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>

              <Link to="/dashboard" className="px-8 py-4 bg-white/5 border border-white/10 backdrop-blur-sm text-gray-300 rounded-xl font-bold hover:bg-white/10 hover:border-white/20 hover:text-white transition-all hover:scale-[1.02] flex items-center gap-2 group">
                <LayoutDashboard size={18} className="text-gray-500 group-hover:text-white transition-colors" />
                <span>View Dashboard</span>
              </Link>
            </div>


          </div>
        </div>
      </div>

      {/* Features Grid - Metallic Cards */}
      <section id="features" className="py-24 px-6 bg-[#030305] relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-cyan-500 uppercase tracking-widest mb-3">Capabilities</h2>
            <h3 className="text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">Autonomous Defense Grid</h3>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Replace manual playbooks with intelligent agents. CyberHelm monitors every layer of your stack.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<Zap className="text-amber-400" />}
              title="Instant Remediation"
              desc="Detects threats and applies patches instantly. Reduce MTTR from days to milliseconds."
              headerColor="from-amber-500/20 to-amber-900/5"
            />
            <FeatureCard
              icon={<Cpu className="text-cyan-400" />}
              title="Agent Swarm"
              desc="Decentralized agents coordinate to investigate anomalies across your entire infrastructure graph."
              headerColor="from-cyan-500/20 to-cyan-900/5"
            />
            <FeatureCard
              icon={<GitMerge className="text-indigo-400" />}
              title="Self-Healing Code"
              desc="CyberHelm doesn't just block attacks; it identifies the vulnerability and suggests code fixes."
              headerColor="from-indigo-500/20 to-indigo-900/5"
            />
            <FeatureCard
              icon={<Lock className="text-emerald-400" />}
              title="Perimeter Zero"
              desc="Identity-aware security that assumes breach and verifies every request, internally and externally."
              headerColor="from-emerald-500/20 to-emerald-900/5"
            />
            <FeatureCard
              icon={<LayoutDashboard className="text-purple-400" />}
              title="Live Telemetry"
              desc="Real-time visualization of attack vectors as they happen. Watch the swarm neutralize them live."
              headerColor="from-purple-500/20 to-purple-900/5"
            />
            <FeatureCard
              icon={<Server className="text-rose-400" />}
              title="Infrastructure As Code"
              desc="Deep integration with Terraform and Kubernetes to enforce security policies at the deploy level."
              headerColor="from-rose-500/20 to-rose-900/5"
            />
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center relative">
          {/* Glow behind text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/20 blur-[100px] rounded-full -z-10"></div>

          <h2 className="text-5xl lg:text-7xl font-bold text-white mb-8 tracking-tighter">
            Ready to automate?
          </h2>
          <p className="text-xl text-gray-400 mb-12 max-w-xl mx-auto">
            Join the future of DevSecOps. Deploy CyberHelm today and let the agents handle the rest.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="px-10 py-4 bg-white text-black text-lg rounded-xl font-bold hover:bg-gray-200 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, desc, headerColor }: { icon: React.ReactNode, title: string, desc: string, headerColor: string }) {
  return (
    <div className="relative group p-1 rounded-3xl bg-gradient-to-b from-white/10 to-white/0 hover:from-white/20 hover:to-white/5 transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500 pointer-events-none"></div>

      <div className="h-full bg-[#08080a] rounded-[22px] p-8 border border-white/5 relative overflow-hidden">
        {/* Subtle color glow at the top */}
        <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-b ${headerColor} opacity-50 blur-2xl`}></div>

        <div className="relative z-10">
          <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-2xl shadow-inner shadow-white/5">
            {icon}
          </div>
          <h4 className="text-xl font-bold text-white mb-3 tracking-tight">{title}</h4>
          <p className="text-gray-400 leading-relaxed text-sm font-medium">{desc}</p>
        </div>
      </div>
    </div>
  );
}


