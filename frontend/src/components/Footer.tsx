import { ShieldCheck, Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="relative pt-20 pb-10 overflow-hidden"
      style={{ background: '#07071a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>

      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: 800, height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.25), rgba(34,211,238,0.2), transparent)' }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{ width: 600, height: 200,
          background: 'radial-gradient(ellipse at top, rgba(99,102,241,0.07) 0%, transparent 70%)' }} />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">

          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-5 group w-fit">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', boxShadow: '0 0 16px rgba(99,102,241,0.3)' }}>
                <ShieldCheck size={16} className="text-white" />
              </div>
              <span className="text-[17px] font-extrabold tracking-tight" style={{ color: '#e8ecff' }}>CyberHelm</span>
            </Link>
            <p className="text-[13px] leading-relaxed mb-5" style={{ color: 'rgba(140,145,195,0.65)' }}>
              Autonomous security for the modern web. Detect, intercept, and fix vulnerabilities in real-time.
            </p>
            <div className="flex gap-3">
              {[<Twitter size={15} />, <Github size={15} />, <Linkedin size={15} />].map((icon, i) => (
                <a key={i} href="#"
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(160,165,210,0.55)' }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(99,102,241,0.15)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(99,102,241,0.3)';
                    (e.currentTarget as HTMLElement).style.color = '#818cf8';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                    (e.currentTarget as HTMLElement).style.color = 'rgba(160,165,210,0.55)';
                  }}>
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-widest mb-5"
              style={{ color: 'rgba(160,165,210,0.45)' }}>Product</h4>
            <ul className="space-y-3.5">
              {['Features','Integrations','Pricing','Changelog'].map(item => (
                <li key={item}>
                  <Link to="#" className="text-[13px] transition-colors"
                    style={{ color: 'rgba(140,145,195,0.6)' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#818cf8')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(140,145,195,0.6)')}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-widest mb-5"
              style={{ color: 'rgba(160,165,210,0.45)' }}>Resources</h4>
            <ul className="space-y-3.5">
              {['Documentation','API Reference','Community','Blog'].map(item => (
                <li key={item}>
                  <Link to="#" className="text-[13px] transition-colors"
                    style={{ color: 'rgba(140,145,195,0.6)' }}
                    onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#818cf8')}
                    onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(140,145,195,0.6)')}>
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[12px] font-bold uppercase tracking-widest mb-5"
              style={{ color: 'rgba(160,165,210,0.45)' }}>Contact</h4>
            <a href="mailto:support@cyberhelm.ai"
              className="flex items-center gap-2 text-[13px] transition-colors"
              style={{ color: 'rgba(140,145,195,0.6)' }}
              onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#22d3ee')}
              onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(140,145,195,0.6)')}>
              <Mail size={14} />
              support@cyberhelm.ai
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p className="text-[12px]" style={{ color: 'rgba(100,105,160,0.5)' }}>
            © 2026 CyberHelm Defense Systems Inc.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0">
            {['Privacy Policy','Terms of Service'].map(item => (
              <Link key={item} to="#" className="text-[12px] transition-colors"
                style={{ color: 'rgba(100,105,160,0.5)' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(160,165,210,0.7)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = 'rgba(100,105,160,0.5)')}>
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
