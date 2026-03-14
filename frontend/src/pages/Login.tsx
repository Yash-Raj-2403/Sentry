import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, ArrowRight, Lock, Mail, Eye, EyeOff,
  CheckCircle2, AlertCircle, Loader2, Key
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { GlassCard } from '../components/ui/GlassCard';
import { cn } from '../lib/utils';

// Icons 
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);
const GitHubIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);
const MicrosoftIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.4 2H2v9.4h9.4V2z" fill="#F25022"/>
    <path d="M22 2h-9.4v9.4H22V2z" fill="#7FBA00"/>
    <path d="M11.4 12.6H2V22h9.4v-9.4z" fill="#00A4EF"/>
    <path d="M22 12.6h-9.4V22H22v-9.4z" fill="#FFB900"/>
  </svg>
);

const features = [
  'AI-powered threat detection in real time',
  'Zero-trust infrastructure enforcement',
  'Self-healing code & instant patching',
  'SOC 2 Type II & ISO 27001 compliant',
];

export default function Login() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/dashboard';

  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setLoading(true);
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (authError) { setError(authError.message); setLoading(false); return; }
    navigate(from, { replace: true });
  };

  const handleOAuth = async (provider: 'google' | 'github' | 'azure') => {
    setError(null);
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider, options: { redirectTo: `${window.location.origin}${from}` },
    });
    if (authError) setError(authError.message);
  };

  return (
    <div className="min-h-screen w-full flex bg-cyber-dark text-gray-100 relative overflow-hidden font-sans selection:bg-cyan-500/30">
        
       {/* Background Effects */}
       <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.03)_0%,transparent_100%)]" />
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px]" />
       </div>

       {/* Left Panel - Brand & Features */}
       <div className="hidden lg:flex w-1/2 relative z-10 flex-col justify-between p-12 lg:p-20 border-r border-white/5 bg-black/20 backdrop-blur-sm">
            <Link to="/" className="flex items-center gap-3 w-fit group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                    <Shield className="text-white fill-white/20" size={20} />
                </div>
                <span className="text-xl font-bold tracking-tight text-white">CYBERHELM</span>
            </Link>

            <div className="max-w-lg">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl font-bold leading-tight mb-6"
                >
                    Secure your infrastructure <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                        at the speed of AI.
                    </span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg text-gray-400 mb-8"
                >
                    Join thousands of security engineers using CyberHelm to detect, investigate, and remediate threats autonomously.
                </motion.p>
                <div className="space-y-4">
                    {features.map((f, i) => (
                        <motion.div 
                            key={f}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + (i * 0.1) }}
                            className="flex items-center gap-3 text-gray-300"
                        >
                            <CheckCircle2 className="text-cyan-400 shrink-0" size={20} />
                            <span>{f}</span>
                        </motion.div>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5 backdrop-blur-md max-w-sm">
                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white text-sm shadow-lg">AC</div>
                 <div>
                    <p className="text-xs italic text-gray-300 mb-1">"The most advanced autonomous security platform we've seen. It's like having a 24/7 Red Team."</p>
                    <p className="text-[10px] font-bold text-gray-500">ALEX CHEN, CISO AT TECHFLOW</p>
                 </div>
            </div>
       </div>

       {/* Right Panel - Login Form */}
       <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative z-10">
          <GlassCard className="w-full max-w-[420px] p-8" variant="scanline" intensity="medium">
             
             <div className="text-center mb-8">
                <div className="lg:hidden flex justify-center mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                        <Shield className="text-white fill-white/20" size={24} />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-gray-400 text-sm">Sign in to access your command center</p>
             </div>

             {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2 animate-pulse">
                    <AlertCircle size={16} />
                    {error}
                </div>
             )}

             <div className="space-y-3 mb-6">
                <button onClick={() => handleOAuth('google')} className="w-full flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all p-3 rounded-xl text-sm font-medium text-gray-200 group">
                    <GoogleIcon /> <span className="group-hover:text-white transition-colors">Continue with Google</span>
                </button>
                <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => handleOAuth('github')} className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all p-3 rounded-xl text-sm font-medium text-gray-200 group">
                        <GitHubIcon /> <span className="group-hover:text-white transition-colors">GitHub</span>
                    </button>
                    <button onClick={() => handleOAuth('azure')} className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all p-3 rounded-xl text-sm font-medium text-gray-200 group">
                        <MicrosoftIcon /> <span className="group-hover:text-white transition-colors">Microsoft</span>
                    </button>
                </div>
             </div>

             <div className="relative flex items-center justify-center mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
                <span className="relative bg-[#09090b] px-3 text-[10px] text-gray-500 uppercase font-bold tracking-wider">Or continue with email</span>
             </div>

             <form onSubmit={handleSignIn} className="space-y-5">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
                        <input 
                            type="email" 
                            required 
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-11 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <div className="flex justify-between items-center ml-1">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Password</label>
                        <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Forgot password?</a>
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-cyan-400 transition-colors" size={16} />
                        <input 
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-11 py-3 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/20 transition-all pr-11"
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <>Sign In <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>}
                </button>
             </form>
             
             <p className="text-center text-sm text-gray-500 mt-8">
                 Don't have an account? <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">Create account</Link>
             </p>
          </GlassCard>
       </div>
    </div>
  );
}
