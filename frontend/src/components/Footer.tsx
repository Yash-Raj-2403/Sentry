import { ShieldCheck, Twitter, Github, Linkedin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white group-hover:bg-blue-500 transition-colors">
                <ShieldCheck size={18} />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Sentry.ai</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Autonomous security for the modern web. We detect, intercept, and fix vulnerabilities in real-time.
            </p>
            <div className="flex gap-4">
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Github size={18} />} />
              <SocialIcon icon={<Linkedin size={18} />} />
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="#" className="hover:text-blue-500 transition-colors">Features</Link></li>
              <li><Link to="#" className="hover:text-blue-500 transition-colors">Integrations</Link></li>
              <li><Link to="#" className="hover:text-blue-500 transition-colors">Pricing</Link></li>
              <li><Link to="#" className="hover:text-blue-500 transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Resources</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="#" className="hover:text-blue-500 transition-colors">Documentation</Link></li>
              <li><Link to="#" className="hover:text-blue-500 transition-colors">API Reference</Link></li>
              <li><Link to="#" className="hover:text-blue-500 transition-colors">Community</Link></li>
              <li><Link to="#" className="hover:text-blue-500 transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-6">Contact</h4>
            <a href="mailto:support@sentry.ai" className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-500 mb-2 transition-colors">
              <Mail size={16} /> support@sentry.ai
            </a>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>© 2026 Sentry Defense Systems Inc.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="#" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all">
      {icon}
    </a>
  );
}
