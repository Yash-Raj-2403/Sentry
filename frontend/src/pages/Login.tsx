import { useState } from 'react';
import {
  Shield, ArrowRight, Lock, Mail, Eye, EyeOff,
  CheckCircle2, AlertCircle, Loader2,
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// ── OAuth brand icons ────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
  </svg>
);

const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const MicrosoftIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.4 2H2v9.4h9.4V2z" fill="#F25022" />
    <path d="M22 2h-9.4v9.4H22V2z" fill="#7FBA00" />
    <path d="M11.4 12.6H2V22h9.4v-9.4z" fill="#00A4EF" />
    <path d="M22 12.6h-9.4V22H22v-9.4z" fill="#FFB900" />
  </svg>
);

const features = [
  'AI-powered threat detection in real time',
  'Zero-trust infrastructure enforcement',
  'Self-healing code & instant patching',
  'SOC 2 Type II & ISO 27001 compliant',
];

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ── Email / password sign-in ──────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // On success the AuthContext will update and ProtectedRoute will allow entry.
    navigate(from, { replace: true });
  };

  // ── OAuth sign-in helpers ─────────────────────────────────────────────────
  const handleOAuth = async (provider: 'google' | 'github' | 'azure') => {
    setError(null);
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}${from}` },
    });
    if (authError) setError(authError.message);
  };

  return (
    <div className="min-h-screen bg-[#030305] text-white font-sans flex overflow-hidden relative">

      {/* ── Left panel ── */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] relative overflow-hidden bg-[#070710] border-r border-white/5 p-12">
        {/* Radial glows */}
        <div className="absolute top-[-15%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Logo */}
        <Link to="/" className="relative z-10 inline-flex items-center gap-2.5 w-fit">
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Shield size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            CyberHelm
          </span>
        </Link>

        {/* Centre content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-bold uppercase tracking-widest mb-6 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Autonomous Security Platform
          </div>

          <h1 className="text-4xl xl:text-5xl font-bold leading-tight tracking-tight text-white mb-4">
            Your infrastructure,<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500">
              always defended.
            </span>
          </h1>
          <p className="text-gray-400 text-base leading-relaxed max-w-sm mb-10">
            CyberHelm's AI swarm monitors, investigates, and remediates threats before they become incidents.
          </p>

          <ul className="space-y-3.5">
            {features.map((f) => (
              <li key={f} className="flex items-center gap-3 text-sm text-gray-300">
                <CheckCircle2 size={16} className="text-cyan-500 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom testimonial */}
        <div className="relative z-10 border border-white/8 rounded-2xl bg-white/[0.03] backdrop-blur-sm p-5">
          <p className="text-sm text-gray-300 leading-relaxed italic mb-4">
            "CyberHelm cut our mean time to remediation from 6 hours to under 4 seconds. It's like having a thousand security engineers on call."
          </p>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white">AK</div>
            <div>
              <p className="text-xs font-semibold text-white">Arjun Kapoor</p>
              <p className="text-[11px] text-gray-500">CTO, NovaTech Systems</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
        {/* Mobile logo only */}
        <Link to="/" className="lg:hidden inline-flex items-center gap-2.5 mb-10">
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Shield size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
            CyberHelm
          </span>
        </Link>

        <div className="w-full max-w-[400px]">
          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight mb-1">Welcome back</h2>
            <p className="text-sm text-gray-400">Sign in to your CyberHelm account to continue.</p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Social auth buttons */}
          <div className="space-y-3 mb-6">
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white text-sm font-medium transition-all duration-200"
            >
              <GoogleIcon />
              <span>Continue with Google</span>
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleOAuth('github')}
                className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white text-sm font-medium transition-all duration-200"
              >
                <GitHubIcon />
                <span>GitHub</span>
              </button>
              <button
                type="button"
                onClick={() => handleOAuth('azure')}
                className="flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-white text-sm font-medium transition-all duration-200"
              >
                <MicrosoftIcon />
                <span>Microsoft</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">or continue with email</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSignIn}>
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail size={15} className="text-gray-600 group-focus-within:text-cyan-500 transition-colors duration-200" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#0c0c14] border border-white/8 text-white text-sm rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/60 pl-10 pr-4 py-3 placeholder-gray-600 transition-all outline-none hover:border-white/15"
                  placeholder="name@company.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-widest">
                  Password
                </label>
                <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock size={15} className="text-gray-600 group-focus-within:text-cyan-500 transition-colors duration-200" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0c0c14] border border-white/8 text-white text-sm rounded-xl focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/60 pl-10 pr-12 py-3 placeholder-gray-600 transition-all outline-none hover:border-white/15"
                  placeholder="••••••••••"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-600 hover:text-gray-400 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2.5 pt-1">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 rounded border border-white/15 bg-[#0c0c14] accent-cyan-500 cursor-pointer"
              />
              <label htmlFor="remember" className="text-sm text-gray-400 cursor-pointer select-none">
                Keep me signed in for 30 days
              </label>
            </div>

            {/* Submit */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="group relative w-full mt-2 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-black overflow-hidden transition-all duration-200 hover:scale-[1.01] hover:shadow-[0_0_30px_-8px_rgba(34,211,238,0.5)] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ background: 'linear-gradient(135deg, #22d3ee, #3b82f6, #8b5cf6)' }}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  <span className="relative z-10">Sign In</span>
                  <ArrowRight size={16} className="relative z-10 group-hover:translate-x-0.5 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
              Start free trial
            </Link>
          </div>

          {/* Security notice */}
          <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-gray-600">
            <Shield size={11} />
            <span>256-bit TLS encryption · SOC 2 compliant · Zero knowledge architecture</span>
          </div>
        </div>
      </div>
    </div>
  );
}
