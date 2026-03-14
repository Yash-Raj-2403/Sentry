// @ts-ignore
import { Link } from 'react-router-dom';
import {
  Zap,
  LayoutDashboard,
  GitMerge,
  Cpu,
  ArrowRight,
  Server,
  Lock,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Radio,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

/* ─────────────────────────────────────────────
   Feature Card
───────────────────────────────────────────── */
function FeatureCard({
  icon,
  title,
  desc,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  accent: string; // e.g. "#22d3ee"
}) {
  return (
    <div
      className="group relative rounded-2xl p-px overflow-hidden transition-transform duration-300 hover:-translate-y-1"
      style={{
        background: `linear-gradient(135deg, ${accent}33 0%, rgba(255,255,255,0.05) 50%, transparent 100%)`,
      }}
    >
      {/* Inner card */}
      <div
        className="relative h-full rounded-[15px] p-7 overflow-hidden"
        style={{ background: 'rgba(12,12,32,0.85)', backdropFilter: 'blur(16px)' }}
      >
        {/* Corner glow */}
        <div
          className="absolute -top-10 -left-10 w-32 h-32 rounded-full opacity-30 blur-2xl pointer-events-none transition-opacity duration-500 group-hover:opacity-60"
          style={{ background: accent }}
        />

        <div className="relative z-10">
          {/* Icon */}
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
            style={{
              background: `${accent}18`,
              border: `1px solid ${accent}35`,
            }}
          >
            {icon}
          </div>
          <h4 className="text-[16px] font-bold text-white mb-2 tracking-tight">{title}</h4>
          <p className="text-[13px] leading-relaxed" style={{ color: 'rgba(180,185,220,0.7)' }}>{desc}</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Stat Pill
───────────────────────────────────────────── */
function StatPill({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-bold" style={{ color }}>{value}</span>
      <span className="text-[11px] mt-0.5" style={{ color: 'rgba(180,185,220,0.5)' }}>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Home Page
───────────────────────────────────────────── */
export default function Home() {
  return (
    <div
      className="text-white font-sans overflow-x-hidden min-h-screen flex flex-col"
      style={{ background: '#080818', color: 'white' }}
    >
      <Header />

      {/* ═══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className="relative h-screen w-full overflow-hidden flex items-center">

        {/* ── Vibrant mesh-gradient background ── */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          {/* Indigo bloom — top center */}
          <div className="absolute" style={{
            top: '-20%', left: '20%',
            width: '900px', height: '700px',
            background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.45) 0%, transparent 65%)',
            filter: 'blur(1px)',
          }} />
          {/* Cyan flare — right */}
          <div className="absolute" style={{
            top: '-10%', right: '-5%',
            width: '700px', height: '700px',
            background: 'radial-gradient(ellipse at center, rgba(34,211,238,0.30) 0%, transparent 60%)',
          }} />
          {/* Violet pool — bottom left */}
          <div className="absolute" style={{
            bottom: '-15%', left: '-5%',
            width: '700px', height: '600px',
            background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.28) 0%, transparent 65%)',
          }} />
          {/* Pink accent — bottom right */}
          <div className="absolute" style={{
            bottom: '0%', right: '10%',
            width: '500px', height: '400px',
            background: 'radial-gradient(ellipse at center, rgba(236,72,153,0.15) 0%, transparent 65%)',
          }} />
          {/* Noise texture */}
          <div
            className="absolute inset-0 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.08'/%3E%3C/svg%3E")`,
              opacity: 0.4,
            }}
          />
          {/* Subtle dot grid */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            opacity: 0.6,
          }} />
        </div>

        {/* ── Spline Robot — right side ── */}
        <div
          className="absolute inset-0 pointer-events-auto overflow-hidden"
          style={{ zIndex: 1 }}
        >
          {/* The iframe: offset right */}
          <div className="absolute top-0 right-0 w-full h-full lg:w-[65%] lg:right-0">
            <iframe
              src="https://my.spline.design/nexbotrobotcharacterconcept-f9AJhCw5Liun2d3dqvHMsAC5/"
              frameBorder="0"
              width="100%"
              height="100%"
              className="w-full h-full pointer-events-auto"
              style={{
                transform: 'scale(1.05)',
                transformOrigin: 'center center',
                filter: 'brightness(1.1) saturate(1.2)',
                maskImage: 'radial-gradient(ellipse 80% 90% at 60% 50%, black 50%, transparent 85%)',
                WebkitMaskImage: 'radial-gradient(ellipse 80% 90% at 60% 50%, black 50%, transparent 85%)',
              }}
            />
            {/* Cover "Built with Spline" watermark at bottom-left of canvas */}
            <div
              className="absolute bottom-0 left-0 pointer-events-none"
              style={{
                width: '220px',
                height: '48px',
                background: 'linear-gradient(to right, #080818 60%, transparent 100%)',
                zIndex: 10,
              }}
            />
            {/* Also cover bottom-right corner */}
            <div
              className="absolute bottom-0 right-0 pointer-events-none"
              style={{
                width: '220px',
                height: '48px',
                background: 'linear-gradient(to left, #080818 60%, transparent 100%)',
                zIndex: 10,
              }}
            />
          </div>
          {/* Gradient veil over robot for left edge blending */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, #080818 18%, rgba(8,8,24,0.7) 38%, rgba(8,8,24,0.1) 58%, transparent 75%)',
            }}
          />
          {/* Top & bottom fade */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(8,8,24,0.5) 0%, transparent 15%, transparent 80%, rgba(8,8,24,0.6) 100%)',
            }}
          />
        </div>

        {/* ── Hero Text Content ── */}
        <div
          className="relative max-w-7xl mx-auto w-full flex items-center px-8"
          style={{ zIndex: 10, pointerEvents: 'none' }}
        >
          <div
            className="max-w-[580px] opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.15s', animationFillMode: 'forwards', pointerEvents: 'auto' }}
          >
            {/* Headline */}
            <h1 className="font-bold tracking-tight leading-[1.06] mb-6" style={{ fontSize: 'clamp(42px, 5.5vw, 72px)' }}>
              <span
                className="block text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(160deg, #ffffff 0%, #c7d2fe 60%, #a5b4fc 100%)' }}
              >
                Autonomous
              </span>
              <span
                className="block text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(160deg, #e0e7ff 0%, #c7d2fe 50%, #a5b4fc 100%)' }}
              >
                security for your
              </span>
              <span
                className="block text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(90deg, #22d3ee 0%, #818cf8 40%, #e879f9 100%)' }}
              >
                infrastructure
              </span>
            </h1>

            {/* Subheading */}
            <p
              className="text-[17px] leading-relaxed mb-10 max-w-[480px]"
              style={{ color: 'rgba(196,202,240,0.75)' }}
            >
              CyberHelm's AI agent swarm autonomously investigates,
              patches, and deploys fixes — before threats can exploit them.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                to="/register"
                className="group relative flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-[15px] overflow-hidden transition-all duration-200 hover:scale-[1.03]"
                style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
                  boxShadow: '0 0 32px -6px rgba(139,92,246,0.7), inset 0 1px 0 rgba(255,255,255,0.15)',
                  color: 'white',
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
                {/* Shimmer on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c084fc 100%)' }}
                />
              </Link>

              <Link
                to="/dashboard"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-[15px] transition-all duration-200 hover:scale-[1.03]"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: 'rgba(210,215,255,0.85)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                }}
              >
                <LayoutDashboard size={16} style={{ opacity: 0.6 }} />
                View Dashboard
              </Link>
            </div>

            {/* Trust row */}
            <div className="flex items-center gap-6">
              {[
                { icon: <ShieldCheck size={13} />,   text: 'Zero-trust by default' },
                { icon: <Radio size={13} />,          text: 'Real-time response' },
                { icon: <CheckCircle2 size={13} />,   text: 'SOC 2 ready' },
              ].map((b) => (
                <div
                  key={b.text}
                  className="flex items-center gap-1.5 text-[11px]"
                  style={{ color: 'rgba(160,165,210,0.55)' }}
                >
                  <span style={{ opacity: 0.7 }}>{b.icon}</span>
                  {b.text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Stats bar — bottom of hero ── */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none opacity-0 animate-fade-in-up"
          style={{ zIndex: 10, animationDelay: '0.6s', animationFillMode: 'forwards' }}
        >
          <div
            className="mx-auto max-w-7xl px-8 pb-10"
          >
            <div
              className="inline-flex items-center gap-10 px-8 py-4 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 4px 32px rgba(0,0,0,0.4)',
              }}
            >
              <StatPill value="1,247" label="Threats Blocked"  color="#22d3ee" />
              <div className="w-px h-8" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <StatPill value="5"     label="Active Agents"    color="#a78bfa" />
              <div className="w-px h-8" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <StatPill value="<2ms"  label="Avg Response"     color="#f0abfc" />
              <div className="w-px h-8" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <StatPill value="99.9%" label="Uptime"           color="#6ee7b7" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURES
      ══════════════════════════════════════ */}
      <section
        id="features"
        className="relative py-32 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #080818 0%, #0b0b22 100%)' }}
      >
        {/* Section background accent */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div className="absolute" style={{
            top: '0%', left: '50%', transform: 'translateX(-50%)',
            width: '900px', height: '400px',
            background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.18) 0%, transparent 70%)',
          }} />
          <div className="absolute" style={{
            bottom: '0%', right: '10%',
            width: '500px', height: '300px',
            background: 'radial-gradient(ellipse at center, rgba(168,85,247,0.12) 0%, transparent 65%)',
          }} />
        </div>

        {/* Top divider glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px pointer-events-none" style={{
          width: '70%',
          background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.4), rgba(34,211,238,0.3), transparent)',
        }} />

        <div className="relative max-w-7xl mx-auto" style={{ zIndex: 1 }}>
          {/* Section header */}
          <div className="text-center mb-20">
            <div
              className="inline-block text-[11px] font-bold uppercase tracking-widest mb-5 px-3.5 py-1.5 rounded-full"
              style={{
                color: '#a78bfa',
                background: 'rgba(139,92,246,0.1)',
                border: '1px solid rgba(139,92,246,0.25)',
              }}
            >
              Capabilities
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-5">
              <span
                className="text-transparent bg-clip-text"
                style={{ backgroundImage: 'linear-gradient(160deg, #ffffff 0%, #c7d2fe 100%)' }}
              >
                Autonomous Defense Grid
              </span>
            </h2>
            <p
              className="text-lg max-w-2xl mx-auto leading-relaxed"
              style={{ color: 'rgba(180,185,220,0.65)' }}
            >
              Replace manual playbooks with intelligent agents. CyberHelm monitors every layer of your stack —
              from network edge to application code.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              icon={<Zap size={20} color="#fbbf24" />}
              title="Instant Remediation"
              desc="Detects threats and applies patches instantly. Reduce MTTR from days to milliseconds."
              accent="#f59e0b"
            />
            <FeatureCard
              icon={<Cpu size={20} color="#22d3ee" />}
              title="Agent Swarm"
              desc="Decentralized agents coordinate to investigate anomalies across your entire infrastructure graph."
              accent="#22d3ee"
            />
            <FeatureCard
              icon={<GitMerge size={20} color="#818cf8" />}
              title="Self-Healing Code"
              desc="CyberHelm identifies the vulnerability and auto-generates code fixes — not just firewall rules."
              accent="#818cf8"
            />
            <FeatureCard
              icon={<Lock size={20} color="#34d399" />}
              title="Perimeter Zero"
              desc="Identity-aware security that assumes breach and verifies every request, internally and externally."
              accent="#34d399"
            />
            <FeatureCard
              icon={<AlertTriangle size={20} color="#c084fc" />}
              title="Live Telemetry"
              desc="Real-time visualization of attack vectors as they happen. Watch the swarm neutralize threats live."
              accent="#a855f7"
            />
            <FeatureCard
              icon={<Server size={20} color="#fb7185" />}
              title="Infrastructure As Code"
              desc="Deep integration with Terraform and Kubernetes to enforce security policies at the deploy level."
              accent="#f43f5e"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS  (3 steps)
      ══════════════════════════════════════ */}
      <section
        className="relative py-28 px-6 overflow-hidden"
        style={{ background: '#0b0b22' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div className="absolute" style={{
            top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '800px', height: '400px',
            background: 'radial-gradient(ellipse at center, rgba(34,211,238,0.08) 0%, transparent 65%)',
          }} />
        </div>

        <div className="relative max-w-5xl mx-auto text-center" style={{ zIndex: 1 }}>
          <div
            className="inline-block text-[11px] font-bold uppercase tracking-widest mb-5 px-3.5 py-1.5 rounded-full"
            style={{
              color: '#67e8f9',
              background: 'rgba(34,211,238,0.08)',
              border: '1px solid rgba(34,211,238,0.22)',
            }}
          >
            How It Works
          </div>
          <h2
            className="text-4xl lg:text-5xl font-bold tracking-tight mb-16"
            style={{ color: '#e0e7ff' }}
          >
            From threat to fix in milliseconds
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Detect',
                desc: 'Sensor agents continuously monitor network traffic, logs, and API calls for anomalies.',
                color: '#22d3ee',
              },
              {
                step: '02',
                title: 'Analyse',
                desc: 'The AI orchestrator assembles a swarm to triage, correlate, and classify the incident.',
                color: '#a78bfa',
              },
              {
                step: '03',
                title: 'Remediate',
                desc: 'Patch agents isolate the threat, apply fixes, and update policies — zero human delay.',
                color: '#f0abfc',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="relative rounded-2xl p-8 text-left"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div
                  className="text-[42px] font-black mb-4 leading-none"
                  style={{
                    color: s.color,
                    opacity: 0.25,
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {s.step}
                </div>
                <h3
                  className="text-xl font-bold mb-3"
                  style={{ color: s.color }}
                >
                  {s.title}
                </h3>
                <p className="text-[14px] leading-relaxed" style={{ color: 'rgba(180,185,220,0.65)' }}>
                  {s.desc}
                </p>
                {/* Bottom accent */}
                <div
                  className="absolute bottom-0 left-8 right-8 h-px"
                  style={{ background: `linear-gradient(90deg, transparent, ${s.color}50, transparent)` }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA
      ══════════════════════════════════════ */}
      <section
        className="relative py-32 px-6 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #0b0b22 0%, #080818 100%)' }}
      >
        {/* Big glow orb */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{ zIndex: 0 }}>
          <div style={{
            width: '700px', height: '400px',
            background: 'radial-gradient(ellipse at center, rgba(99,102,241,0.22) 0%, rgba(168,85,247,0.1) 40%, transparent 70%)',
            filter: 'blur(2px)',
          }} />
        </div>

        {/* Top divider */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px pointer-events-none" style={{
          width: '50%',
          background: 'linear-gradient(90deg, transparent, rgba(139,92,246,0.35), transparent)',
        }} />

        <div className="relative max-w-3xl mx-auto text-center" style={{ zIndex: 1 }}>
          <h2
            className="text-5xl lg:text-[68px] font-bold tracking-tighter mb-6 leading-[1.05]"
          >
            <span
              className="text-transparent bg-clip-text block"
              style={{ backgroundImage: 'linear-gradient(160deg, #ffffff 0%, #c7d2fe 60%, #a5b4fc 100%)' }}
            >
              Ready to
            </span>
            <span
              className="text-transparent bg-clip-text block"
              style={{ backgroundImage: 'linear-gradient(90deg, #22d3ee 0%, #818cf8 50%, #e879f9 100%)' }}
            >
              automate security?
            </span>
          </h2>
          <p
            className="text-xl mb-12 max-w-xl mx-auto leading-relaxed"
            style={{ color: 'rgba(196,202,240,0.65)' }}
          >
            Deploy CyberHelm today and let the AI swarm handle every threat —
            so your team can focus on building.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="group relative flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold text-[17px] overflow-hidden transition-all duration-200 hover:scale-[1.03]"
              style={{
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
                boxShadow: '0 0 48px -8px rgba(139,92,246,0.65), inset 0 1px 0 rgba(255,255,255,0.15)',
                color: 'white',
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Free
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c084fc 100%)' }}
              />
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold text-[17px] transition-all duration-200 hover:scale-[1.03]"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(210,215,255,0.8)',
                backdropFilter: 'blur(12px)',
              }}
            >
              Explore Dashboard
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
